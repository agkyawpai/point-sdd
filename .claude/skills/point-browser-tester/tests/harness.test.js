'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { test, describe, beforeEach, afterEach } = require('node:test');

const harness = require('../scripts/harness');

const {
  abortMutations,
  addCaseResult,
  assertMutationApproved,
  createRun,
  finalizeRun,
  getCredentials,
  parseRunArgs,
  recordConsole,
  recordNetwork,
  recordPageError,
  screenshot,
  shouldRunCase,
} = harness;

let root;
const baseOptions = () => ({ evidenceRoot: root, topic: 'Customers', workbook: 'Test Case - Customers.xlsx', environment: 'local', tester: 'QA One', date: '2026/10/02' });
const readResults = (run) => JSON.parse(fs.readFileSync(run.resultsPath, 'utf8'));
const readDiagnostics = (run, name) => fs.readFileSync(path.join(run.directory, 'diagnostics', name), 'utf8');
const noPrompt = () => Promise.reject(new harness.HarnessError('no tty', 'CREDENTIALS_UNAVAILABLE'));

beforeEach(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'point-harness-'));
});

afterEach(() => {
  fs.rmSync(root, { recursive: true, force: true });
});

describe('runs', () => {
  test('creates an evidence run directory beside the workbook', async () => {
    const run = await createRun(baseOptions());
    assert.equal(path.dirname(run.directory), path.join(root, 'Customers Evidence', 'runs'));
    assert.match(run.runId, /^\d{8}T\d{6}Z-customers-[0-9a-f]{6}$/);
    assert.ok(fs.statSync(path.join(run.directory, 'screenshots')).isDirectory());
    assert.ok(fs.statSync(path.join(run.directory, 'diagnostics')).isDirectory());
    const saved = readResults(run);
    assert.equal(saved.schemaVersion, 1);
    assert.equal(saved.workbook, 'Test Case - Customers.xlsx');
    assert.deepEqual(saved.cases, []);
  });

  test('every attempt gets a new run id', async () => {
    const first = await createRun(baseOptions());
    const second = await createRun(baseOptions());
    assert.notEqual(first.directory, second.directory);
  });

  test('stores only the workbook file name, never an absolute path', async () => {
    const run = await createRun({ ...baseOptions(), workbook: path.join(root, 'Test Case - Customers.xlsx') });
    assert.equal(readResults(run).workbook, 'Test Case - Customers.xlsx');
    assert.doesNotMatch(fs.readFileSync(run.resultsPath, 'utf8'), /[A-Za-z]:\\\\|"\/(?:tmp|home)/);
  });

  test('requires topic, workbook and environment', async () => {
    await assert.rejects(createRun({ evidenceRoot: root, topic: 'x', workbook: 'x.xlsx' }), /required/);
  });

  test('resumes only with an explicit run id and keeps prior results', async () => {
    const first = await createRun(baseOptions());
    addCaseResult(first, { caseNo: 1, status: 'PASS', observed: 'ok' });
    const resumed = await createRun({ ...baseOptions(), runId: first.runId });
    assert.equal(resumed.directory, first.directory);
    assert.equal(resumed.results.length, 1);
    assert.equal(shouldRunCase(resumed, 1), false);
    assert.equal(shouldRunCase(resumed, 2), true);
    assert.throws(() => addCaseResult(resumed, { caseNo: 1, status: 'FAIL' }), /Duplicate/);
    addCaseResult(resumed, { caseNo: 2, status: 'FAIL', observed: 'contradiction' });
    const saved = readResults(resumed);
    assert.deepEqual(saved.cases.map((entry) => entry.caseNo), [1, 2]);
    assert.equal(saved.resumedAt.length, 1);
  });

  test('refuses to resume a missing run or one for a different workbook', async () => {
    await assert.rejects(createRun({ ...baseOptions(), runId: 'does-not-exist' }), (error) => error.code === 'RUN_NOT_FOUND');
    const first = await createRun(baseOptions());
    await assert.rejects(createRun({ ...baseOptions(), workbook: 'Other.xlsx', runId: first.runId }), (error) => error.code === 'RUN_MISMATCH');
    await assert.rejects(createRun({ ...baseOptions(), environment: 'uat', runId: first.runId }), (error) => error.code === 'RUN_MISMATCH');
    await assert.rejects(createRun({ ...baseOptions(), runId: '../escape' }), (error) => error.code === 'BAD_RUN_ID');
  });

  test('resuming a finalized run clears completedAt until finalized again', async () => {
    const first = await createRun(baseOptions());
    await finalizeRun(first);
    const resumed = await createRun({ ...baseOptions(), runId: first.runId });
    assert.equal(readResults(resumed).completedAt, undefined);
  });

  test('checkpoints leave no temporary files behind', async () => {
    const run = await createRun(baseOptions());
    addCaseResult(run, { caseNo: 1, status: 'PASS' });
    assert.deepEqual(fs.readdirSync(run.directory).filter((name) => name.endsWith('.tmp')), []);
  });
});

describe('case results', () => {
  test('checkpoints after every case with tester and date defaults', async () => {
    const run = await createRun(baseOptions());
    addCaseResult(run, { caseNo: 3, row: 9, status: 'PASS', scope: 'browser', mutation: 'read-only', observed: 'Visible', evidence: 'screenshots/TC03-list.png' });
    const [entry] = readResults(run).cases;
    assert.deepEqual(entry, {
      caseNo: 3, row: 9, status: 'PASS', scope: 'browser', mutation: 'read-only', observed: 'Visible',
      evidence: ['screenshots/TC03-list.png'], tester: 'QA One', date: '2026/10/02',
    });
  });

  test('drops fields outside the result contract', async () => {
    const run = await createRun(baseOptions());
    addCaseResult(run, { caseNo: 1, status: 'PASS', credentials: { username: 'hidden-user', password: 'hidden-password' }, cookie: 'abc' });
    const text = fs.readFileSync(run.resultsPath, 'utf8');
    assert.doesNotMatch(text, /hidden-user|hidden-password|credentials|cookie/);
  });

  test('validates case number, status, scope and evidence paths', async () => {
    const run = await createRun(baseOptions());
    assert.throws(() => addCaseResult(run, { caseNo: '1', status: 'PASS' }), /integer/);
    assert.throws(() => addCaseResult(run, { caseNo: 1, status: 'OK' }), /status/);
    assert.throws(() => addCaseResult(run, { caseNo: 1, status: 'PASS', scope: 'api' }), /scope/);
    assert.throws(() => addCaseResult(run, { caseNo: 1, status: 'PASS', mutation: 'sometimes' }), /mutation/);
    for (const bad of ['C:\\shots\\a.png', '/tmp/a.png', '../a.png', '~/a.png', 'https://x.test/a.png', '']) {
      assert.throws(() => addCaseResult(run, { caseNo: 1, status: 'PASS', evidence: bad }), /Evidence path/, bad);
    }
    assert.equal(readResults(run).cases.length, 0);
    const entry = addCaseResult(run, { caseNo: 1, status: 'BLOCKED', mutation: 'data', evidence: ['screenshots\\TC01.png'], blocker: 'No seed data' });
    assert.deepEqual(entry.evidence, ['screenshots/TC01.png']);
    assert.equal(entry.mutation, 'data-mutating');
  });

  test('summary is built from results with totals and escaped cells', async () => {
    const run = await createRun(baseOptions());
    addCaseResult(run, { caseNo: 2, status: 'FAIL', observed: 'Shown | twice\nsecond line' });
    addCaseResult(run, { caseNo: 1, status: 'PASS', observed: 'ok' });
    addCaseResult(run, { caseNo: 3, status: 'BLOCKED', blocker: 'No barber exists', cleanup: 'not needed' });
    addCaseResult(run, { caseNo: 4, status: 'OUT_OF_SCOPE', scope: 'standalone-api-db' });
    const { counts, summaryPath } = await finalizeRun(run);
    assert.deepEqual(counts, { PASS: 1, FAIL: 1, BLOCKED: 1, OUT_OF_SCOPE: 1, NOT_RUN: 0 });
    const summary = fs.readFileSync(summaryPath, 'utf8');
    assert.match(summary, /PASS: 1 {2}FAIL: 1 {2}BLOCKED: 1 {2}OUT_OF_SCOPE: 1 {2}NOT_RUN: 0/);
    assert.match(summary, /Shown \\\| twice<br>second line/);
    assert.match(summary, /Blocker: No barber exists Cleanup: not needed/);
    assert.ok(summary.indexOf('| 1 |') < summary.indexOf('| 2 |'));
    assert.ok(readResults(run).completedAt);
  });

  test('abortMutations is recorded in results and summary', async () => {
    const run = await createRun(baseOptions());
    abortMutations(run, 'Cleanup of case 5 not verified');
    assert.equal(readResults(run).mutationsAborted, 'Cleanup of case 5 not verified');
    await finalizeRun(run);
    assert.match(fs.readFileSync(run.summaryPath, 'utf8'), /Mutating cases stopped: Cleanup of case 5/);
  });
});

describe('credentials and sanitizing', () => {
  test('reads POINT_TEST_<PROFILE>_USER and _PASSWORD', async () => {
    const credentials = await getCredentials('front desk', { env: { POINT_TEST_FRONT_DESK_USER: 'u1', POINT_TEST_FRONT_DESK_PASSWORD: 'p1' }, prompt: noPrompt });
    assert.deepEqual({ ...credentials }, { username: 'u1', password: 'p1' });
  });

  test('accepts _USERNAME and prompts only for what is missing', async () => {
    const asked = [];
    const prompt = async (label) => { asked.push(label); return 'typed-password'; };
    const credentials = await getCredentials('admin', { env: { POINT_TEST_ADMIN_USERNAME: 'admin-user' }, prompt });
    assert.equal(credentials.password, 'typed-password');
    assert.deepEqual(asked, ['admin password']);
  });

  test('fails with CREDENTIALS_UNAVAILABLE when no env and no terminal', async () => {
    await assert.rejects(getCredentials('admin', { env: {}, prompt: noPrompt }), (error) => error.code === 'CREDENTIALS_UNAVAILABLE');
    const nonTty = { isTTY: false };
    await assert.rejects(harness.promptHidden('admin password', { input: nonTty, output: nonTty }), (error) => error.code === 'CREDENTIALS_UNAVAILABLE');
  });

  test('credentials never reach results, diagnostics or summary', async () => {
    const run = await createRun(baseOptions());
    await getCredentials('admin', { env: { POINT_TEST_ADMIN_USER: 'hidden-user', POINT_TEST_ADMIN_PASSWORD: 'hidden-password' }, run, prompt: noPrompt });
    assert.ok(!Object.keys(run).includes('secretValues'));
    recordConsole(run, { type: 'error', text: 'login failed for hidden-user with hidden-password' });
    recordPageError(run, { message: 'hidden-password exploded' });
    recordNetwork(run, { method: 'post', url: 'https://hidden-user:hidden-password@example.test/login?user=hidden-user&next=/home', status: 401, resourceType: 'fetch' });
    addCaseResult(run, { caseNo: 1, status: 'FAIL', observed: 'Error banner said hidden-password is wrong', expected: 'user hidden-user' });
    await finalizeRun(run);
    const everything = [
      fs.readFileSync(run.resultsPath, 'utf8'),
      fs.readFileSync(run.summaryPath, 'utf8'),
      readDiagnostics(run, 'console.jsonl'),
      readDiagnostics(run, 'page-errors.jsonl'),
      readDiagnostics(run, 'network.jsonl'),
    ].join('\n');
    assert.doesNotMatch(everything, /hidden-user|hidden-password/);
    assert.match(everything, /\[REDACTED\]/);
  });

  test('network records redact token-like query values and keep only allowlisted fields', async () => {
    const run = await createRun(baseOptions());
    recordNetwork(run, {
      method: 'get', url: 'https://example.test/cb?code=abc123&access_token=zzz&page=2', status: 200, resourceType: 'document',
      headers: { authorization: 'Bearer secret' }, body: 'password=1',
    });
    const record = JSON.parse(readDiagnostics(run, 'network.jsonl').trim());
    assert.deepEqual(Object.keys(record).sort(), ['at', 'durationMs', 'method', 'resourceType', 'status', 'url']);
    assert.equal(record.method, 'GET');
    assert.match(record.url, /code=\[REDACTED\]/);
    assert.match(record.url, /access_token=\[REDACTED\]/);
    assert.match(record.url, /page=2/);
    assert.doesNotMatch(record.url, /abc123|zzz/);
  });

  test('console text redacts bearer tokens and password assignments', async () => {
    const run = await createRun(baseOptions());
    recordConsole(run, { type: 'log', text: 'Authorization: Bearer abcdefghijklmnop password=letmein' });
    const text = readDiagnostics(run, 'console.jsonl');
    assert.doesNotMatch(text, /abcdefghijklmnop|letmein/);
  });
});

describe('mutation approval', () => {
  const quiet = { env: {}, argv: [] };

  test('read-only cases need no approval', () => {
    assert.equal(assertMutationApproved('read-only', quiet), true);
    assert.equal(assertMutationApproved(undefined, quiet), true);
  });

  test('data mutations need explicit approval', () => {
    assert.throws(() => assertMutationApproved('data-mutating', quiet), (error) => error.code === 'MUTATION_NOT_APPROVED');
    assert.ok(assertMutationApproved('data-mutating', { ...quiet, approveMutations: true }));
    assert.ok(assertMutationApproved('data', { env: {}, argv: ['--approve-mutations'] }));
    assert.ok(assertMutationApproved('data-mutating', { env: { POINT_APPROVE_MUTATIONS: '1' }, argv: [] }));
  });

  test('RBAC mutations need both approvals', () => {
    assert.throws(() => assertMutationApproved('RBAC-mutating', { ...quiet, approveMutations: true }), /approval/);
    assert.throws(() => assertMutationApproved('rbac', { ...quiet, approveRbacMutations: true }), /approval/);
    assert.ok(assertMutationApproved('RBAC-mutating', { env: {}, argv: ['--approve-mutations', '--approve-rbac-mutations'] }));
  });

  test('unknown mutation classes are rejected', () => {
    assert.throws(() => assertMutationApproved('maybe', quiet), (error) => error.code === 'BAD_MUTATION_CLASS');
  });
});

describe('arguments', () => {
  test('parses approvals, resume id and case selection', () => {
    const options = parseRunArgs(['--approve-mutations', '--resume', 'run-1', '--cases=1,3-5']);
    assert.equal(options.approveMutations, true);
    assert.equal(options.approveRbacMutations, false);
    assert.equal(options.runId, 'run-1');
    assert.deepEqual([...options.cases], [1, 3, 4, 5]);
    assert.throws(() => parseRunArgs(['--cases', 'x']), /Invalid case/);
    assert.throws(() => parseRunArgs(['--resume']), /Missing value/);
  });

  test('shouldRunCase honours --cases', async () => {
    const run = await createRun(baseOptions());
    const { cases } = parseRunArgs(['--cases', '2']);
    assert.equal(shouldRunCase(run, 1, { cases }), false);
    assert.equal(shouldRunCase(run, 2, { cases }), true);
  });
});

describe('screenshots', () => {
  function fakePage(url) {
    const calls = [];
    return {
      calls,
      url: () => url,
      evaluate: async (fn, arg) => { calls.push(['evaluate', arg]); },
      screenshot: async ({ path: target, fullPage }) => { calls.push(['screenshot', fullPage]); fs.writeFileSync(target, 'png'); },
    };
  }

  test('saves under screenshots/ and returns a relative path', async () => {
    const run = await createRun(baseOptions());
    const page = fakePage('https://example.test/customers');
    const relative = await screenshot(run, page, 'TC01-list.png');
    assert.equal(relative, 'screenshots/TC01-list.png');
    assert.ok(fs.existsSync(path.join(run.directory, 'screenshots', 'TC01-list.png')));
    assert.deepEqual(page.calls, [['screenshot', true]]);
  });

  test('URL stamp uses the sanitized URL and is removed afterwards', async () => {
    const run = await createRun(baseOptions());
    const page = fakePage('https://example.test/customers?page=2&token=secret-value');
    await screenshot(run, page, 'TC10-page2-url.png', { stampUrl: true });
    assert.equal(page.calls.length, 3);
    assert.match(page.calls[0][1].text, /page=2&token=\[REDACTED\]/);
    assert.equal(page.calls[2][1], '__point_url_stamp');
  });

  test('rejects unsafe names and overwriting', async () => {
    const run = await createRun(baseOptions());
    const page = fakePage('https://example.test/');
    for (const name of ['../x.png', 'sub/x.png', 'C:\\x.png', 'x.jpg']) {
      await assert.rejects(screenshot(run, page, name), /Screenshot names/, name);
    }
    await screenshot(run, page, 'TC01-a.png');
    await assert.rejects(screenshot(run, page, 'TC01-a.png'), (error) => error.code === 'EVIDENCE_EXISTS');
  });
});

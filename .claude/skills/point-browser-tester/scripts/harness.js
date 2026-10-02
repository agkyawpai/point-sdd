'use strict';

// Shared harness for Point browser test runners.
//
// Case runners (under work/browser-tests/<topic>/) own selectors and business
// flows. This module owns everything that must behave the same way in every
// run: credentials, mutation approval, run directories, checkpointed results,
// sanitized diagnostics, screenshots and the Markdown summary.

const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const readline = require('node:readline');

const SCHEMA_VERSION = 1;
const STATUSES = Object.freeze(['PASS', 'FAIL', 'BLOCKED', 'OUT_OF_SCOPE', 'NOT_RUN']);
const SCOPES = Object.freeze(['browser', 'browser-context', 'standalone-api-db', 'ambiguous']);
const ENV_PREFIX = 'POINT_TEST_';
const URL_STAMP_ID = '__point_url_stamp';
const REDACTED = '[REDACTED]';
const SENSITIVE_QUERY_KEYS = /^(?:.*token.*|.*password.*|passwd|pwd|.*secret.*|code|state|.*session.*|.*auth.*|.*key|signature|sig|credential.*)$/i;
const RESULT_FIELDS = ['caseNo', 'row', 'status', 'scope', 'mutation', 'expected', 'observed', 'blocker', 'cleanup', 'evidence', 'tester', 'date'];

// ---------------------------------------------------------------------------
// Errors

class HarnessError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'HarnessError';
    this.code = code;
  }
}

// ---------------------------------------------------------------------------
// Command-line options shared by all runners

function parseRunArgs(argv = process.argv.slice(2)) {
  const options = { approveMutations: false, approveRbacMutations: false, runId: null, cases: null };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const takeValue = () => {
      const inline = arg.includes('=') ? arg.slice(arg.indexOf('=') + 1) : null;
      if (inline !== null) return inline;
      index += 1;
      if (index >= argv.length) throw new HarnessError(`Missing value for ${arg}`, 'BAD_ARGUMENT');
      return argv[index];
    };
    if (arg === '--approve-mutations') options.approveMutations = true;
    else if (arg === '--approve-rbac-mutations') options.approveRbacMutations = true;
    else if (arg === '--resume' || arg.startsWith('--resume=') || arg === '--run-id' || arg.startsWith('--run-id=')) options.runId = takeValue();
    else if (arg === '--cases' || arg.startsWith('--cases=')) options.cases = parseCaseList(takeValue());
  }
  return options;
}

function parseCaseList(text) {
  const cases = new Set();
  for (const part of String(text).split(',').map((value) => value.trim()).filter(Boolean)) {
    const range = part.match(/^(\d+)-(\d+)$/);
    if (range) {
      const [start, end] = [Number(range[1]), Number(range[2])];
      if (start > end) throw new HarnessError(`Invalid case range: ${part}`, 'BAD_ARGUMENT');
      for (let caseNo = start; caseNo <= end; caseNo += 1) cases.add(caseNo);
    } else if (/^\d+$/.test(part)) {
      cases.add(Number(part));
    } else {
      throw new HarnessError(`Invalid case number: ${part}`, 'BAD_ARGUMENT');
    }
  }
  return cases;
}

// ---------------------------------------------------------------------------
// Mutation approval

function normalizeMutation(mutation) {
  const value = String(mutation || 'read-only').trim().toLowerCase();
  if (value === 'read-only' || value === 'readonly' || value === 'none') return 'read-only';
  if (value === 'data' || value === 'data-mutating') return 'data-mutating';
  if (value === 'rbac' || value === 'rbac-mutating') return 'rbac-mutating';
  throw new HarnessError(`Unknown mutation class: ${mutation}`, 'BAD_MUTATION_CLASS');
}

// Throws unless the mutation class has been explicitly approved for this run.
// Approval sources: options, --approve-* flags in argv, or POINT_APPROVE_* = 1.
// RBAC changes also require data-mutation approval.
function assertMutationApproved(mutation, { approveMutations = false, approveRbacMutations = false, env = process.env, argv = process.argv.slice(2) } = {}) {
  const kind = normalizeMutation(mutation);
  if (kind === 'read-only') return true;
  const flags = new Set(argv);
  const dataApproved = approveMutations || flags.has('--approve-mutations') || env.POINT_APPROVE_MUTATIONS === '1';
  const rbacApproved = approveRbacMutations || flags.has('--approve-rbac-mutations') || env.POINT_APPROVE_RBAC_MUTATIONS === '1';
  if (kind === 'data-mutating' && dataApproved) return true;
  if (kind === 'rbac-mutating' && dataApproved && rbacApproved) return true;
  const needed = kind === 'data-mutating' ? '--approve-mutations' : '--approve-mutations and --approve-rbac-mutations';
  throw new HarnessError(`Explicit approval is required for ${kind} cases (${needed})`, 'MUTATION_NOT_APPROVED');
}

// ---------------------------------------------------------------------------
// Paths and files

function toPortable(value) {
  if (typeof value !== 'string' || !value.trim()) throw new HarnessError('Evidence paths must be non-empty strings', 'BAD_EVIDENCE_PATH');
  const normalized = value.trim().split('\\').join('/');
  const isAbsolute = normalized.startsWith('/') || normalized.startsWith('~') || /^[A-Za-z]:/.test(normalized) || /^[a-z]+:\/\//i.test(normalized);
  if (isAbsolute || normalized.split('/').includes('..')) {
    throw new HarnessError(`Evidence path must be relative to the run directory: ${value}`, 'BAD_EVIDENCE_PATH');
  }
  return normalized.replace(/^\.\//, '');
}

function atomicWrite(filePath, contents) {
  const temporary = `${filePath}.${process.pid}.${crypto.randomBytes(3).toString('hex')}.tmp`;
  fs.writeFileSync(temporary, contents, 'utf8');
  // On Windows a reader, indexer or antivirus scan can briefly lock the target;
  // retry the rename a few times before giving up.
  for (let attempt = 0; ; attempt += 1) {
    try {
      fs.renameSync(temporary, filePath);
      return;
    } catch (error) {
      if (attempt < 20 && ['EPERM', 'EACCES', 'EBUSY'].includes(error.code)) {
        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 25);
        continue;
      }
      fs.rmSync(temporary, { force: true });
      throw error;
    }
  }
}

function utcStamp(date = new Date()) {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

function localDate(date = new Date()) {
  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())}`;
}

function slugify(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48) || 'run';
}

function relativeToRun(run, filePath) {
  return path.relative(run.directory, filePath).split(path.sep).join('/');
}

// ---------------------------------------------------------------------------
// Runs

function runsRoot(evidenceRoot, topic) {
  return path.resolve(evidenceRoot, `${topic} Evidence`, 'runs');
}

// Creates a fresh run directory, or resumes one when an explicit runId is given.
// A fresh run never reuses an existing directory; a resume never starts from an
// empty result list and refuses to continue a run for a different topic,
// workbook or environment.
async function createRun({ evidenceRoot, topic, workbook, environment, runId, tester, date } = {}) {
  if (!topic || !workbook || !environment) throw new HarnessError('topic, workbook, and environment are required', 'BAD_RUN_OPTIONS');
  const root = runsRoot(evidenceRoot || path.dirname(path.resolve(workbook)), topic);
  const workbookName = path.basename(String(workbook));
  const defaults = { tester: tester || process.env.POINT_TEST_TESTER || undefined, date: date || localDate() };

  if (runId) {
    if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(runId)) throw new HarnessError(`Invalid run id: ${runId}`, 'BAD_RUN_ID');
    const directory = path.join(root, runId);
    const resultsPath = path.join(directory, 'results.json');
    if (!fs.existsSync(resultsPath)) throw new HarnessError(`Cannot resume ${runId}: ${resultsPath} does not exist`, 'RUN_NOT_FOUND');
    const saved = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
    if (saved.schemaVersion !== SCHEMA_VERSION) throw new HarnessError(`Cannot resume ${runId}: unsupported schema ${saved.schemaVersion}`, 'RUN_MISMATCH');
    for (const [key, expected] of [['topic', topic], ['workbook', workbookName], ['environment', environment]]) {
      if (saved[key] !== expected) {
        throw new HarnessError(`Cannot resume ${runId}: ${key} is ${JSON.stringify(saved[key])}, not ${JSON.stringify(expected)}`, 'RUN_MISMATCH');
      }
    }
    const { cases = [], ...manifest } = saved;
    delete manifest.completedAt;
    manifest.resumedAt = [...(manifest.resumedAt || []), new Date().toISOString()];
    const run = buildRun(directory, manifest, cases, defaults);
    fs.mkdirSync(path.join(directory, 'screenshots'), { recursive: true });
    fs.mkdirSync(path.join(directory, 'diagnostics'), { recursive: true });
    checkpoint(run);
    return run;
  }

  const id = `${utcStamp()}-${slugify(topic)}-${crypto.randomBytes(3).toString('hex')}`;
  const directory = path.join(root, id);
  if (fs.existsSync(directory)) throw new HarnessError(`Run directory already exists: ${directory}`, 'RUN_EXISTS');
  fs.mkdirSync(path.join(directory, 'screenshots'), { recursive: true });
  fs.mkdirSync(path.join(directory, 'diagnostics'), { recursive: true });
  const manifest = {
    schemaVersion: SCHEMA_VERSION,
    runId: id,
    topic,
    workbook: workbookName,
    environment,
    startedAt: new Date().toISOString(),
    host: os.hostname(),
  };
  const run = buildRun(directory, manifest, [], defaults);
  checkpoint(run);
  return run;
}

function buildRun(directory, manifest, cases, defaults) {
  const run = {
    runId: manifest.runId,
    directory,
    resultsPath: path.join(directory, 'results.json'),
    summaryPath: path.join(directory, 'summary.md'),
    manifest,
    results: cases,
    defaults,
    aborted: null,
  };
  // Secrets live only in memory and are never serialized.
  Object.defineProperty(run, 'secretValues', { value: [], enumerable: false, writable: false });
  return run;
}

function checkpoint(run) {
  const payload = { ...run.manifest, cases: run.results };
  atomicWrite(run.resultsPath, `${JSON.stringify(payload, null, 2)}\n`);
}

function hasCaseResult(run, caseNo) {
  return run.results.some((entry) => entry.caseNo === caseNo);
}

// True when the case was selected (--cases) and has no result yet in this run.
function shouldRunCase(run, caseNo, { cases = null } = {}) {
  if (cases && !cases.has(caseNo)) return false;
  return !hasCaseResult(run, caseNo);
}

function addCaseResult(run, input = {}) {
  if (!Number.isInteger(input.caseNo)) throw new HarnessError('caseNo must be an integer', 'BAD_RESULT');
  if (!STATUSES.includes(input.status)) throw new HarnessError(`Invalid case status: ${input.status}`, 'BAD_RESULT');
  if (input.scope !== undefined && !SCOPES.includes(input.scope)) throw new HarnessError(`Invalid scope: ${input.scope}`, 'BAD_RESULT');
  if (hasCaseResult(run, input.caseNo)) throw new HarnessError(`Duplicate case number: ${input.caseNo}`, 'DUPLICATE_CASE');
  const evidenceList = input.evidence === undefined || input.evidence === null ? [] : [].concat(input.evidence);
  const clean = (value) => (value === undefined || value === null || value === '' ? undefined : sanitizeText(run, value));
  const candidate = {
    caseNo: input.caseNo,
    row: Number.isInteger(input.row) ? input.row : undefined,
    status: input.status,
    scope: input.scope,
    mutation: input.mutation === undefined ? undefined : normalizeMutation(input.mutation),
    expected: clean(input.expected),
    observed: sanitizeText(run, input.observed || input.note || ''),
    blocker: clean(input.blocker),
    cleanup: clean(input.cleanup),
    evidence: evidenceList.map(toPortable),
    tester: clean(input.tester || run.defaults.tester),
    date: clean(input.date || run.defaults.date),
  };
  // Only allowlisted fields survive; anything else the caller passed (for
  // example a credentials object) is dropped.
  const result = {};
  for (const key of RESULT_FIELDS) if (candidate[key] !== undefined) result[key] = candidate[key];
  run.results.push(result);
  checkpoint(run);
  return result;
}

// Marks a run as unable to continue mutating cases, e.g. after an unverified cleanup.
function abortMutations(run, reason) {
  run.aborted = sanitizeText(run, reason);
  run.manifest.mutationsAborted = run.aborted;
  checkpoint(run);
}

function countStatuses(results) {
  return Object.fromEntries(STATUSES.map((status) => [status, results.filter((entry) => entry.status === status).length]));
}

function markdownCell(value) {
  return String(value ?? '').replace(/\r?\n/g, '<br>').replace(/\|/g, '\\|');
}

async function finalizeRun(run) {
  run.manifest.completedAt = new Date().toISOString();
  run.results.sort((a, b) => a.caseNo - b.caseNo);
  checkpoint(run);
  const counts = countStatuses(run.results);
  const lines = [
    `# ${run.manifest.topic} browser test run`,
    '',
    `- Run: ${run.manifest.runId}`,
    `- Workbook: ${run.manifest.workbook}`,
    `- Environment: ${run.manifest.environment}`,
    `- Started: ${run.manifest.startedAt}`,
    `- Completed: ${run.manifest.completedAt}`,
  ];
  if (run.manifest.resumedAt) lines.push(`- Resumed: ${run.manifest.resumedAt.join(', ')}`);
  if (run.manifest.mutationsAborted) lines.push(`- Mutating cases stopped: ${sanitizeText(run, run.manifest.mutationsAborted)}`);
  lines.push(
    '',
    STATUSES.map((status) => `${status}: ${counts[status]}`).join('  '),
    '',
    '| Case | Row | Status | Scope | Mutation | Observed | Blocker / cleanup | Evidence |',
    '| --- | --- | --- | --- | --- | --- | --- | --- |',
  );
  for (const entry of run.results) {
    const notes = [entry.blocker && `Blocker: ${entry.blocker}`, entry.cleanup && `Cleanup: ${entry.cleanup}`].filter(Boolean).join(' ');
    lines.push(`| ${[entry.caseNo, entry.row ?? '', entry.status, entry.scope ?? '', entry.mutation ?? '', entry.observed, notes, entry.evidence.join(', ')]
      .map((value) => markdownCell(sanitizeText(run, value))).join(' | ')} |`);
  }
  lines.push('');
  atomicWrite(run.summaryPath, lines.join('\n'));
  return { resultsPath: run.resultsPath, summaryPath: run.summaryPath, counts };
}

// ---------------------------------------------------------------------------
// Sanitizing

function registerSecret(run, ...values) {
  if (!run) return;
  for (const value of values) if (typeof value === 'string' && value.length > 0 && !run.secretValues.includes(value)) run.secretValues.push(value);
  run.secretValues.sort((a, b) => b.length - a.length);
}

function sanitizeText(run, text) {
  let value = String(text ?? '');
  for (const secret of (run && run.secretValues) || []) value = value.split(secret).join(REDACTED);
  return value
    .replace(/\b(bearer|basic)\s+[A-Za-z0-9._~+/=-]{8,}/gi, `$1 ${REDACTED}`)
    .replace(/\b(password|passwd|pwd|token|secret|api[_-]?key)(["']?\s*[:=]\s*["']?)[^\s"'&,;}]+/gi, `$1$2${REDACTED}`);
}

function sanitizeUrl(run, rawUrl) {
  const text = String(rawUrl ?? '');
  let result = text;
  try {
    const url = new URL(text);
    if (url.username || url.password) {
      url.username = '';
      url.password = '';
    }
    for (const key of [...url.searchParams.keys()]) {
      if (SENSITIVE_QUERY_KEYS.test(key)) url.searchParams.set(key, REDACTED);
    }
    if (url.hash && /(token|code|password|secret)=/i.test(url.hash)) url.hash = REDACTED;
    result = url.toString().replace(/%5BREDACTED%5D/g, REDACTED);
  } catch {
    result = text.replace(/([?&#][^=&#]*(?:token|password|secret|code|session|auth|key)[^=&#]*=)[^&#]*/gi, `$1${REDACTED}`);
  }
  return sanitizeText(run, result);
}

// ---------------------------------------------------------------------------
// Diagnostics

function appendJsonLine(run, name, record) {
  const file = path.join(run.directory, 'diagnostics', name);
  fs.appendFileSync(file, `${JSON.stringify({ ...record, at: new Date().toISOString() })}\n`, 'utf8');
  return relativeToRun(run, file);
}

function recordConsole(run, { type = 'log', text = '', caseNo } = {}) {
  return appendJsonLine(run, 'console.jsonl', { caseNo, type: String(type), text: sanitizeText(run, text) });
}

function recordPageError(run, { message = '', caseNo } = {}) {
  return appendJsonLine(run, 'page-errors.jsonl', { caseNo, message: sanitizeText(run, message) });
}

// Records allowlisted request metadata only: never bodies, headers, or cookies.
function recordNetwork(run, { method = 'GET', url = '', status = null, resourceType = null, durationMs = null, caseNo } = {}) {
  return appendJsonLine(run, 'network.jsonl', {
    caseNo,
    method: String(method).toUpperCase(),
    url: sanitizeUrl(run, url),
    status: Number.isInteger(status) ? status : null,
    resourceType: resourceType ? String(resourceType) : null,
    durationMs: typeof durationMs === 'number' ? Math.round(durationMs) : null,
  });
}

// Wires console, page-error and response listeners onto a Playwright page.
// `getCaseNo` lets the runner tag records with the case currently executing.
function attachPageListeners(run, page, { getCaseNo = () => undefined, resourceTypes = ['document', 'xhr', 'fetch'] } = {}) {
  page.on('console', (message) => recordConsole(run, { type: message.type(), text: message.text(), caseNo: getCaseNo() }));
  page.on('pageerror', (error) => recordPageError(run, { message: error && error.message, caseNo: getCaseNo() }));
  page.on('response', (response) => {
    const request = response.request();
    if (resourceTypes && !resourceTypes.includes(request.resourceType())) return;
    let durationMs = null;
    try {
      const timing = request.timing();
      if (timing && timing.responseEnd >= 0) durationMs = timing.responseEnd;
    } catch {
      durationMs = null;
    }
    recordNetwork(run, { method: request.method(), url: response.url(), status: response.status(), resourceType: request.resourceType(), durationMs, caseNo: getCaseNo() });
  });
}

// ---------------------------------------------------------------------------
// Screenshots

async function screenshot(run, page, filename, { stampUrl = false, fullPage = true } = {}) {
  if (typeof filename !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9._-]*\.png$/.test(filename)) {
    throw new HarnessError(`Screenshot names must be plain .png file names such as TC01-state.png: ${filename}`, 'BAD_EVIDENCE_PATH');
  }
  const relative = toPortable(`screenshots/${filename}`);
  const target = path.join(run.directory, 'screenshots', filename);
  if (fs.existsSync(target)) throw new HarnessError(`Screenshot already exists in this run: ${relative}`, 'EVIDENCE_EXISTS');
  if (stampUrl) {
    await page.evaluate(({ id, text }) => {
      document.getElementById(id)?.remove();
      const stamp = document.createElement('div');
      stamp.id = id;
      stamp.textContent = text;
      Object.assign(stamp.style, {
        position: 'fixed', top: '0', left: '0', right: '0', zIndex: '2147483647', pointerEvents: 'none',
        background: 'rgba(17,17,17,0.9)', color: '#fff', font: '12px monospace', padding: '4px 8px',
      });
      document.body.appendChild(stamp);
    }, { id: URL_STAMP_ID, text: sanitizeUrl(run, page.url()) });
  }
  try {
    await page.screenshot({ path: target, fullPage });
  } finally {
    if (stampUrl) await page.evaluate((id) => document.getElementById(id)?.remove(), URL_STAMP_ID).catch(() => {});
  }
  return relative;
}

// ---------------------------------------------------------------------------
// Credentials

function profilePrefix(profile) {
  return `${ENV_PREFIX}${String(profile).toUpperCase().replace(/[^A-Z0-9]+/g, '_')}`;
}

function promptHidden(label, { input = process.stdin, output = process.stdout } = {}) {
  if (!input.isTTY || !output.isTTY) {
    return Promise.reject(new HarnessError(`No interactive terminal for the ${label} prompt`, 'CREDENTIALS_UNAVAILABLE'));
  }
  return new Promise((resolve, reject) => {
    let value = '';
    output.write(`${label}: `);
    readline.emitKeypressEvents(input);
    input.setRawMode(true);
    input.resume();
    const finish = (error) => {
      input.setRawMode(false);
      input.pause();
      input.off('keypress', onKey);
      output.write('\n');
      if (error) reject(error);
      else resolve(value);
    };
    const onKey = (text, key = {}) => {
      if (key.ctrl && key.name === 'c') finish(new HarnessError('Credential prompt cancelled', 'CREDENTIALS_UNAVAILABLE'));
      else if (key.name === 'return' || key.name === 'enter') finish(null);
      else if (key.name === 'backspace') value = value.slice(0, -1);
      else if (!key.ctrl && !key.meta && text) value += text;
    };
    input.on('keypress', onKey);
  });
}

// Resolves credentials for a profile from POINT_TEST_<PROFILE>_USER (or _USERNAME)
// and POINT_TEST_<PROFILE>_PASSWORD, prompting with hidden input for anything
// missing when a terminal is attached. Throws code CREDENTIALS_UNAVAILABLE
// otherwise; record affected cases as BLOCKED.
async function getCredentials(profile = 'default', { env = process.env, run = null, prompt = promptHidden } = {}) {
  const prefix = profilePrefix(profile);
  const username = env[`${prefix}_USER`] || env[`${prefix}_USERNAME`] || await prompt(`${profile} username`);
  const password = env[`${prefix}_PASSWORD`] || await prompt(`${profile} password`);
  if (!username || !password) throw new HarnessError(`Credentials for profile "${profile}" are empty`, 'CREDENTIALS_UNAVAILABLE');
  registerSecret(run, username, password);
  return Object.freeze({ username, password });
}

module.exports = {
  SCHEMA_VERSION,
  STATUSES,
  SCOPES,
  HarnessError,
  abortMutations,
  addCaseResult,
  assertMutationApproved,
  attachPageListeners,
  createRun,
  finalizeRun,
  getCredentials,
  hasCaseResult,
  normalizeMutation,
  parseCaseList,
  parseRunArgs,
  profilePrefix,
  promptHidden,
  recordConsole,
  recordNetwork,
  recordPageError,
  registerSecret,
  sanitizeText,
  sanitizeUrl,
  screenshot,
  shouldRunCase,
  toPortable,
};

import test, { afterEach } from 'node:test';
import assert from 'node:assert/strict';

const originalFetch = globalThis.fetch;
const originalEnv = { publicBase: process.env.NEXT_PUBLIC_API_BASE_URL, mode: process.env.NODE_ENV };
let sequence = 0;

async function service(base = 'https://api.example.test', mode = 'production') {
  if (base === null) delete process.env.NEXT_PUBLIC_API_BASE_URL;
  else process.env.NEXT_PUBLIC_API_BASE_URL = base;
  process.env.NODE_ENV = mode;
  return import(`../src/service/uploadService.ts?case=${sequence++}`);
}

function reply(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}

const summary = { total_units: 4, spelling_findings_count: 1, italic_findings_count: 1,
  review_count: 1, not_assessed_units: 1, annotation_count: 2 };
const result = { total_pages: 1, total_words: 4, total_typos: 1, total_foreign_words: 1,
  policy_version: 'usk-2024-v3', resource_version: 'evaluation-v3.0', evaluation: summary };
const findings = { total: 1, page: 2, page_size: 20, schema_version: '2.0',
  policy_version: 'usk-2024-v3', resource_version: 'evaluation-v3.0',
  items: [{ unit_id: 'p1-u1-2', type: 'review', page: 1, target: '<img src=x>', review_reasons: ['Belum jelas'] }] };

afterEach(() => {
  globalThis.fetch = originalFetch;
  for (const [name, value] of [['NEXT_PUBLIC_API_BASE_URL', originalEnv.publicBase], ['NODE_ENV', originalEnv.mode]]) {
    if (value === undefined) delete process.env[name]; else process.env[name] = value;
  }
});

test('base API is explicit in production and local-only fallback exists in development', async () => {
  const configured = await service(' https://api.example.test/ ');
  assert.equal(configured.API_BASE_URL, 'https://api.example.test');
  assert.equal(configured.apiUrl('/preview/job#page=2'), 'https://api.example.test/preview/job#page=2');
  const missing = await service(null);
  assert.equal(missing.isApiConfigured, false);
  assert.throws(() => missing.apiUrl('/upload'), e => e.code === 'configuration');
  const local = await service(null, 'development');
  assert.equal(local.API_BASE_URL, 'http://127.0.0.1:8002');
});

test('bad config and foreign/protocol-relative request paths are rejected', async () => {
  for (const base of ['file:///tmp/api', 'https://user:password@api.test', 'https://api.test/prefix',
    'https://api.test/?token=example', 'https://api.test/#hash', 'not-a-url']) {
    const api = await service(base);
    assert.equal(api.isApiConfigured, false);
  }
  const api = await service();
  for (const path of ['//evil.test/upload', 'https://evil.test/upload', 'upload', '/\\evil.test/upload', '/upload\n']) {
    assert.throws(() => api.apiUrl(path), e => e.code === 'validation');
  }
});

test('upload is direct FormData with field file and lets browser set multipart boundary', async () => {
  const api = await service();
  const file = new File(['%PDF-test'], 'laporan.PDF', { type: 'application/pdf' });
  globalThis.fetch = async (url, options) => {
    assert.equal(url, 'https://api.example.test/upload');
    assert.equal(options.method, 'POST');
    assert.equal(options.credentials, 'include');
    assert.equal(options.headers, undefined);
    assert.equal(options.body.get('file').name, 'laporan.PDF');
    return reply({ status: 'success', job_id: 'job', message: 'queued', original_filename: file.name });
  };
  assert.equal((await api.uploadFile(file)).job_id, 'job');
});

test('non-PDF, empty and oversized files fail before network', async () => {
  const api = await service();
  let calls = 0;
  globalThis.fetch = async () => { calls++; throw new Error('should not run'); };
  const oversized = new File(['pdf'], 'big.pdf');
  Object.defineProperty(oversized, 'size', { value: api.MAX_UPLOAD_BYTES + 1 });
  for (const file of [new File(['text'], 'a.txt'), new File([], 'a.pdf'), oversized]) {
    await assert.rejects(api.uploadFile(file), e => e.code === 'validation');
  }
  assert.equal(calls, 0);
});

test('queued and completed response retain separate counts, state and version', async () => {
  const api = await service();
  globalThis.fetch = async () => reply({ status: 'queued', progress: 0 });
  assert.equal((await api.fetchProgress('job')).status, 'queued');
  globalThis.fetch = async () => reply({ status: 'completed', progress: 100, result });
  const data = await api.fetchProgress('job');
  assert.deepEqual(data.result.evaluation, summary);
  assert.equal(data.result.policy_version, 'usk-2024-v3');
  globalThis.fetch = async () => reply({ status: 'completed', progress: 100 });
  await assert.rejects(api.fetchProgress('job'), e => e.code === 'response');
});

test('HTTP status and backend detail survive in ApiError', async () => {
  const api = await service();
  globalThis.fetch = async () => reply({ detail: 'Job tidak ditemukan' }, 404);
  await assert.rejects(api.fetchProgress('job'), e => e instanceof api.ApiError && e.status === 404 && e.message === 'Job tidak ditemukan');
  globalThis.fetch = async () => new Response('<html>Proxy failed</html>', { status: 502 });
  await assert.rejects(api.fetchProgress('job'), e => e.status === 502 && !e.message.includes('<html>'));
});

test('invalid successful JSON and backend error result do not look completed', async () => {
  const api = await service();
  globalThis.fetch = async () => new Response('not json');
  await assert.rejects(api.fetchProgress('job'), e => e.code === 'response');
  globalThis.fetch = async () => reply({ status: 'error', job_id: 'job', original_filename: 'a.pdf', message: 'Gagal' });
  await assert.rejects(api.uploadFile(new File(['pdf'], 'a.pdf')), e => e.code === 'api_error');
});

test('findings filter/search/page are encoded together before server pagination', async () => {
  const api = await service();
  globalThis.fetch = async url => {
    const parsed = new URL(url);
    assert.equal(parsed.pathname, '/findings/job%2Fid');
    assert.equal(parsed.searchParams.get('type'), 'review');
    assert.equal(parsed.searchParams.get('q'), 'unit & label');
    assert.equal(parsed.searchParams.get('page'), '2');
    assert.equal(parsed.searchParams.get('page_size'), '20');
    return reply(findings);
  };
  const data = await api.fetchFindings('job/id', { type: 'review', q: 'unit & label', page: 2 });
  assert.equal(data.items[0].target, '<img src=x>'); // Data stays text, not generated HTML.
});

test('invalid filters, pagination, query length and dot job do not request server', async () => {
  const api = await service();
  globalThis.fetch = async () => { throw new Error('should not request'); };
  for (const options of [{ page: 0 }, { pageSize: 201 }, { page: 1.5 }, { q: 'x'.repeat(161) }, { type: 'typo' }]) {
    await assert.rejects(api.fetchFindings('job', options), e => e.code === 'validation');
  }
  await assert.rejects(api.fetchProgress('..'), e => e.code === 'validation');
});

test('caller cancellation is AbortError, not a retryable network failure', async () => {
  const api = await service();
  const caller = new AbortController();
  globalThis.fetch = async (_url, { signal }) => new Promise((_resolve, reject) => {
    signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true });
  });
  const pending = api.fetchProgress('job', caller.signal);
  caller.abort();
  await assert.rejects(pending, e => e.name === 'AbortError');
});

test('timeout and network failures are distinguishable from cancellation', async t => {
  const api = await service();
  t.mock.timers.enable({ apis: ['setTimeout'] });
  globalThis.fetch = async (_url, { signal }) => new Promise((_resolve, reject) => {
    signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true });
  });
  const pending = api.fetchProgress('job');
  t.mock.timers.tick(20_001);
  await assert.rejects(pending, e => e.code === 'timeout' && e.status === 408);
  t.mock.timers.reset();
  globalThis.fetch = async () => { throw new TypeError('connection refused'); };
  await assert.rejects(api.fetchProgress('job'), e => e.code === 'network' && e.status === 0);
});

test('example is fetched from backend and returned as a PDF File', async () => {
  const api = await service();
  globalThis.fetch = async url => {
    assert.equal(url, 'https://api.example.test/ui/example.pdf');
    return new Response('%PDF-example', { headers: { 'Content-Type': 'application/pdf' } });
  };
  const file = await api.fetchExample();
  assert.equal(file.name, 'contoh-laporan.pdf');
  assert.equal(file.type, 'application/pdf');
});

test('public availability stays closed on private and legacy server responses', async () => {
  const api = await service();
  assert.equal(api.canUpload(null), false);
  for (const flag of [undefined, false, 'true', 1]) {
    globalThis.fetch = async (url, options) => {
      assert.equal(url, 'https://api.example.test/api/access');
      assert.equal(options.credentials, 'include');
      assert.equal(options.cache, 'no-store');
      return reply({ mode: 'free', price_idr: 1000, payment_ready: false, public_upload_enabled: flag });
    };
    assert.equal(api.canUpload(await api.fetchAccess()), false);
  }
  globalThis.fetch = async () => reply({ mode: 'paid', price_idr: 1000, payment_ready: false, public_upload_enabled: true });
  assert.equal(api.canUpload(await api.fetchAccess()), false);
  globalThis.fetch = async () => reply({ mode: 'free', price_idr: 1000, payment_ready: false, public_upload_enabled: true });
  assert.equal(api.canUpload(await api.fetchAccess()), true);
  globalThis.fetch = async () => reply({ mode: 'free', price_idr: '1000', payment_ready: false });
  await assert.rejects(api.fetchAccess(), e => e.code === 'response');
});


test('500 MiB validation permits larger PDFs and rejects one byte above the limit', async () => {
  const api = await service();
  for (const bytes of [60 * 1024 * 1024, 500 * 1024 * 1024]) {
    const file = new File(['pdf'], 'large.pdf');
    Object.defineProperty(file, 'size', { value: bytes });
    assert.doesNotThrow(() => api.validatePdf(file));
  }
  const file = new File(['pdf'], 'too-large.pdf');
  Object.defineProperty(file, 'size', { value: 500 * 1024 * 1024 + 1 });
  assert.throws(() => api.validatePdf(file), e => e.code === 'validation' && e.message.includes('500 MB'));
});

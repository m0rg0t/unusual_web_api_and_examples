const {test} = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const vm = require('node:vm');
const flush = () => new Promise(resolve => setImmediate(resolve));
function harness(navigator = {}) {
  const document = new EventTarget(); document.hidden = false;
  const window = new EventTarget();
  const output = {textContent: ''}; document.getElementById = () => output;
  const context = vm.createContext({navigator, document, window, console: {log() {}}, debugConsole() {}});
  for (const file of ['wake', 'sharing', 'console']) vm.runInContext(readFileSync(`resources/${file}.js`, 'utf8'), context);
  return {document, window, output, run: code => vm.runInContext(code, context)};
}
function sentinel() {
  const lock = new EventTarget(); lock.released = false; lock.releases = 0;
  lock.release = async () => { lock.releases++; lock.released = true; lock.dispatchEvent(new Event('release')); };
  return lock;
}
test('unsupported capabilities are safe and share checks actual payload', async () => {
  const h = harness(); const dispose = h.run('initWakeLock()');
  assert.equal(typeof dispose, 'function'); dispose();
  assert.equal(await h.run('shareTicket("https://example.invalid/ticket")'), 'unavailable');
  let calls = 0;
  const h2 = harness({share: async () => calls++, canShare: data => data.url === 'allowed'});
  assert.equal(await h2.run('shareTicket("blocked")'), 'unavailable'); assert.equal(calls, 0);
  assert.equal(await h2.run('shareTicket("allowed")'), 'shared'); assert.equal(calls, 1);
});
test('share without canShare, cancellation and rejection are distinct', async () => {
  assert.equal(await harness({share: async () => {}}).run('shareTicket("url")'), 'shared');
  assert.equal(await harness({share: async () => { throw {name: 'AbortError'}; }}).run('shareTicket("url")'), 'cancelled');
  assert.equal(await harness({share: async () => { throw Error('denied'); }}).run('shareTicket("url")'), 'failed');
  assert.equal(await harness({share() {}, canShare() { throw Error('invalid'); }}).run('shareTicket("url")'), 'failed');
});
test('wake lock has one owner, releases and reacquires across visibility and bfcache', async () => {
  const locks = []; const h = harness({wakeLock: {request: async () => {const lock = sentinel(); locks.push(lock); return lock;}}});
  const dispose = h.run('initWakeLock()'); assert.equal(h.run('initWakeLock()'), dispose); await flush(); assert.equal(locks.length, 1);
  h.document.hidden = true; h.document.dispatchEvent(new Event('visibilitychange')); await flush(); assert.equal(locks[0].releases, 1);
  h.document.hidden = false; h.document.dispatchEvent(new Event('visibilitychange')); await flush(); assert.equal(locks.length, 2);
  h.window.dispatchEvent(new Event('pagehide')); await flush(); assert.equal(locks[1].releases, 1);
  h.window.dispatchEvent(new Event('pageshow')); await flush(); assert.equal(locks.length, 3);
  dispose(); dispose(); await flush(); assert.equal(locks[2].releases, 1);
  h.document.dispatchEvent(new Event('visibilitychange')); await flush(); assert.equal(locks.length, 3);
});
test('late request completion after disposal or pagehide releases its lock', async () => {
  for (const action of ['dispose', 'pagehide']) {
    let resolve; const lock = sentinel(); const h = harness({wakeLock: {request: () => new Promise(r => resolve = r)}});
    const dispose = h.run('initWakeLock()');
    if (action === 'dispose') dispose(); else h.window.dispatchEvent(new Event('pagehide'));
    resolve(lock); await flush(); assert.equal(lock.releases, 1); dispose();
  }
});
test('denied wake request can retry after visibility change', async () => {
  let calls = 0; const h = harness({wakeLock: {request: async () => { if (++calls === 1) throw Error('denied'); return sentinel(); }}});
  const dispose = h.run('initWakeLock()'); await flush(); h.document.dispatchEvent(new Event('visibilitychange')); await flush(); assert.equal(calls, 2); dispose();
});
test('debug output is text, including markup and missing console', () => {
  const h = harness(); h.run('debugConsole("<img src=x onerror=alert(1)>")'); assert.match(h.output.textContent, /<img/);
  h.document.getElementById = () => null; h.run('debugConsole("no output")');
});

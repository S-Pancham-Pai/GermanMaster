/* Simulates the REAL failure mode from the user's phone:
   - Tatoeba & Pollinations direct calls die with CORS errors
   - the CORS relays (allorigins) rescue them
   - and a second query where EVERYTHING fails — the UI must stay honest and fast. */
const fs = require('fs');
const { JSDOM, VirtualConsole } = require('jsdom');
const errors = [];
const vc = new VirtualConsole();
vc.on('jsdomError', e => { if (!/Could not load|css|img|HTMLMediaElement|Not implemented/.test(e.message)) errors.push(e.message); });
vc.on('error', m => errors.push(m));
const base = require('path').join(__dirname, '..', 'web') + '/';
const dom = new JSDOM(fs.readFileSync(base + 'index.html', 'utf8'), { url: 'http://localhost/', runScripts: 'outside-only', pretendToBeVisual: true, virtualConsole: vc });
const w = dom.window;
Object.defineProperty(w.navigator, 'onLine', { get: () => true, configurable: true });

const seen = [];
const mk = (body, isText = false) => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(body), text: () => Promise.resolve(isText ? body : JSON.stringify(body)) });
const route = (u, opts) => {
  // unwrap relayed URLs so the inner request behaves like the real host
  let inner = u;
  const m = /[?&]url=([^&]+)/.exec(u);
  if (u.includes('allorigins.win') || u.includes('corsproxy.io')) inner = decodeURIComponent(m ? m[1] : '');
  else inner = u;
  seen.push(u.includes('allorigins.win') ? 'allorigins' : u.includes('corsproxy.io') ? 'corsproxy' : inner.split('/')[2]);

  // sentence sources: DIRECT = CORS-blocked, relays work — except for "submarine" (everything dead)
  const dead = inner.toLowerCase().includes('u-boot') || inner.toLowerCase().includes('submarine');
  if (inner.includes('tatoeba.org') || inner.includes('text.pollinations.ai') && !dead) {
    const direct = !(u.includes('allorigins.win') || u.includes('corsproxy.io'));
    if (inner.includes('tatoeba.org')) {
      if (dead) return Promise.reject(new Error('dead'));
      if (direct) return Promise.reject(new Error('CORS blocked'));
      return mk({ results: [{ text: 'Die Rakete startet um sechs Uhr.', translations: [[{ lang: 'eng', text: 'The rocket launches at six.' }]], lang: 'deu' }] });
    }
    if (inner.includes('text.pollinations.ai') || u.includes('text.pollinations.ai')) {
      const pollinDirect = !m && !inner.includes('allorigins');
      if (dead) return Promise.reject(new Error('dead'));
      if (opts && opts.method === 'POST') return Promise.reject(new Error('preflight blocked')); // phones fail POST outright
      if (!u.includes('allorigins.win') && !u.includes('corsproxy.io')) return Promise.reject(new Error('CORS blocked'));
      return mk('Die Rakete fliegt hoch. => The rocket flies high.\nWir sehen die Rakete. => We see the rocket.', true);
    }
  }
  if (inner.includes('translate.googleapis.com')) {
    const q = decodeURIComponent((/[?&]q=([^&]+)/.exec(inner) || [])[1] || '');
    if (q === 'the rocket') return mk([[["die Rakete", q]]], false);
    if (q === 'the submarine') return mk([[["das U-Boot", q]]], false);
    return mk([[["übersetzt:" + q, q]]], false);
  }
  if (inner.includes('api.mymemory.translated.net')) {
    return new Promise((_, rej) => setTimeout(() => rej(new Error('mm slow timeout')), 12000)); // very slow loser
  }
  return Promise.reject(new Error('unexpected fetch: ' + u));
};
w.fetch = route;

w.eval(['util', 'banks', 'store', 'voice', 'dictbulk', 'dictdata', 'translate', 'data', 'stories', 'adaptive', 'engines', 'stage', 'views', 'app'].map(n => fs.readFileSync(base + 'js/' + n + '.js', 'utf8')).join('\n;\n')
  + '\n;window.App = App; window.Store = Store;');
w.document.dispatchEvent(new w.Event('DOMContentLoaded'));
const $ = s => w.document.querySelector(s);
const click = el => el && el.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
const wait = ms => new Promise(r => setTimeout(r, ms));
const log = [];
const step = (n, ok) => log.push((ok ? 'PASS' : 'FAIL') + ' ' + n);

(async () => {
  await wait(250);
  log.push('--- CORS-blocked direct calls, relays save the day ---');
  click($('.dock-btn[data-tab="explore"]')); await wait(60);
  const en = $('#enBox');
  en.value = 'the rocket';
  en.dispatchEvent(new w.Event('input', { bubbles: true }));
  const t0 = Date.now();
  click($('[data-act="goEn"]'));

  // translation must land FAST even though sentence sources are relaying
  await wait(1600);
  step('translation shown quickly (~<1.6s) despite CORS mess', /Rakete/.test($('#deBox').value));
  step('status names the real source (Google or built-in dict)', /Google Translate|Built-in dictionary|Live translation/.test($('#expStatus').textContent));

  await wait(4500);
  const r = w.App.exp.result;
  step('relays rescued Tatoeba', !!r && r.examples.some(e => e.src === 'tatoeba'));
  step('relays rescued the AI writer', !!r && r.examples.some(e => e.src === 'ai'));
  step('status upgraded to examples-ready', /examples ready/.test($('#expStatus').textContent));
  step('a relay was actually used (proof CORS path fires)', seen.includes('allorigins') || seen.includes('corsproxy'));

  log.push('--- everything dead: honest + fast, ✨ still responds ---');
  en.value = 'the submarine';
  en.dispatchEvent(new w.Event('input', { bubbles: true }));
  click($('[data-act="goEn"]'));
  await wait(1600);
  step('translation still immediate', /U-Boot/.test($('#deBox').value));
  step('loading hint or instant honest outcome', /getting example sentences|💬|sources unreachable/.test($('#expStatus').textContent));
  await wait(3500);
  // v3.5: total network failure no longer yields an empty sheet — the built-in
  // writer guarantees practice lines, honestly labeled; never stuck on a spinner
  step('built-in practice lines announced (not stuck)', /built-in practice lines ready|unreachable/.test($('#expStatus').textContent));
  step('fallback lines honestly labeled, never faked sources', (w.App.exp.result.examples || []).length > 0 && w.App.exp.result.examples.every(x => x.src === 'mini'));

  click($('[data-act="nextEx"]')); await wait(40); // must not crash with 0 examples
  const before = $('#expStatus').textContent;
  click($('#quoteBtn')); await wait(60);
  step('sheet opens even with zero examples', $('#sheet').classList.contains('show'));
  step('sheet offers ✨ one-tap AI generation', !!$('#sheet [data-act="freshEx"]') || /AI writes new ones/.test($('#sheet').innerHTML));
  // capture every intermediate status (instant-failure stubs overwrite within one tick)
  let trail = '';
  const mo = new w.MutationObserver(() => { trail += '|' + $('#expStatus').textContent; });
  mo.observe($('#expStatus'), { childList: true, characterData: true, subtree: true });
  click($('[data-act="freshEx"]'));
  await wait(3000);
  mo.disconnect();
  step('✨ click flashed the "AI is writing" state', /AI is writing fresh examples/.test(trail));
  step('✨ failure ends with a visible, honest status', /unreachable from this network/.test($('#expStatus').textContent));
  step('status actually changed after ✨ click', $('#expStatus').textContent !== before);

  log.push('--- jsdom errors ---');
  step('zero js errors', errors.length === 0);
  if (errors.length) log.push('ERRORS: ' + [...new Set(errors)].slice(0, 5).join(' | '));
  console.log(log.join('\n'));
  const fails = log.filter(x => x.startsWith('FAIL')).length;
  console.log(fails === 0 ? '\nALL PASS' : `\n${fails} FAILURES`);
  process.exit(fails ? 1 : 0);
})().catch(e => { console.log(log.join('\n')); console.error('CRASH:', e); process.exit(1); });

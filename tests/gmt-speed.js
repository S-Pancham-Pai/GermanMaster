/* Latency contract: translation shows fast; sentences stream in afterwards.
   gtx = 800ms, everything else = 4 seconds. The old design made you wait 15s+. */
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

const delay = (ms, body, isText = false) => new Promise(res => setTimeout(() =>
  res({ ok: true, status: 200, json: () => Promise.resolve(body), text: () => Promise.resolve(isText ? body : JSON.stringify(body)) }), ms));
w.fetch = (url, opts) => {
  const u = String(url);
  if (u.includes('translate.googleapis.com')) {
    const q = decodeURIComponent((/[?&]q=([^&]+)/.exec(u) || [])[1] || '');
    return delay(800, [[[q === 'the telescope' ? 'das Teleskop' : 'übersetzt:' + q, q]]]);
  }
  if (u.includes('api.mymemory.translated.net')) return delay(4000, { responseData: { translatedText: 'mm-says' }, matches: [] });
  if (u.includes('tatoeba.org') || u.includes('allorigins.win') || u.includes('corsproxy.io')) {
    if (u.includes('pollinations'))
      return delay(4000, 'Das Teleskop steht im Garten. => The telescope is in the garden.', true);
    return delay(4000, { results: [{ text: 'Ich kaufe ein Teleskop.', translations: [[{ lang: 'eng', text: 'I am buying a telescope.' }]], lang: 'deu' }] });
  }
  if (u.includes('text.pollinations.ai'))
    return delay(4000, 'Das Teleskop steht im Garten. => The telescope is in the garden.\nWir nutzen das Teleskop oft. => We use the telescope often.', true);
  return Promise.reject(new Error('unexpected fetch: ' + u));
};

w.eval(['util', 'banks', 'store', 'voice', 'dictbulk', 'dictdata', 'translate', 'data', 'stories', 'adaptive', 'engines', 'stage', 'views', 'app'].map(n => fs.readFileSync(base + 'js/' + n + '.js', 'utf8')).join('\n;\n')
  + '\n;window.App = App;');
w.document.dispatchEvent(new w.Event('DOMContentLoaded'));
const $ = s => w.document.querySelector(s);
const click = el => el && el.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
const wait = ms => new Promise(r => setTimeout(r, ms));
const log = [];
const step = (n, ok) => log.push((ok ? 'PASS' : 'FAIL') + ' ' + n);

(async () => {
  await wait(250);
  click($('.dock-btn[data-tab="explore"]')); await wait(60);
  const en = $('#enBox');
  en.value = 'the telescope';
  en.dispatchEvent(new w.Event('input', { bubbles: true }));
  const t0 = Date.now();
  click($('[data-act="goEn"]'));

  await wait(1400);
  const tAt1_4 = Date.now() - t0;
  step(`translation on screen at ~${tAt1_4}ms (< 1.6s although sentences take 4s)`,
    /Teleskop/.test($('#deBox').value) && tAt1_4 < 1600);
  step('status already says Google Translate', /Google Translate/.test($('#expStatus').textContent));
  step('status honestly says sentences are loading', /getting example sentences/.test($('#expStatus').textContent));

  await wait(4000); // now ~5.4s total: the 4s sentence sources have landed
  const r = w.App.exp.result;
  step('sentences streamed in afterwards', !!r && r.examples.length >= 2 && !r.examplesPending);
  step('sources recorded', !!(r && r.sources && r.sources.tatoeba && r.sources.ai));
  step('final status announces examples', /examples ready/.test($('#expStatus').textContent));

  // same word again → cached translation is instant, sentences regenerate in background
  en.value = 'the telescope';
  en.dispatchEvent(new w.Event('input', { bubbles: true }));
  const t1 = Date.now();
  click($('[data-act="goEn"]'));
  await wait(300);
  step(`cached re-lookup instant (~${Date.now() - t1}ms)`, /Teleskop/.test($('#deBox').value) && /memory/.test($('#expStatus').textContent));

  log.push('--- jsdom errors ---');
  step('zero js errors', errors.length === 0);
  console.log(log.join('\n'));
  const fails = log.filter(x => x.startsWith('FAIL')).length;
  console.log(fails === 0 ? '\nALL PASS' : `\n${fails} FAILURES`);
  process.exit(fails ? 1 : 0);
})().catch(e => { console.log(log.join('\n')); console.error('CRASH:', e); process.exit(1); });

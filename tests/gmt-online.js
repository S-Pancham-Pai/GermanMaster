/* Full online Explore flow with a fake internet (all remote calls stubbed). */
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

/* --- fake the internet --- */
const calls = { gtx: 0, mm: 0, tat: 0, ai: 0 };
w.fetch = (url, opts) => {
  const u = String(url);
  const mk = (body, isText = false) => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(body), text: () => Promise.resolve(isText ? body : JSON.stringify(body)) });
  if (u.includes('translate.googleapis.com')) {
    calls.gtx++;
    const m = /[?&]q=([^&]+)/.exec(u); const q = decodeURIComponent(m[1]);
    if (q === 'the astronaut') return mk([[['der Astronaut', q, null, null, 10]], [['noun', ['der Kosmonaut', 'der Raumfahrer']]]], false);
    if (q === 'the lamp') return mk([[['die Lampe', q]]], false);
    if (q === 'echo-test') return mk([[['echo-test', q, null, null, 10]]], false); // echo -> useless
    return mk([[['übersetzt:' + q, q]]], false);
  }
  if (u.includes('api.mymemory.translated.net')) {
    calls.mm++;
    return mk({ responseData: { translatedText: 'mm-says' }, matches: [{ segment: 'Ein langer Satz aus einem echten Dokument.', translation: 'A long sentence from a real document.' }] });
  }
  if (u.includes('tatoeba.org')) {
    calls.tat++;
    if (u.includes('Lampe')) return mk({ results: [] });
    const m = /query=([^&]+)/.exec(u); const term = decodeURIComponent(m[1]).replace(/^=/, '');
    return mk({ results: [
      { text: `Der ${term} ist wirklich toll.`, translations: [[{ lang: 'eng', text: `The ${term} is really great.` }]], lang: 'deu' },
      { text: `Ich sehe den ${term} jeden Tag.`, translations: [[{ lang: 'eng', text: `I see the ${term} every day.` }]], lang: 'deu' }
    ] });
  }
  if (u.includes('text.pollinations.ai')) {
    if (opts && opts.method === 'POST') {
      calls.aiPost = (calls.aiPost || 0) + 1;
      return mk(`1. Die Lampe steht auf dem Tisch. => The lamp is on the table.\n2. Schalte bitte die Lampe ein. => Please switch on the lamp.`, true);
    }
    calls.ai++;
    if (u.includes('Lampe')) return Promise.reject(new Error('GET blocked — CORS'));
    return mk(`1. Der Astronaut fliegt zur Raumstation. => The astronaut flies to the space station.\n2. Jeder Astronaut trainiert viele Jahre. => Every astronaut trains for many years.\nKein gueltiges Format hier`, true);
  }
  return Promise.reject(new Error('unexpected fetch: ' + u));
};

w.eval(['util', 'banks', 'store', 'voice', 'dictbulk', 'dictdata', 'translate', 'data', 'stories', 'adaptive', 'engines', 'stage', 'views', 'app'].map(n => fs.readFileSync(base + 'js/' + n + '.js', 'utf8')).join('\n;\n')
  + '\n;window.App = App; window.Store = Store; window.Translate = Translate; window.Curriculum = Curriculum;');
w.document.dispatchEvent(new w.Event('DOMContentLoaded'));
const $ = s => w.document.querySelector(s), $$ = s => [...w.document.querySelectorAll(s)];
const click = el => el && el.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
const wait = ms => new Promise(r => setTimeout(r, ms));
const log = [];
const step = (n, ok) => log.push((ok ? 'PASS' : 'FAIL') + ' ' + n);

(async () => {
  await wait(300);
  // go to Explore and look up a word NOT in the course
  click($('.dock-btn[data-tab="explore"]')); await wait(60);
  const en = $('#enBox');
  en.value = 'the astronaut';
  en.dispatchEvent(new w.Event('input', { bubbles: true }));
  click($('[data-act="goEn"]'));
  await wait(2500);
  step('Google endpoint used for offline-unknown word', calls.gtx >= 1);
  step('German pane = gtx result', /Astronaut/.test($('#deBox').value));
  log.push('   de="' + $('#deBox').value + '" status="' + $('#expStatus').textContent + '"');
  step('not stuck at Translating', !/Translating/.test($('#expStatus').textContent));
  step('examples collected (tatoeba/ai/mm)', (w.App.exp.result && w.App.exp.result.examples.length >= 3));
  const srcs = (w.App.exp.result ? w.App.exp.result.examples : []).map(e => e.src);
  log.push('   example sources: ' + srcs.join(','));
  step('Tatoeba sentences present', srcs.includes('tatoeba'));
  step('AI sentences present (' + srcs.filter(s => s === 'ai').length + ')', srcs.includes('ai'));
  step('quote button shown', $('#quoteBtn').classList.contains('show'));
  // open the sheet, cycle examples, verify labels rotate
  click($('#quoteBtn')); await wait(80);
  const sheetHtml1 = $('#sheet').innerHTML;
  step('sheet opens with a sentence', /Der|Ich|Astronaut/.test(sheetHtml1));
  const label1 = ($('#sheet .sheet-via') || {}).textContent || '';
  click($('[data-act="nextEx"]')); await wait(80);
  const label2 = ($('#sheet .sheet-via') || {}).textContent || '';
  log.push('   labels: "' + label1 + '" -> "' + label2 + '"');
  step('source labels render', label1.length > 3);
  step('Google named in status', /Google/.test($('#expStatus').textContent));
  const altChips = $$('#altRow .sug-chip');
  step('alternatives row shown (' + altChips.length + ')', altChips.length >= 2);
  if (altChips.length) {
    click(altChips[0]); await wait(60);
    step('alt chip swaps German pane', /Kosmonaut|Raumfahrer/.test($('#deBox').value));
  }
  step('sources recorded (google ok)', !!(w.App.exp.result.sources && w.App.exp.result.sources.google));
  en.value = 'the lamp';
  en.dispatchEvent(new w.Event('input', { bubbles: true }));
  click($('[data-act="goEn"]'));
  await wait(2500);
  const lampR = w.App.exp.result;
  step('lamp translated', /Lampe/.test($('#deBox').value));
  step('AI POST fallback produced sentences', !!lampR && lampR.examples.some(e => e.src === 'ai'));
  log.push('   lamp examples: ' + (lampR ? lampR.examples.map(e => e.src + ':' + e.de).join(' | ') : 'none'));

  // --- fresh AI examples on demand (the "AI mode" button) ---
  const aiBefore = calls.ai, aiPostBefore = calls.aiPost || 0;
  click($('[data-act="freshEx"]'));
  await wait(1500);
  step('fresh-AI button fires the writer again', calls.ai > aiBefore || (calls.aiPost || 0) > aiPostBefore);
  step('result flagged fresh', !!(w.App.exp.result && w.App.exp.result.fresh));
  step('status announces fresh AI examples', /fresh AI example/.test($('#expStatus').textContent));
  step('AI examples present after regenerate', w.App.exp.result.examples.some(e => e.src === 'ai'));
  step('sheet has counter + fresh button', /sheet-count/.test($('#sheet').innerHTML) && !!$('#sheet [data-act="freshEx"]'));
  click($('[data-act="nextEx"]')); await wait(60); // course example first, AI ones follow
  step('AI source label when cycling to an AI example', /AI-written/.test($('#sheet').innerHTML));

  // --- cached answers must still get NEW AI sentences ---
  en.value = 'the astronaut';
  en.dispatchEvent(new w.Event('input', { bubbles: true }));
  const gtxBefore = calls.gtx, aiBeforeCached = calls.ai;
  click($('[data-act="goEn"]'));
  await wait(2500);
  step('cached translation reused (no extra gtx call)', calls.gtx === gtxBefore);
  step('cached hit regenerates AI sentences', calls.ai > aiBeforeCached);
  step('cached hit marked fresh', !!(w.App.exp.result && w.App.exp.result.fresh));
  step('memory status + AI hint', /memory/.test($('#expStatus').textContent) && /💬/.test($('#expStatus').textContent));

  // course word online: course wins for translation, but real sentences still join
  en.value = 'der Hund';
  en.dispatchEvent(new w.Event('input', { bubbles: true }));
  click($('[data-act="goEn"]'));
  await wait(2200);
  log.push('   der Hund -> "' + $('#expStatus').textContent + '" ex=' + (w.App.exp.result ? w.App.exp.result.examples.length : -1));
  step('course word still instant', /course|memory/i.test($('#expStatus').textContent));
  step('course word example list non-empty', w.App.exp.result.examples.length >= 1);
  console.log(log.join('\n'));
  console.log('calls:', JSON.stringify(calls));
  console.log('--- errors:', errors.length ? [...new Set(errors)].slice(0, 6).join('\\n') : 'none');
  const fails = log.filter(x => x.startsWith('FAIL')).length;
  process.exit(fails === 0 && !errors.length ? 0 : 1);
})().catch(e => { console.log(log.join('\n')); console.error('CRASH:', e.message, (e.stack || '').split('\\n')[1] || ''); process.exit(1); });

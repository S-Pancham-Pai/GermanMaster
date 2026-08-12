/* gmt-fallback.js — v3.5 guarantees: the example sheet is NEVER empty.
   Scenario A: the whole internet rejects every call -> the built-in writer
   still produces gender-correct practice lines, and ✨ degrades gracefully.
   Scenario B: relay hosts blocked but Wiktionary (direct CORS) reachable ->
   real dictionary examples appear with on-the-fly Google translations. */
const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');
const base = path.join(__dirname, '..', 'web') + '/';

function makeDom(fetchImpl, label) {
  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', e => { if (!/Could not load|css|img|HTMLMediaElement|Not implemented/.test(e.message)) errors.push(label + ': ' + e.message); });
  vc.on('error', m => errors.push(label + ': ' + m));
  const dom = new JSDOM(fs.readFileSync(base + 'index.html', 'utf8'), { url: 'http://localhost/', runScripts: 'outside-only', pretendToBeVisual: true, virtualConsole: vc });
  const w = dom.window;
  Object.defineProperty(w.navigator, 'onLine', { get: () => true, configurable: true });
  w.fetch = fetchImpl;
  w.eval(['util', 'banks', 'store', 'voice', 'dictbulk', 'dictdata', 'translate', 'data', 'stories', 'adaptive', 'engines', 'stage', 'views', 'app'].map(n => fs.readFileSync(base + 'js/' + n + '.js', 'utf8')).join('\n;\n')
    + '\n;window.App = App; window.Store = Store; window.Translate = Translate; window.Curriculum = Curriculum;');
  w.document.dispatchEvent(new w.Event('DOMContentLoaded'));
  const $ = s => w.document.querySelector(s);
  const click = el => el && el.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
  const lookup = async (word, settleMs) => {
    click($('.dock-btn[data-tab="explore"]'));
    await new Promise(r => setTimeout(r, 60));
    const en = $('#enBox');
    en.value = word;
    en.dispatchEvent(new w.Event('input', { bubbles: true }));
    click($('[data-act="goEn"]'));
    await new Promise(r => setTimeout(r, settleMs));
  };
  return { w, $, $$: s => [...w.document.querySelectorAll(s)], click, lookup, errors };
}

const log = [];
const step = (n, ok) => log.push((ok ? 'PASS' : 'FAIL') + ' ' + n);

(async () => {
  /* ---------- Scenario A: every remote call rejects ---------- */
  {
    const rejectAll = () => Promise.reject(new Error('network dead'));
    const { w, $, click, lookup, errors } = makeDom(rejectAll, 'A');
    await new Promise(r => setTimeout(r, 300));
    await lookup('the broom', 2500);   // dictionary knows der Besen; course does NOT contain it
    const r = w.App.exp.result;
    step('A: dictionary translation survives total network failure', !!r && /Besen/.test(r.de));
    step('A: built-in writer fills the sheet (4 lines)', !!r && r.examples.length === 4 && r.examples.every(x => x.src === 'mini'));
    step('A: gender-correct definite article (Der Besen)', !!r && r.examples.some(x => /^Der Besen ist hier\.$/.test(x.de)));
    step('A: accusative masculine (einen Besen)', !!r && r.examples.some(x => x.de === 'Ich sehe einen Besen.'));
    step('A: every line has an English gloss', !!r && r.examples.every(x => x.en && x.en.length > 5));
    log.push('   A lines: ' + (r ? r.examples.map(x => x.de).join(' | ') : 'none'));
    step('A: status announces built-in practice lines', /built-in practice lines ready/.test($('#expStatus').textContent));
    // sheet renders + label correct
    click($('#quoteBtn'));
    await new Promise(r2 => setTimeout(r2, 80));
    step('A: sheet shows a practice line', /Besen/.test($('#sheet .sentence-de') ? $('#sheet .sentence-de').textContent : ''));
    step('A: built-in writer label visible', /built-in writer/.test($('#sheet').innerHTML));
    // sparkle on EMPTY sheet with dead network -> mini injected + honest message
    w.App.exp.result = Object.assign({}, w.App.exp.result, { examples: [] });
    click($('[data-act="freshEx"]'));
    await new Promise(r2 => setTimeout(r2, 1500));
    const r2 = w.App.exp.result;
    step('A: ✨ on empty sheet injects built-in lines when AI is blocked', !!r2 && r2.examples.some(x => x.src === 'mini'));
    step('A: honest ✏️ fallback message shown', /blocked on this network — built-in practice lines added/.test($('#expStatus').textContent));
    // sparkle again with lines already present -> retry message but lines stay
    click($('[data-act="freshEx"]'));
    await new Promise(r3 => setTimeout(r3, 1500));
    step('A: second ✨ keeps lines + asks to retry', /unreachable/.test($('#expStatus').textContent) && w.App.exp.result.examples.length >= 4);
    step('A: no jsdom errors', errors.length === 0);
  }

  /* ---------- Scenario B: Wiktionary reachable directly, relays/AI blocked ---------- */
  {
    const mk = (body, isText) => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(body), text: () => Promise.resolve(isText ? body : JSON.stringify(body)) });
    const mockB = (url) => {
      const u = String(url);
      if (u.includes('translate.googleapis.com')) {
        const m = /[?&]q=([^&]+)/.exec(u); const q = decodeURIComponent(m[1]);
        if (q === 'snail') return mk([[['die Schnecke', q]]]);                 // the translation itself
        return mk([[['EN:' + q.slice(0, 60), q]]]);                            // "translations" for wiki lines
      }
      if (u.includes('de.wiktionary.org')) {
        return mk({ query: { pages: { '42': { title: 'Schnecke', extract:
          'Schnecke (Substantiv, feminin)\nBeispiele:\n[1] Die Schnecke kriecht langsam durch den Garten.\n[2] Nach dem Regen sieht man viele Schnecken.\nMerkhilfe ohne Satz\nHerkunft: alt' } } } });
      }
      return Promise.reject(new Error('blocked: ' + u.slice(0, 40)));          // tatoeba, pollinations, relays
    };
    const { w, $, lookup, errors } = makeDom(mockB, 'B');
    await new Promise(r => setTimeout(r, 300));
    await lookup('snail', 2600);        // the user's exact failing word
    const r = w.App.exp.result;
    step('B: snail -> die Schnecke via Google', !!r && /Schnecke/.test(r.de));
    const srcs = (r && r.examples || []).map(x => x.src);
    log.push('   B sources: ' + srcs.join(','));
    log.push('   B lines: ' + (r ? r.examples.map(x => x.de + ' => ' + x.en).join(' | ') : 'none'));
    step('B: Wiktionary examples rescued the sheet', srcs.includes('wikt'));
    step('B: wiki lines carry Google translations', !!r && r.examples.some(x => x.src === 'wikt' && /^EN:Die Schnecke/.test(x.en)));
    step('B: junk lines filtered (headers not shown)', !!r && !r.examples.some(x => /Merkhilfe|Herkunft/.test(x.de)));
    step('B: status mentions dictionary examples', /real dictionary examples ready|writes new ones/.test($('#expStatus').textContent));
    step('B: sources panel records Wiktionary ✓', !!(r && r.sources && r.sources.wikt));
    step('B: no jsdom errors', errors.length === 0);
  }

  console.log(log.join('\n'));
  const fails = log.filter(x => x.startsWith('FAIL')).length;
  console.log(fails ? `\n${fails} FAILURES` : '\nALL PASS');
  process.exit(fails === 0 ? 0 : 1);
})().catch(e => { console.log(log.join('\n')); console.error('CRASH:', e.message, (e.stack || '').split('\n')[1] || ''); process.exit(1); });

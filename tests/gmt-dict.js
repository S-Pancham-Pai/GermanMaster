/* Offline dictionary: size, index quality, reverse lookups, UI flow. */
const fs = require('fs');
const { JSDOM, VirtualConsole } = require('jsdom');
const errors = [];
const vc = new VirtualConsole();
vc.on('jsdomError', e => { if (!/Could not load|css|img|HTMLMediaElement|Not implemented/.test(e.message)) errors.push(e.message); });
vc.on('error', m => errors.push(m));
const base = require('path').join(__dirname, '..', 'web') + '/';
const dom = new JSDOM(fs.readFileSync(base + 'index.html', 'utf8'), { url: 'http://localhost/', runScripts: 'outside-only', pretendToBeVisual: true, virtualConsole: vc });
const w = dom.window;
Object.defineProperty(w.navigator, 'onLine', { get: () => false, configurable: true });
w.eval(['util', 'banks', 'store', 'voice', 'dictbulk', 'dictdata', 'translate', 'data', 'stories', 'adaptive', 'engines', 'stage', 'views', 'app'].map(n => fs.readFileSync(base + 'js/' + n + '.js', 'utf8')).join('\n;\n')
  + '\n;window.App = App; window.Store = Store; window.DICT = DICT; window.Translate = Translate;');
w.document.dispatchEvent(new w.Event('DOMContentLoaded'));
const $ = s => w.document.querySelector(s);
const click = el => el && el.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
const wait = ms => new Promise(r => setTimeout(r, ms));
const log = [];
const step = (n, ok) => log.push((ok ? 'PASS' : 'FAIL') + ' ' + n);

(async () => {
  await wait(300);
  const D = w.DICT;

  log.push('--- dictionary size & index ---');
  step('>= 5500 entries merged (curated + bulk)', D.entries.length >= 5500);
  step('byKey index exists and is big', !!D.byKey && D.byKey.size > 10000);
  step('no duplicate german lemma|pos', (() => {
    const s = new Set(); let dup = 0;
    for (const it of D.entries) { const k = D.stripKey(it.de) + '|' + it.pos; if (s.has(k)) dup++; s.add(k); }
    return dup === 0;
  })());

  log.push('--- offline lookups (dict index) ---');
  const norm = s => String(s ?? '').trim().toLowerCase().replace(/[.…?!„“"»«']/g, '').replace(/\s+/g, ' ');
  const stripQ = s => norm(s).replace(/^(der|die|das|den|dem|des|ein|eine|einen|einem)\s+/i, '').replace(/^(the|a|an|to|my|your|its)\s+/i, '');
  const L = q => D.byKey.get(stripQ(q)) || D.byKey.get(norm(q));
  const haus = L('Haus');
  step('Haus -> das Haus / house noun', !!haus && haus.en === 'house' && haus.gender === 'das' && haus.pos === 'noun');
  step('"das Haus" article-stripped hit', !!(L('das Haus')));
  step('house -> das Haus (reverse)', (() => { const h = L('house'); return h && /Haus/.test(h.de); })());
  step('the house -> das Haus (reverse, article stripped)', (() => { const h = L('the house'); return h && /Haus/.test(h.de); })());
  step('scharf -> sharp (bulk)', (() => { const h = L('scharf'); return h && /sharp/.test(h.en); })());
  step('Katze -> die Katze / cat', (() => { const h = L('Katze'); return h && h.gender === 'die' && /cat/.test(h.en); })());
  step('umlaut-fold: schon indexed (finds schön/schon)', !!D.byKey.get('schon'));
  step('curated wins: helfen keeps example', (() => { const h = L('helfen'); return h && /to help/.test(h.en) && h.exampleDe && h.exampleDe.length > 5; })());
  step('apple -> Apfel', (() => { const h = L('Apfel'); return h && /apple/.test(h.en) && h.gender === 'der'; })());
  step('long-tail word: Psychologie present', !!L('Psychologie'));
  step('verb has to-form: essen', !!D.entries.find(it => D.stripKey(it.de) === 'essen' && it.pos === 'verb' && /^to eat/.test(it.en)));
  step('das Essen (noun) keeps priority for "essen"', (() => { const h = L('essen'); return h && h.pos === 'noun' && /dinner|meal|food/.test(h.en); })());
  step('unknown word -> not indexed (no wrong guess)', !L('Quidditch'));

  log.push('--- end-to-end offline Translate.lookup ---');
  const r1 = await w.eval('Translate.lookup("Haus")');
  step('lookup(Haus) correct gloss (course or dict)', r1 && (r1.via === 'dict' || r1.via === 'course') && /Haus/.test(r1.de || '') && /^(the )?house$/.test(r1.en || '') && r1.offline === true);
  const r2 = await w.eval('Translate.lookup("kitchen")');
  step('lookup(kitchen) reverse -> die Küche', r2 && /Küche/.test(r2.de || ''));
  const r3 = await w.eval('Translate.lookup("Geschenk")');
  step('lookup(Geschenk) -> present/gift das', r3 && /gift|present/.test(r3.en || '') && r3.gender === 'das');
  const r4 = await w.eval('Translate.lookup("Quidditch")');
  step('lookup(Quidditch) honest miss', r4 && (r4.via === 'noresult' || r4.via === 'gloss'));

  log.push('--- lookup speed (~6k entries) ---');
  const t0 = Date.now();
  w.eval(`(function(){ const q=['haus','gehen','schnell','stadt','liebe','quidditch','baum','fahren','zeit','geschenk','arbeiten','farbe','rot']; let n=0; for(let r=0;r<40;r++) for(const x of q){ const h=DICT.byKey.get(x); if(h)n++; } return n; })()`);
  const dur = Date.now() - t0;
  step(`520 lookups fast (<800ms, took ${dur}ms)`, dur < 800);

  log.push('--- UI offline flow ---');
  click($('.dock-btn[data-tab="explore"]')); await wait(60);
  const en = $('#enBox'), deInput = $('#deBox');
  en.value = 'apple';
  en.dispatchEvent(new w.Event('input', { bubbles: true }));
  click($('[data-act="goEn"]')); await wait(900);
  step('not stuck at Translating (apple)', !/Translating/.test($('#expStatus').textContent));
  step('apple -> der Apfel offline', /Apfel/.test(deInput.value));
  step('offline hint mentions pocket dictionary size', /pocket dictionary \([\d.,]+ words\)/.test(w.document.body.innerHTML));

  en.value = 'Quidditch';
  en.dispatchEvent(new w.Event('input', { bubbles: true }));
  click($('[data-act="goEn"]')); await wait(900);
  step('unknown offline word gives honest no-result', !/Translating/.test($('#expStatus').textContent));

  log.push('--- jsdom errors ---');
  step('zero js errors', errors.length === 0);
  if (errors.length) log.push('ERRORS: ' + errors.slice(0, 5).join(' | '));

  console.log(log.join('\n'));
  const fails = log.filter(x => x.startsWith('FAIL')).length;
  console.log(fails === 0 ? '\nALL PASS' : `\n${fails} FAILURES`);
  process.exit(fails === 0 ? 0 : 1);
})().catch(e => { console.error('CRASH', e); process.exit(1); });

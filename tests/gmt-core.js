/* Core app smoke tests: boot, tabs, gating, stage runner, You page. (offline) */
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
  + '\n;window.App = App; window.Store = Store; window.Curriculum = Curriculum; window.Adaptive = Adaptive;');
w.document.dispatchEvent(new w.Event('DOMContentLoaded'));
const $ = s => w.document.querySelector(s), $$ = s => [...w.document.querySelectorAll(s)];
const click = el => el && el.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
const wait = ms => new Promise(r => setTimeout(r, ms));
const log = [];
const step = (n, ok) => log.push((ok ? 'PASS' : 'FAIL') + ' ' + n);
const tab = async t => { click($(`.dock-btn[data-tab="${t}"]`)); await wait(80); };

(async () => {
  await wait(300);
  log.push('--- boot & learn map ---');
  step('boots onto learn with level cards', $$('.level-head').length >= 3);
  step('A2 locked at boot', w.eval('Adaptive.isLevelUnlocked("A2")') === false);
  click($('[data-act="level"][data-level="A2"]')); await wait(60);
  step('A2 stays closed after tap', $$('.unit-head').every(h => !(h.dataset.id || '').startsWith('A2')));
  step('A1 open at boot with units', $$('.unit-head').length >= 3);
  if (!$$('.stage-row').length) { click($('.unit-head')); await wait(80); }
  step('first unit expands stages', $$('.stage-row').length >= 1);

  log.push('--- stage runner ---');
  w.App.action('stage', { id: 'A2-U1-S1' }, null); await wait(80);
  step('direct locked stage action blocked', !w.document.querySelector('.run-top'));
  const openStage = $$('.stage-row:not(.locked)')[0];
  click(openStage); await wait(200); await wait(1400);   step('unlocked stage starts the session runner', !!w.document.querySelector('.run-top, .qcard, .mission-card'));
  const stepRoot = $('#stepRoot');
  const qcardText = (stepRoot || {}).textContent || '';
  step('runner shows the mission card content', /Let/.test(qcardText) && qcardText.trim().length > 30);
  const goBtn = $('#goBtn');
  step('mission has a start button', !!goBtn);
  if (goBtn) { click(goBtn); await wait(150); }
  step('advancing lands on context/cards/quiz', /Context|Key cards|Pattern|What does this mean|Notice/i.test($('#main').textContent));
  // back out
  await tab('learn');
  step('back on learn map after tab re-tap', $$('.level-head').length >= 3);

  log.push('--- review / practice / stories / you ---');
  await tab('review');
  step('review shows queue or empty state', !!$('.rev-card, .empty-state, .rbig, .review-top, #main [class*="rev"]'));
  await tab('practice');
  step('practice lists drills', $$('.drill-card').length >= 3);
  await tab('stories');
  step('stories library renders', $$('.story-card').length >= 2);
  await tab('you');
  step('you page hero', !!$('.you-hero'));
  step('six skill bars', $$('.skill-row').length === 6);
  step('week tracker dots', $$('.week-dot').length === 7);
  step('settings rows present', $$('.set-row').length >= 3);

  log.push('--- persistence & memory ---');
  step('Store remembers a graded word', (w.eval('Store.seedWord("guten Morgen")'), Object.keys(w.Store.get().memory || {}).length >= 1));
  step('state persists to localStorage', (() => { w.Store.save(); return !!w.localStorage.getItem('germanmaster.v3'); })());

  log.push('--- jsdom errors ---');
  step('zero js errors', errors.length === 0);
  if (errors.length) log.push('ERRORS: ' + [...new Set(errors)].slice(0, 5).join(' | '));
  console.log(log.join('\n'));
  const fails = log.filter(x => x.startsWith('FAIL')).length;
  console.log(fails === 0 ? '\nALL PASS' : `\n${fails} FAILURES`);
  process.exit(fails ? 1 : 0);
})().catch(e => { console.log(log.join('\n')); console.error('CRASH:', e); process.exit(1); });

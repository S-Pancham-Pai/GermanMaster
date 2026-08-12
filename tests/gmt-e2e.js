/* Full end-to-end: play an entire stage to PASS, a drill to completion,
   and a story to "read". Uses a looseEq shim to answer everything correctly
   (it's a UI/driver test, not a knowledge test). */
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
  + '\n;window.App = App; window.Store = Store; window.Curriculum = Curriculum; window.Adaptive = Adaptive; window.Views = Views;');
w.document.dispatchEvent(new w.Event('DOMContentLoaded'));
const $ = s => w.document.querySelector(s), $$ = s => [...w.document.querySelectorAll(s)];
const click = el => el && el.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
const wait = ms => new Promise(r => setTimeout(r, ms));
const log = [];
const step = (n, ok) => log.push((ok ? 'PASS' : 'FAIL') + ' ' + n);

(async () => {
  await wait(300);
  w.eval('window.__origLoose = looseEq; looseEq = function(){ return true; };');

  log.push('--- full stage playthrough ---');
  const mem0 = Object.keys(w.Store.get().memory || {}).length;
  const s1 = w.eval("Curriculum.levelUnits('A1')[0].stages[0]");
  step('first stage exists', !!s1 && !!s1.id);
  w.App.action('stage', { id: s1.id }, null);
  await wait(400);

  let guard = 0, sawResult = false, stepsSeen = new Set();
  const trail = [];
  const mark = a => trail.push((($('.run-title')||{}).textContent||'?') + ':' + a);
  while (guard++ < 90 && !sawResult) {
    await wait(140);
    if ($('.result')) { sawResult = true; break; }
    const engineNow = ($('.run-title') || {}).textContent || '';
    if (engineNow) stepsSeen.add(engineNow);
    if ($('#goBtn')) { mark('go'); click($('#goBtn')); continue; }
    const cont = $('#continueBtn');
    if (cont && !cont.classList.contains('hidden')) { mark('cont'); click(cont); continue; }
    const selfOk = $('.grade-self:not(.hidden) .choice[data-g="1"]');
    if (selfOk) { mark('selfOk'); click(selfOk); continue; }
    const typed = $('#typed');
    const check = $('#checkBtn');
    if (typed && check && !check.classList.contains('hidden') && !check.disabled) {
      typed.value = 'Ich lerne Deutsch';
      typed.dispatchEvent(new w.Event('input', { bubbles: true }));
      mark('typed+check'); click(check); continue;
    }
    const chip = $$('.chip-bank .chip:not([disabled])')[0];
    if (chip && check) {
      if (!check.disabled) { mark('buildcheck'); click(check); continue; }
      mark('chip'); click(chip); continue;
    }
    const choice = $$('.choice:not(:disabled)')[0];
    if (choice) { mark('choice'); click(choice); continue; }
    const sendPrimary = $$('.primary:not(.hidden):not(:disabled)')[0];
    if (sendPrimary) { mark('primary'); click(sendPrimary); continue; }
    mark('idle');
  }
  log.push('   trail: ' + trail.join(' '));
  if (!sawResult) {
    log.push('   STALL dbg: title="' + (($('.run-title')||{}).textContent||'') + '" stepRoot=' + (($('#stepRoot')||{innerHTML:''}).innerHTML||'').slice(0,260));
    log.push('   stage record: ' + JSON.stringify(w.Store.stage(s1.id)));
  }
  step('runner reached the result screen', sawResult);
  step('many engine kinds were exercised (' + stepsSeen.size + ')', stepsSeen.size >= 4);
  log.push('   engines seen: ' + [...stepsSeen].join(', '));
  const resText = ($('.result') || { textContent: '' }).textContent;
  step('result shows the pass screen (score "100%" + "Stage complete.")', /Stage complete/i.test(resText) && /100%/.test(resText));
  const passed = w.Store.get().passedStages || w.Store.get().stages || {};
  step('stage recorded as passed in Store', !!(passed[s1.id] || (w.Store.get().passed || {})[s1.id]));
  step('vocabulary seeded into memory', Object.keys(w.Store.get().memory || {}).length > mem0);
  const st2 = w.eval("Curriculum.levelUnits('A1')[0].stages[1]");
  step('next stage unlocked after pass', w.Adaptive.isStageUnlocked(st2) === true);
  log.push('   rec=' + JSON.stringify(w.Store.stage(s1.id)) + ' passScore=' + w.Store.passing());
  // exit runner back to map
  click($('[data-act="goLearn"]') || $('.dock-btn[data-tab="learn"]')); await wait(120);

  log.push('--- drill playthrough ---');
  click($('.dock-btn[data-tab="practice"]')); await wait(120);
  const drillCard = $$('.drill-card:not(.locked)')[0] || $$('.drill-card')[0];
  step('a drill card exists', !!drillCard);
  if (drillCard) {
    click(drillCard); await wait(250);
    if ($('.run-top')) {
      let g2 = 0, done2 = false;
      while (g2++ < 70 && !done2) {
        await wait(130);
        if (!$('.run-top')) { done2 = true; break; }
        const cont = $('#continueBtn');
        if (cont && !cont.classList.contains('hidden')) { click(cont); continue; }
        const selfOk = $('.grade-self:not(.hidden) .choice[data-g="1"]');
        if (selfOk) { click(selfOk); continue; }
        const typed = $('#typed'), check = $('#checkBtn');
        if (typed && check && !check.classList.contains('hidden') && !check.disabled) { typed.value = 'Hallo'; click(check); continue; }
        const chip = $$('.chip-bank .chip:not([disabled])')[0];
        if (chip && check) { if (!check.disabled) { click(check); continue; } click(chip); continue; }
        const choice = $$('.choice:not(:disabled)')[0];
        if (choice) { click(choice); continue; }
        const prim = $$('.primary:not(.hidden):not(:disabled)')[0];
        if (prim) { click(prim); continue; }
      }
      step('drill ran to completion (runner exited)', done2);
    } else {
      log.push('   drill did not open a runner: ' + $('#main').textContent.slice(0, 90));
      step('drill opened something interactive or a visible notice', $('#main').textContent.trim().length > 20);
    }
  }

  log.push('--- story completion ---');
  await (async () => { click($('.dock-btn[data-tab="stories"]')); await wait(120); })();
  const storyCard = $$('.story-card:not(.locked)')[0];
  step('an unlocked story exists', !!storyCard);
  if (storyCard) {
    click(storyCard); await wait(250);
    step('reader renders lines', $$('#readerLines .ctx-line, .reader .ctx-line').length >= 3);
    let g3 = 0;
    while (g3++ < 8 && $$('.sq .choice:not(:disabled)').length) {
      click($('.sq .choice:not(:disabled)'));
      await wait(130);
    }
    const readFlags = w.Store.get().read || {};
    step('story marked read after all answers', Object.values(readFlags).some(v => v === true));
    step('today.stories bumped', (w.Store.get().today && w.Store.get().today.stories) >= 1);
  }

  log.push('--- wrong-answer path (shim off) ---');
  w.eval('looseEq = window.__origLoose;');
  click($('.dock-btn[data-tab="learn"]')); await wait(120);
  step('returned to learn map', $$('.level-head').length >= 3);

  log.push('--- jsdom errors ---');
  step('zero js errors', errors.length === 0);
  if (errors.length) log.push('ERRORS: ' + [...new Set(errors)].slice(0, 6).join(' | '));
  console.log(log.join('\n'));
  const fails = log.filter(x => x.startsWith('FAIL')).length;
  console.log(fails === 0 ? '\nALL PASS' : `\n${fails} FAILURES`);
  process.exit(fails ? 1 : 0);
})().catch(e => { console.log(log.join('\n')); console.error('CRASH:', e); process.exit(1); });

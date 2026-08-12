/* Local progress store: stages, SRS memory, skill axes, streak, mistakes */
const Store = (() => {
  const KEY = "germanmaster.v3";

  const defaults = () => ({
    stages: {},          // stageId -> {best,last,attempts,passed,at,mastery}
    memory: {},          // de -> {box,ease,next,errors,correct}
    axes: {},            // axis -> {ok,no}
    mistakes: [],        // [{de,en,why,at}]
    streak: { days: 0, last: null },
    read: {},
    today: { date: null, reviews: 0, stages: 0, stories: 0, drills: 0 },
    settings: {
      passScore: 80,
      speechRate: 0.95,
      onlineDict: true,
      autoSpeak: true,
      examples: true
    },
    createdAt: Date.now()
  });

  let state = defaults();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) state = { ...defaults(), ...JSON.parse(raw) };
    } catch (_) { state = defaults(); }
    rollToday();
    return state;
  }
  function save() {
    localStorage.setItem(KEY, JSON.stringify(state));
  }
  const get = () => state;

  function rollToday() {
    const t = todayKey();
    if (state.today.date !== t) {
      // streak survives if yesterday was active
      state.today = { date: t, reviews: 0, stages: 0, stories: 0, drills: 0 };
    }
  }
  function touch() {
    rollToday();
    const t = todayKey();
    if (state.streak.last !== t) {
      const gap = state.streak.last ? dayDiff(state.streak.last, t) : 99;
      state.streak.days = gap === 1 ? state.streak.days + 1 : 1;
      state.streak.last = t;
    }
    save();
  }

  const passing = () => state.settings.passScore;

  function passStage(id, score) {
    const prev = state.stages[id] || { best: 0, attempts: 0, mastery: 0 };
    const best = Math.max(prev.best, score);
    state.stages[id] = {
      best, last: score, attempts: prev.attempts + 1, at: Date.now(),
      passed: best >= passing(),
      mastery: Math.max(prev.mastery || 0, best >= passing() ? 1 : 0)
    };
    state.today.stages += 1;
    touch(); save();
    return state.stages[id];
  }
  function stageSeen(id) {
    if (!state.stages[id]) { state.stages[id] = { best: 0, attempts: 0, passed: false, at: Date.now(), mastery: 0 }; save(); }
  }
  const stage = (id) => state.stages[id];

  /* --- SRS memory (user-friendly intervals) --- */
  const INTERVALS = [0, 10 / 1440, 1, 3, 7, 14, 30]; // box -> days (box1 = 10 min)
  function rememberWord(de, q) { // q: 1..5
    const cur = state.memory[de] || { box: 0, ease: 2.5, next: 0, errors: 0, correct: 0 };
    if (q < 3) { cur.box = 1; cur.errors += 1; }
    else {
      cur.correct += 1;
      cur.box = clamp(cur.box + (q === 3 ? 1 : q === 4 ? 1 : 2), 2, 6);
      if (q === 3 && cur.box > 2) cur.box -= 1; // "hard" moves slower
    }
    cur.next = Date.now() + INTERVALS[cur.box] * 86400000;
    state.memory[de] = cur;
    save();
    return { box: cur.box, days: INTERVALS[cur.box] };
  }
  function seedWord(de) { // schedule a new word after a stage
    if (!state.memory[de]) {
      state.memory[de] = { box: 1, ease: 2.5, next: Date.now() + 86400000, errors: 0, correct: 0 };
    }
  }
  function dueWords(limit = 14) {
    const now = Date.now();
    return Object.entries(state.memory)
      .filter(([, m]) => m.next <= now)
      .sort((a, b) => a[1].next - b[1].next)
      .slice(0, limit)
      .map(([de]) => de);
  }
  const dueCount = () => dueWords(500).length;
  const knownCount = () => Object.values(state.memory).filter(m => m.correct > 0).length;

  /* --- skill axes: recognition / recall / listening / production per area --- */
  function grade(axis, ok, item, why) {
    const a = state.axes[axis] || { ok: 0, no: 0 };
    if (ok) a.ok += 1; else a.no += 1;
    state.axes[axis] = a;
    if (item && item.de) {
      if (ok) rememberWord(item.de, 4); else rememberWord(item.de, 1);
      if (!ok) {
        state.mistakes.unshift({ de: item.de, en: item.en || "", why: why || "", at: Date.now() });
        state.mistakes = state.mistakes.slice(0, 40);
      }
    }
    touch(); save();
  }
  function axisScore(axis) {
    const a = state.axes[axis] || { ok: 0, no: 0 };
    const n = a.ok + a.no;
    if (!n) return 0;
    const coverage = Math.min(1, n / 14);            // low data = low certainty
    return Math.round((a.ok / n) * 100 * (0.35 + 0.65 * coverage));
  }
  function weakestAxes(n = 3) {
    return ["vocabulary", "grammar", "listening", "speaking", "reading", "writing"]
      .map(ax => ({ ax, ...((state.axes[ax]) || { ok: 0, no: 0 }) }))
      .sort((a, b) => (a.ok / Math.max(1, a.ok + a.no)) - (b.ok / Math.max(1, b.ok + b.no)))
      .slice(0, n);
  }

  function bumpToday(key) { rollToday(); state.today[key] = (state.today[key] || 0) + 1; save(); }
  function setSetting(k, v) { state.settings[k] = v; save(); }
  function reset() { state = defaults(); save(); }

  load();
  return {
    get, save, touch, passStage, stageSeen, stage, passing,
    rememberWord, seedWord, dueWords, dueCount, knownCount,
    grade, axisScore, weakestAxes, bumpToday, setSetting, reset,
    intervals: INTERVALS
  };
})();

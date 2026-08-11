const Store = (() => {
  const KEY = "germanmaster.v2";

  const defaults = () => ({
    completed: {},
    memory: {},
    settings: {
      passScore: 80,
      speechRate: 0.92,
      onlineDict: true,
      autoSpeak: true,
      dark: false
    },
    weakSkills: {},
    sessionCount: 0,
    lastActive: Date.now(),
    createdAt: Date.now()
  });

  let state = defaults();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) state = { ...defaults(), ...JSON.parse(raw) };
    } catch (_) {
      state = defaults();
    }
    return state;
  }

  function save() {
    state.lastActive = Date.now();
    localStorage.setItem(KEY, JSON.stringify(state));
  }

  function get() { return state; }

  function completeLesson(id, score) {
    const prev = state.completed[id] || { best: 0, attempts: 0 };
    state.completed[id] = {
      best: Math.max(prev.best, score),
      last: score,
      attempts: prev.attempts + 1,
      at: Date.now(),
      passed: Math.max(prev.best, score) >= state.settings.passScore
    };
    save();
    return state.completed[id];
  }

  function rememberWord(de, quality) {
    const cur = state.memory[de] || { box: 1, ease: 2.5, next: 0, errors: 0, correct: 0 };
    if (quality < 3) {
      cur.box = 1;
      cur.errors += 1;
      cur.next = Date.now() + 10 * 60 * 1000;
    } else {
      cur.box = Math.min(5, cur.box + (quality >= 4 ? 2 : 1));
      cur.correct += 1;
      const days = cur.box === 2 ? 1 : cur.box === 3 ? 3 : cur.box === 4 ? 7 : 14;
      cur.next = Date.now() + days * 24 * 60 * 60 * 1000;
    }
    state.memory[de] = cur;
    save();
  }

  function dueWords(limit = 12) {
    const now = Date.now();
    return Object.entries(state.memory)
      .filter(([, m]) => m.next <= now || m.box <= 2)
      .sort((a, b) => a[1].box - b[1].box || a[1].next - b[1].next)
      .slice(0, limit)
      .map(([de]) => de);
  }

  function markSkill(skill, ok) {
    const s = state.weakSkills[skill] || { ok: 0, no: 0 };
    if (ok) s.ok += 1; else s.no += 1;
    state.weakSkills[skill] = s;
    save();
  }

  function reset() {
    state = defaults();
    save();
  }

  function setSetting(key, value) {
    state.settings[key] = value;
    save();
  }

  load();
  return { load, save, get, completeLesson, rememberWord, dueWords, markSkill, reset, setSetting };
})();

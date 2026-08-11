const Adaptive = {
  currentLevel() {
    const order = ["A1", "A2", "B1", "B2", "C1", "C2"];
    for (const code of order) {
      const p = this.levelProgress(code);
      if (p.pct < 80) return { code, ...p };
    }
    return { code: "C2", ...this.levelProgress("C2") };
  },

  levelProgress(code) {
    const lessons = Curriculum.lessons.filter(l => l.level === code);
    if (!lessons.length) return { done: 0, total: 0, pct: 0 };
    const done = lessons.filter(l => Store.get().completed[l.id]?.passed).length;
    return { done, total: lessons.length, pct: Math.round((done / lessons.length) * 100) };
  },

  isLevelUnlocked(code) {
    const order = ["A1", "A2", "B1", "B2", "C1", "C2"];
    const i = order.indexOf(code);
    if (i <= 0) return true;
    return this.levelProgress(order[i - 1]).pct >= 80;
  },

  isLessonUnlocked(lesson) {
    if (!this.isLevelUnlocked(lesson.level)) return false;
    const siblings = Curriculum.lessons.filter(
      l => l.level === lesson.level && l.skill === lesson.skill
    );
    const idx = siblings.findIndex(l => l.id === lesson.id);
    if (idx <= 0) {
      if (lesson.skill === "vocabulary") return true;
      if (lesson.skill === "grammar") return this.skillPassed(lesson.level, "vocabulary", 2);
      if (lesson.skill === "listening") return this.skillPassed(lesson.level, "vocabulary", 1);
      if (lesson.skill === "speaking") return this.skillPassed(lesson.level, "listening", 1);
      if (lesson.skill === "reading") return this.skillPassed(lesson.level, "vocabulary", 2);
      if (lesson.skill === "writing") return this.skillPassed(lesson.level, "grammar", 1);
      return true;
    }
    const prev = siblings[idx - 1];
    return !!Store.get().completed[prev.id]?.passed;
  },

  skillPassed(level, skill, min = 1) {
    const list = Curriculum.lessons.filter(l => l.level === level && l.skill === skill);
    const done = list.filter(l => Store.get().completed[l.id]?.passed).length;
    return done >= Math.min(min, list.length);
  },

  insight() {
    const { code, pct, done, total } = this.currentLevel();
    const weak = Object.entries(Store.get().weakSkills)
      .map(([k, v]) => ({ k, rate: v.ok + v.no ? v.ok / (v.ok + v.no) : 1 }))
      .sort((a, b) => a.rate - b.rate)[0];
    const due = Store.dueWords().length;
    if (due >= 4) return `A few words are getting fuzzy. A short review now will lock them in before ${code} moves on.`;
    if (weak && weak.rate < 0.7) return `You're slipping on ${weak.k}. I'll mix more of that into the next quiz.`;
    if (pct >= 70 && pct < 80) return `${code} is almost open to the next level — ${done}/${total} lessons at 80%+.`;
    if (pct === 0) return `Start with greetings. German is learned in small, locked-in steps — not dumped all at once.`;
    return `On ${code} · ${pct}% complete. Keep the chain: finish a tile, then the next one unlocks.`;
  },

  injectWeakItems(items, skill) {
    const extra = [];
    const due = Store.dueWords(4);
    for (const de of due) {
      const found = Curriculum.allItems().find(it => it.de === de);
      if (found && !items.some(i => i.de === found.de)) extra.push(found);
    }
    if (skill === "vocabulary" || skill === "grammar") {
      const arts = Curriculum.allItems().filter(i => i.gender && (Store.get().memory[i.de]?.errors || 0) > 0);
      extra.push(...arts.slice(0, 2));
    }
    return [...items, ...extra].slice(0, items.length + 3);
  }
};

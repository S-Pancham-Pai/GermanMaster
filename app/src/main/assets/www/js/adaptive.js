/* Progression brain: unlock rules, mastery, today's plan, coaching text */
const Adaptive = {
  stagePassed(s) { const r = Store.stage(s.id); return !!(r && r.passed); },
  unitStats(u) {
    const total = u.stages.length;
    const passed = u.stages.filter(s => this.stagePassed(s)).length;
    const bests = u.stages.map(s => (Store.stage(s.id) || {}).best || 0);
    const avg = total ? Math.round(bests.reduce((a, b) => a + b, 0) / total) : 0;
    return { total, passed, pct: total ? Math.round((passed / total) * 100) : 0, avg };
  },
  isStageUnlocked(s) {
    if (!this.isUnitUnlocked(Curriculum.byUnit(s.unitId))) return false;
    if (s.index === 0) return true;
    const u = Curriculum.byUnit(s.unitId);
    const prev = u.stages[s.index - 1];
    return this.stagePassed(prev);
  },
  isUnitUnlocked(u) {
    if (!this.isLevelUnlocked(u.level)) return false;
    const list = Curriculum.levelUnits(u.level);
    const i = list.findIndex(x => x.id === u.id);
    if (i <= 0) return true;
    const prev = list[i - 1];
    const st = this.unitStats(prev);
    const gate = Math.ceil(prev.stages.length * 0.8);
    const missionPassed = this.stagePassed(prev.stages[prev.stages.length - 1]);
    return st.passed >= gate && missionPassed;
  },
  levelStats(code) {
    const us = Curriculum.levelUnits(code);
    if (!us.length) return { pct: 0, passed: 0, total: 0 };
    let passed = 0, total = 0;
    us.forEach(u => { const st = this.unitStats(u); passed += st.passed; total += st.total; });
    return { pct: total ? Math.round((passed / total) * 100) : 0, passed, total };
  },
  isLevelUnlocked(code) {
    const order = Curriculum.LEVELS.map(l => l.code);
    const i = order.indexOf(code);
    if (i <= 0) return true;
    const prevCode = order[i - 1];
    const us = Curriculum.levelUnits(prevCode);
    if (!us.length) return false;
    const st = this.levelStats(prevCode);
    const finalUnit = us[us.length - 1];
    const finalMission = this.stagePassed(finalUnit.stages[finalUnit.stages.length - 1]);
    return st.pct >= 80 && finalMission;
  },
  current() {
    for (const lv of Curriculum.LEVELS) {
      const st = this.levelStats(lv.code);
      if (st.pct < 100) {
        const unlocked = this.isLevelUnlocked(lv.code);
        if (unlocked) return { code: lv.code, name: lv.name, ...st };
      }
    }
    const last = Curriculum.LEVELS[Curriculum.LEVELS.length - 1];
    return { code: last.code, name: last.name, ...this.levelStats(last.code) };
  },
  nextStage() {
    for (const lv of Curriculum.LEVELS) {
      if (!this.isLevelUnlocked(lv.code)) continue;
      for (const u of Curriculum.levelUnits(lv.code)) {
        if (!this.isUnitUnlocked(u)) break;
        for (const s of u.stages) {
          if (this.isStageUnlocked(s) && !this.stagePassed(s)) return s;
        }
      }
    }
    return null;
  },
  masteryLabel(s) {
    const m = (Store.stage(s.id) || {}).mastery || 0;
    return ["—", "Practised", "Reliable", "Mastered"][m];
  },
  todayPlan() {
    const due = Store.dueCount();
    const next = this.nextStage();
    const storyDone = Store.get().today.stories > 0;
    const plan = [];
    if (next) plan.push({ kind: "stage", label: `New stage: ${next.title}`, done: false, id: next.id });
    if (due > 0) plan.push({ kind: "review", label: `Review ${Math.min(due, 12)} fading words`, done: Store.get().today.reviews > 0 });
    plan.push({ kind: "story", label: "Read one graded story", done: storyDone });
    return plan;
  },
  unlockedItems() {
    /* every stage the learner can currently reach in an unlocked unit */
    const out = [];
    for (const lv of Curriculum.LEVELS) {
      if (!this.isLevelUnlocked(lv.code)) continue;
      for (const u of Curriculum.levelUnits(lv.code)) {
        if (!this.isUnitUnlocked(u)) break;
        for (const s of u.stages) {
          if (this.isStageUnlocked(s) || Store.stage(s.id)) out.push(...Curriculum.stageItems(s));
        }
      }
    }
    const seen = new Set();
    return out.filter(i => i.de && !seen.has(i.de) && seen.add(i.de));
  },
  insight() {
    const cur = this.current();
    const due = Store.dueCount();
    const weak = Store.weakestAxes(1)[0];
    const next = this.nextStage();
    if (due >= 5) return `${due} words are fading. Clear the Review queue first — five minutes now saves twenty later.`;
    if (weak && weak.ok + weak.no >= 6 && weak.ok / (weak.ok + weak.no) < 0.65)
      return `Your ${weak.ax} answers hit only ${Math.round(100 * weak.ok / (weak.ok + weak.no))}% — a Practice drill on that today will lift it fast.`;
    if (next) return `Next up: “${next.title}” — after it: ${next.mission.replace(/\.$/, "").toLowerCase()}. Keep the ${cur.code} chain going.`;
    return `${cur.code} complete at ${cur.pct}%. Finish the checkpoint unit to open the next level.`;
  }
};

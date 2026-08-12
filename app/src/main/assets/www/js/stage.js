/* Turns a stage into the learning cycle:
   Mission → Context → Notice → Cards → Practice → Recall → Listening → Produce → Result */
const StageFlow = {
  buildSteps(s) {
    const items = Curriculum.stageItems(s);
    const authored = (s.ask || []).map(a => ({ ...a }));
    const used = new Set();
    const takeAuthored = (...engines) => {
      const out = [];
      for (const a of authored) if (engines.includes(a.engine) && !used.has(a)) { used.add(a); out.push(a); }
      return out;
    };
    const pick = (n) => shuffle(items.filter(i => !used.has(i.de))).slice(0, n);

    const steps = [];
    steps.push({ engine: "mission", title: s.title, mission: s.mission });
    if (s.dialogue && s.dialogue.length) steps.push({ engine: "context", dialogue: s.dialogue });
    if (s.notice) steps.push({ engine: "notice", text: s.notice.q, options: s.notice.options, answer: s.notice.answer, why: s.notice.why });
    if (s.cards && s.cards.length) steps.push({ engine: "cards", cards: s.cards });

    // ---- practice (recognition): authored mc/formal first, then generated ----
    const prac = takeAuthored("mc", "formal");
    for (const it of pick(3)) {
      if (!it.en) continue;
      if (!prac.some(p => p.text === it.en)) {
        prac.push(genMc(it, "de2en", items));
      }
    }
    const listenAuth = takeAuthored("listen");
    const practiceSteps = [...prac.slice(0, 3), ...listenAuth];

    // ---- recall ----
    const recall = takeAuthored("recall", "builder", "repair");
    for (const it of pick(2)) {
      if (it.de && it.en) recall.push({ engine: "recall", prompt: `Say in German: “${it.en}”`, answer: it.de, alts: it.gender ? [it.de.replace(/^(der|die|das)\s+/i, "")] : [], item: it, why: it.gender ? `Article included: ${it.de}.` : "" });
    }
    const withExample = items.find(i => i.exampleDe && i.exampleDe.split(/\s+/).length >= 3 && i.exampleDe.split(/\s+/).length <= 8);
    if (withExample && recall.filter(r => r.engine === "builder").length === 0) {
      recall.push({
        engine: "builder", chunks: withExample.exampleDe.replace(/[!.]/g, "").split(/\s+/),
        answer: withExample.exampleDe.replace(/[!.]/g, ""), hint: `“${withExample.exampleEn}”`,
        item: withExample, why: "Check the model — notice where the verb sits."
      });
    }

    // ---- listening ----
    const listening = [...takeAuthored("dictation")];
    if (items.length >= 3 && listening.length === 0) {
      const it = pick(1)[0] || items[0];
      if (it && it.en) {
        const distract = shuffle(items.filter(x => x.en !== it.en)).slice(0, 3).map(x => x.en);
        listening.push({ engine: "listen", kicker: "What did you hear?", audio: it.exampleDe && it.exampleDe.split(/\s+/).length <= 8 ? it.exampleDe : it.de, options: shuffle([it.exampleDe && it.exampleDe.split(/\s+/).length <= 8 ? it.exampleEn : it.en, ...distract.filter(d => d !== it.exampleEn)]), answer: it.exampleDe && it.exampleDe.split(/\s+/).length <= 8 ? it.exampleEn : it.en, item: it, why: "" });
      }
      const dic = items.find(i => i.exampleDe && i.exampleDe.length <= 42) || items.find(i => i.de.length <= 42);
      if (dic) listening.push({ engine: "dictation", audio: dic.exampleDe || dic.de, answer: dic.exampleDe || dic.de, alts: [(dic.exampleDe || dic.de).replace(/[.!?]$/, "")], item: dic, why: "" });
    }

    const graded = [...practiceSteps, ...recall, ...listening].slice(0, 8);
    steps.push(...graded);

    // ---- produce (unit checkpoint) ----
    if (s.check) steps.push(checkToStep(s.check));

    return steps;
  },

  run(s) {
    Voice.stop();
    Store.stageSeen(s.id);
    const steps = this.buildSteps(s);
    App.setPreview("");
    RunSession({
      title: s.title,
      steps,
      onExit: () => App.render(),
      onDone: (res) => {
        if (!res) { App.render(); return; }
        const pass = res.score >= Store.passing();
        if (pass) {
          Store.passStage(s.id, res.score);
          Curriculum.stageItems(s).forEach(it => Store.seedWord(it.de));
        }
        StageViews.result(s, res, pass);
      }
    });
  }
};

function checkToStep(c) {
  if (c.type === "dialogue") return { engine: "dialogue", title: c.title, script: c.script, why: "" };
  if (c.type === "say") return { engine: "say", prompt: c.prompt, target: c.target, model: c.model };
  if (c.type === "open") return { engine: "open", prompt: c.prompt, model: c.model };
  if (c.type === "mc") return { engine: "mc", kicker: c.prompt, text: c.text, options: c.options, answer: c.answer, why: c.why };
  if (c.type === "recall") return { engine: "recall", prompt: c.prompt, answer: c.answer, alts: c.alts || [], why: c.why };
  return { engine: "say", prompt: "Read it aloud", target: "", model: "Weiter so!" };
}

function genMc(item, dir, pool) {
  const field = dir === "de2en" ? "en" : "de";
  const answer = item[field];
  const distract = shuffle(unique(pool.filter(i => i[field] && i[field] !== answer).map(i => i[field]))).slice(0, 3);
  return {
    engine: "mc",
    kicker: dir === "de2en" ? "What does this mean?" : "How do you say this?",
    text: dir === "de2en" ? item.de : item.en,
    options: shuffle([answer, ...distract]),
    answer, item,
    why: item.gender ? `It's ${item.de} — with the article.` : ""
  };
}

/* result + unlock screens */
const StageViews = {
  result(s, res, pass) {
    const next = Curriculum.byUnit(s.unitId).stages[s.index + 1];
    const unit = Curriculum.byUnit(s.unitId);
    const misses = res.misses || [];
    const circ = 2 * Math.PI * 54;
    $("#main").innerHTML = `
      <div class="result">
        <div class="result-badge">${pass ? icon("star") : icon("refresh")}</div>
        <h2>${pass ? "Stage complete." : "One more round."}</h2>
        <p class="result-sub">${pass
          ? (next ? `Next unlocks: “${esc(next.title)}”.` : unit.stages[s.index] === unit.stages[unit.stages.length - 1] ? `That was the “${esc(unit.title)}” mission — the next unit is open.` : "Keep going.")
          : `You need ${Store.passing()}% to move on — the misses below are exactly what the repeat will drill.`}</p>
        <div class="score-ring">
          <svg width="140" height="140" viewBox="0 0 128 128">
            <circle cx="64" cy="64" r="54" fill="none" stroke="rgba(255,255,255,.6)" stroke-width="10"/>
            <circle cx="64" cy="64" r="54" fill="none" stroke="${pass ? "var(--good)" : "var(--pink)"}" stroke-width="10"
              stroke-linecap="round" stroke-dasharray="${(res.score / 100) * circ} ${circ}"/>
          </svg>
          <div class="score-num">${res.score}%</div>
        </div>
        ${misses.length ? `<div class="miss-list">
          <div class="miss-label">Review these — they've been scheduled</div>
          ${misses.slice(0, 4).map(m => `<div class="miss-row"><b>${esc(m.text || m.wrong || m.prompt || m.audio || "")}</b><span>${esc(m.why || "")}</span></div>`).join("")}
        </div>` : ""}
        ${pass ? `<div class="schedule-note">${icon("calendar")} Vocabulary from this stage is scheduled for spaced review.</div>` : ""}
        <button class="primary" data-act="${pass ? "stageNext" : "stageRetry"}" data-id="${s.id}">${pass ? (next ? "Next stage" : "Back to the map") : "Retry this stage"}</button>
      </div>`;
  }
};

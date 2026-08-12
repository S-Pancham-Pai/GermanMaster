/* Reusable activity engines + the session runner.
   Every graded step ALWAYS explains why, not just right/wrong. */
const StepAxis = {
  mc: "vocabulary", formal: "grammar", repair: "grammar", builder: "grammar",
  listen: "listening", dictation: "listening", recall: "writing", open: "writing",
  say: "speaking", dialogue: "speaking", reading: "reading", notice: "vocabulary"
};
const EngineNames = {
  mc: "Meaning", formal: "Right register", repair: "Sentence doctor", builder: "Sentence builder",
  listen: "Listen & choose", dictation: "Type what you hear", recall: "Recall", open: "Free writing",
  say: "Say it", dialogue: "Conversation", reading: "Reading", notice: "Notice the pattern",
  mission: "Mission", context: "Context", cards: "Key cards", explain: "Notes"
};

function speakBtn(text, slow, cls = "") {
  return `<button class="audio-btn ${cls}" data-say="${escAttr(text)}" data-slow="${slow ? 1 : 0}" aria-label="Play">${icon("speaker")}</button>`;
}
function umlautBar(forId = "") {
  return `<div class="umlauts" data-for="${forId}">${["ä", "ö", "ü", "ß", "Ä", "Ö", "Ü"].map(u => `<button type="button" class="uml" data-u="${u}">${u}</button>`).join("")}</div>`;
}

const Engines = {
  /* ---------- recognition & grammar ---------- */
  mc(root, s, done) { choiceLike(root, s, done); },
  formal(root, s, done) {
    s.kicker = s.kicker || "What fits this situation?";
    s.text = s.situation;
    choiceLike(root, s, done);
  },
  notice(root, s, done) {
    s.kicker = "Notice the pattern first";
    choiceLike(root, s, done);
  },
  repair(root, s, done) {
    root.innerHTML = `
      <div class="q-kicker">Something is broken</div>
      <div class="repair-bad">${esc(s.wrong)}</div>
      <div class="q-sub">Pick the fixed version:</div>
      <div class="choices">${s.options.map(o => `<button class="choice" data-val="${escAttr(o)}">${esc(o)}</button>`).join("")}</div>
      <div class="feedback" id="fb"></div>`;
    wireChoices(root, s, done);
  },
  reading(root, s, done) {
    root.innerHTML = `
      <div class="q-kicker">${esc(s.kicker || "Read it")}</div>
      <div class="reading-text">${esc(s.text)}</div>
      ${s.question ? `<div class="q-sub">${esc(s.question)}</div>` : ""}
      <div class="choices">${s.options.map(o => `<button class="choice" data-val="${escAttr(o)}">${esc(o)}</button>`).join("")}</div>
      <div class="feedback" id="fb"></div>`;
    wireChoices(root, s, done);
  },

  /* ---------- listening ---------- */
  listen(root, s, done) {
    root.innerHTML = `
      <div class="q-kicker">${esc(s.kicker || "What did you hear?")}</div>
      <div class="audio-row">
        ${speakBtn(s.audio, false, "big")}
        ${speakBtn(s.audio, true)}
      </div>
      <div class="q-sub">Tap the big button to listen — answer from sound, not text.</div>
      <div class="choices">${s.options.map(o => `<button class="choice" data-val="${escAttr(o)}">${esc(o)}</button>`).join("")}</div>
      <div class="feedback" id="fb"></div>`;
    wireChoices(root, s, done);
    if (Store.get().settings.autoSpeak) setTimeout(() => Voice.speak(s.audio, { lang: "de" }), 250);
  },
  dictation(root, s, done) {
    root.innerHTML = `
      <div class="q-kicker">Type exactly what you hear</div>
      <div class="audio-row">
        ${speakBtn(s.audio, false, "big")}
        ${speakBtn(s.audio, true)}
      </div>
      <input class="type-input" id="typed" autocomplete="off" autocapitalize="off" placeholder="Was hörst du…?" />
      ${umlautBar("typed")}
      <button class="primary" id="checkBtn">Check</button>
      <div class="feedback" id="fb"></div>`;
    wireTyped(root, s, done, s.audio);
    if (Store.get().settings.autoSpeak) setTimeout(() => Voice.speak(s.audio, { lang: "de" }), 250);
  },

  /* ---------- production ---------- */
  builder(root, s, done) {
    const bank = shuffle(s.chunks.map((c, i) => ({ c, id: i })));
    const picked = []; // ids in order
    const isPunct = (t) => /^[?.!,]$/.test(t);
    root.innerHTML = `
      <div class="q-kicker">Sentence builder</div>
      ${s.hint ? `<div class="q-sub">${esc(s.hint)}</div>` : ""}
      <div class="build-slot" id="slot"></div>
      <div class="chip-bank" id="bank"></div>
      <button class="primary" id="checkBtn" disabled>Check</button>
      <div class="feedback" id="fb"></div>`;
    const slot = $("#slot", root), bankEl = $("#bank", root), checkBtn = $("#checkBtn", root);
    const draw = () => {
      bankEl.innerHTML = bank.map(b =>
        `<button class="chip" data-id="${b.id}" ${picked.includes(b.id) ? "disabled" : ""}>${esc(b.c)}</button>`).join("");
      const words = picked.map(id => bank.find(b => b.id === id).c);
      slot.innerHTML = words.length
        ? words.map((c, pos) => `<button class="chip placed" data-pos="${pos}">${esc(c)}</button>`).join(" ")
        : `<span class="build-hint">Tap the words in order…</span>`;
      checkBtn.disabled = picked.length !== s.chunks.length;
      $$(".chip", bankEl).forEach(btn => btn.onclick = () => { picked.push(Number(btn.dataset.id)); draw(); });
      $$(".chip.placed", slot).forEach(btn => btn.onclick = () => { picked.splice(Number(btn.dataset.pos), 1); draw(); });
    };
    draw();
    checkBtn.onclick = () => {
      const words = picked.map(id => bank.find(b => b.id === id).c);
      const attemptStr = words.join(" ").replace(/ ([?.!,])/g, "$1");
      const target = s.answer.replace(/ ([?.!,])/g, "$1");
      const ok = looseEq(attemptStr, target, (s.alts || []).concat([target.replace(/[?!.]$/, "")]));
      checkBtn.disabled = true;
      gradeVisual(root, ok, s, attemptStr, target);
      setTimeout(() => done(ok), 50);
    };
  },
  recall(root, s, done) {
    root.innerHTML = `
      <div class="q-kicker">${esc(s.kicker || "Recall — no options, from memory")}</div>
      <div class="q-text">${esc(s.prompt)}</div>
      <input class="type-input" id="typed" autocomplete="off" autocapitalize="off" placeholder="Auf Deutsch…" />
      ${umlautBar("typed")}
      <button class="primary" id="checkBtn">Check</button>
      <div class="feedback" id="fb"></div>`;
    wireTyped(root, s, done);
    setTimeout(() => { const el = $("#typed", root); if (el) el.focus(); }, 300);
  },
  open(root, s, done) {
    root.innerHTML = `
      <div class="q-kicker">Produce it freely</div>
      <div class="q-text">${esc(s.prompt)}</div>
      <textarea class="type-input" id="typed" rows="3" placeholder="Write your German here…"></textarea>
      ${umlautBar("typed")}
      <button class="primary" id="checkBtn">Compare with a model</button>
      <div id="modelbox" class="modelbox hidden"></div>
      <div class="grade-self hidden" id="selfGrade">
        <button class="choice" data-g="1">Close to the model — I've got it</button>
        <button class="choice" data-g="0">Not yet — schedule this again</button>
      </div>`;
    $("#checkBtn", root).onclick = () => {
      const val = ($("#typed", root).value || "").trim();
      const model = s.model;
      $("#modelbox", root).innerHTML = `<div class="model-row"><span>Your answer</span><b>${esc(val || "—")}</b></div>
        <div class="model-row ok"><span>Model</span><b>${esc(model)}</b></div>
        ${s.why ? `<div class="why-note">${esc(s.why)}</div>` : ""}`;
      $("#modelbox", root).classList.remove("hidden");
      $("#selfGrade", root).classList.remove("hidden");
      $("#checkBtn", root).classList.add("hidden");
      Voice.speak(model, { lang: "de" });
    };
    $("#selfGrade", root).onclick = (e) => {
      const b = e.target.closest("[data-g]");
      if (b) {
        const ok = b.dataset.g === "1";
        Store.grade(s.axis || "writing", ok, s.item || null, ok ? "" : (s.why || ""));
        done(ok);
      }
    };
  },
  say(root, s, done) {
    root.innerHTML = `
      <div class="q-kicker">Say it out loud</div>
      <div class="q-sub">${esc(s.prompt)}</div>
      <div class="say-target">${esc(s.target || s.model)}</div>
      <div class="audio-row">
        ${speakBtn(s.model, false, "big")}
        ${speakBtn(s.model, true)}
      </div>
      <div class="say-steps">1 · Listen — maybe twice. 2 · Say it aloud, out loud, really. 3 · Be honest:</div>
      <div class="grade-self">
        <button class="choice" data-g="1">${icon("check")} I said it clearly</button>
        <button class="choice" data-g="0">${icon("slow")} Needs one more round</button>
      </div>`;
    if (Store.get().settings.autoSpeak) setTimeout(() => Voice.speak(s.model, { lang: "de" }), 300);
    root.onclick = (e) => {
      const b = e.target.closest("[data-g]");
      if (b) {
        const ok = b.dataset.g === "1";
        Store.grade(s.axis || "speaking", ok, s.item || null, "");
        done(ok);
      }
    };
  },
  dialogue(root, s, done) {
    let turns = 0, correct = 0, finished = false;
    const log = document.createElement("div");
    log.className = "chat-log";
    root.innerHTML = `<div class="q-kicker">${esc(s.title || "Conversation")}</div>`;
    root.appendChild(log);
    const opts = document.createElement("div");
    opts.className = "choices";
    root.appendChild(opts);

    const playTurn = (i) => {
      if (i >= s.script.length) {
        const all = s.script.length;
        const pctOk = correct >= Math.ceil(all * 0.999) ? true : correct / all >= 0.7;
        Store.grade("speaking", pctOk, null, "");
        log.insertAdjacentHTML("beforeend", `<div class="chat-bubble sys">${esc(pctOk ? "Geschafft! That flowed." : "Done — we'll practice this again.")}</div>`);
        setTimeout(() => done(pctOk), 900);
        return;
      }
      const t = s.script[i];
      log.insertAdjacentHTML("beforeend", `
        <div class="chat-bubble npc"><div class="chat-who">${esc(t.who)}</div>
          <div class="chat-line">${esc(t.de)} ${speakBtn(t.de, false, "mini")}</div>
          <div class="chat-en">${esc(t.en)}</div></div>`);
      log.scrollTop = log.scrollHeight;
      Voice.speak(t.de, { lang: "de" });
      opts.innerHTML = t.options.map((o, j) => `<button class="choice" data-j="${j}">${esc(o.de)}<span class="choice-en">${esc(o.en)}</span></button>`).join("");
      $$(".choice", opts).forEach(btn => btn.onclick = () => {
        const o = t.options[Number(btn.dataset.j)];
        turns += 1;
        log.insertAdjacentHTML("beforeend", `<div class="chat-bubble me">${esc(o.de)}</div>`);
        log.scrollTop = log.scrollHeight;
        Voice.speak(o.de, { lang: "de" });
        if (o.ok) {
          correct += 1;
          playTurn(i + 1);
        } else {
          btn.disabled = true;
          btn.classList.add("wrong");
          log.insertAdjacentHTML("beforeend", `<div class="chat-bubble tip">💡 ${esc(o.tip || "Try the other option.")}</div>`);
          log.scrollTop = log.scrollHeight;
        }
      });
    };
    playTurn(0);
  },

  /* ---------- info steps (ungraded) ---------- */
  mission(root, s, done) {
    root.innerHTML = `
      <div class="mission-card">
        <div class="q-kicker">Your mission</div>
        <div class="mission-title">${esc(s.title)}</div>
        <p class="mission-line">After this stage, <b>${esc(s.mission.replace(/\.$/, "").toLowerCase())}</b>.</p>
        <button class="primary" id="goBtn">Let's go</button>
      </div>`;
    $("#goBtn", root).onclick = () => done(null);
  },
  context(root, s, done) {
    let showEn = false;
    const renderLines = () => {
      $("#ctxLines", root).innerHTML = s.dialogue.map(l => `
        <div class="ctx-line">
          <div class="ctx-who">${esc(l.who)}</div>
          <div class="ctx-de">${esc(l.de)} ${speakBtn(l.de, false, "mini")}</div>
          ${showEn ? `<div class="ctx-en">${esc(l.en)}</div>` : ""}
        </div>`).join("");
    };
    root.innerHTML = `
      <div class="q-kicker">Context first — no explanation yet</div>
      <div class="q-sub">Just listen &amp; watch. What do you catch?</div>
      <div id="ctxLines" class="ctx-lines"></div>
      <div class="row-btns">
        <button class="ghost" id="playAll">${icon("play")} Play all</button>
        <button class="ghost" id="togEn">${icon("eye")} Translation</button>
      </div>
      <button class="primary" id="goBtn">I got the gist</button>`;
    renderLines();
    $("#togEn", root).onclick = () => { showEn = !showEn; renderLines(); };
    $("#playAll", root).onclick = () => Voice.speakLines(s.dialogue.map(l => ({ de: l.de })), {});
    $("#goBtn", root).onclick = () => done(null);
  },
  cards(root, s, done) {
    let i = 0;
    const render = () => {
      const c = s.cards[i];
      $("#cardBox", root).innerHTML = `
        <div class="learn-card">
          <div class="learn-card-t">${esc(c.t)}</div>
          ${c.de ? `<div class="learn-card-de">${esc(c.de)} ${/[\u00C0-\u017F\u4e00-\u9fff]| [a-z]/i.test(c.de) ? speakBtn(c.de.split("·")[0].trim(), false, "mini") : ""}</div>` : ""}
          <div class="learn-card-en">${esc(c.en)}</div>
          ${c.note ? `<div class="learn-card-note">${esc(c.note)}</div>` : ""}
        </div>
        <div class="card-dots">${s.cards.map((_, j) => `<i class="dot ${j === i ? "on" : ""}"></i>`).join("")}</div>`;
      $("#prevCard", root).disabled = i === 0;
      $("#nextCard", root).textContent = i === s.cards.length - 1 ? "Got it — practice time" : "Next card";
    };
    root.innerHTML = `
      <div class="q-kicker"></div>
      <div id="cardBox"></div>
      <div class="row-btns spread">
        <button class="ghost" id="prevCard">${icon("back")} Back</button>
        <button class="primary slim" id="nextCard">Next card</button>
      </div>`;
    render();
    $("#prevCard", root).onclick = () => { if (i > 0) { i--; render(); } };
    $("#nextCard", root).onclick = () => { if (i < s.cards.length - 1) { i++; render(); } else done(null); };
    // swipe
    let x0 = null;
    root.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; }, { passive: true });
    root.addEventListener("touchend", e => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (dx < -46 && i < s.cards.length - 1) { i++; render(); }
      if (dx > 46 && i > 0) { i--; render(); }
      x0 = null;
    }, { passive: true });
  }
};

/* ---------- shared bits ---------- */
function choiceLike(root, s, done) {
  root.innerHTML = `
    <div class="q-kicker">${esc(s.kicker || "Pick one")}</div>
    <div class="q-text">${esc(s.text)}</div>
    <div class="choices">${s.options.map(o => `<button class="choice" data-val="${escAttr(o)}">${esc(o)}</button>`).join("")}</div>
    <div class="feedback" id="fb"></div>`;
  wireChoices(root, s, done);
}
function wireChoices(root, s, done) {
  root.addEventListener("click", function onTap(e) {
    const b = e.target.closest(".choice");
    if (!b || b.disabled) return;
    const ok = looseEq(b.dataset.val, s.answer, s.alts || []);
    $$(".choice", root).forEach(c => {
      c.disabled = true;
      if (looseEq(c.dataset.val, s.answer, s.alts || [])) c.classList.add("right");
    });
    if (!ok) b.classList.add("wrong");
    gradeVisual(root, ok, s, b.dataset.val, s.answer);
    root.removeEventListener("click", onTap, true);
    root.onclick = null;
    setTimeout(() => done(ok), 50);
  }, true);
}
function wireTyped(root, s, done, audioHint) {
  const input = $("#typed", root), btn = $("#checkBtn", root);
  const go = () => {
    const val = input.value;
    const target = s.answer;
    let ok = looseEq(val, target, s.alts || []);
    if (!ok && !s.strict && lev(val, target) <= 2) ok = "close";
    gradeVisual(root, ok, s, val, target);
    setTimeout(() => done(ok === "close" ? true : !!ok), 50);
  };
  btn.onclick = go;
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); go(); } });
}
/* visual + data grading, always with a reason */
function gradeVisual(root, ok, s, attempt, target) {
  const fb = $("#fb", root);
  const item = s.item || null;
  const axis = s.axis || StepAxis[s.engine] || "vocabulary";
  const good = ok === true || ok === "close";
  Store.grade(axis, good, item, good ? "" : (s.why || ""));
  if (!fb) return;
  fb.className = `feedback ${good ? "good" : "bad"}`;
  let html = "";
  if (ok === true) html = `<b>Genau.</b>`;
  else if (ok === "close") html = `<b>Almost — counted.</b>`;
  else html = `<b>Not quite.</b>`;
  if (!good || ok === "close") {
    html += `<div class="fb-grid">
      ${attempt ? `<div class="fb-row"><span>Yours</span><b>${esc(attempt)}</b></div>` : ""}
      <div class="fb-row"><span>Better</span><b>${esc(s.model || target || "")}</b></div>
      ${s.why ? `<div class="fb-row"><span>Why</span><b>${esc(s.why)}</b></div>` : ""}
    </div>`;
  } else if (s.why) {
    html += `<div class="fb-note">${esc(s.why)}</div>`;
  }
  fb.innerHTML = html;
  fb.classList.add("show");
  const cont = $("#continueBtn");
  if (cont) { cont.classList.remove("hidden"); cont.focus(); }
}

/* ---------- generic session runner ---------- */
function RunSession(cfg) {
  const { title, steps, onDone, onExit } = cfg;
  const main = $("#main");
  let idx = 0;
  const gradedIdx = [];
  steps.forEach((s, i) => { if (!["mission", "context", "cards"].includes(s.engine)) gradedIdx.push(i); });
  const results = [];

  const header = () => {
    const gradedNow = gradedIdx.indexOf(idx);
    const dots = gradedIdx.map((gi, j) => {
      const cls = j === gradedNow ? "on" : results[j] === true ? "ok" : results[j] === false ? "no" : "";
      return `<i class="dot ${cls}"></i>`;
    }).join("");
    return `
      <div class="run-top">
        <button class="ghost" id="exitRun">${icon("close")}</button>
        <div class="run-title">${esc(EngineNames[steps[idx].engine] || title)}</div>
        <div class="dots">${dots}</div>
      </div>`;
  };

  const renderStep = () => {
    const s = steps[idx];
    main.innerHTML = `${header()}<div class="run-body qcard" id="stepRoot"></div>
      <div class="run-foot"><button class="primary hidden" id="continueBtn">Continue ${icon("next")}</button></div>`;
    $("#exitRun").onclick = () => { Voice.stop(); (onExit || onDone)(null); };
    $("#continueBtn").onclick = () => next();
    const graded = gradedIdx.includes(idx);
    Engines[s.engine]($("#stepRoot"), s, (ok) => {
      if (graded) {
        results[gradedIdx.indexOf(idx)] = !!ok;
        const cont = $("#continueBtn");
        if (cont) cont.classList.remove("hidden"); // say/open/dialogue have no #fb
      } else next();
    });
  };

  const next = () => {
    if (idx < steps.length - 1) { idx += 1; renderStep(); }
    else finish();
  };
  const finish = () => {
    const valid = results.filter(r => r !== undefined);
    const ok = valid.filter(Boolean).length;
    const score = valid.length ? Math.round((ok / valid.length) * 100) : 100;
    const misses = [];
    steps.forEach((s, i) => {
      const g = gradedIdx.indexOf(i);
      if (g >= 0 && results[g] === false) misses.push(s);
    });
    onDone({ score, ok, total: valid.length, misses });
  };
  renderStep();
}

/* The six sections: Learn, Review, Practice, Stories, Explore, You */
const Views = {
  /* ============ LEARN ============ */
  learn() {
    const cur = Adaptive.current();
    const plan = Adaptive.todayPlan();
    const due = Store.dueCount();

    const planHtml = `
      <div class="today-card">
        <div class="today-head">
          <div class="today-title">${icon("calendar")} Today's plan</div>
          <div class="today-streak">${icon("flame")} ${Store.get().streak.days}d</div>
        </div>
        ${plan.map(p => `
          <button class="plan-row ${p.done ? "done" : ""}" data-act="planGo" data-kind="${p.kind}" ${p.id ? `data-id="${p.id}"` : ""}>
            <span class="plan-dot">${p.done ? icon("check") : ""}</span>
            <span class="plan-label">${esc(p.label)}</span>
            <span class="plan-go">${icon("next")}</span>
          </button>`).join("")}
        <div class="today-note">${esc(Adaptive.insight())}</div>
      </div>`;

    const levels = Curriculum.LEVELS.map(lv => {
      const unlocked = Adaptive.isLevelUnlocked(lv.code);
      const st = Adaptive.levelStats(lv.code);
      const open = App.openLevel === lv.code;
      const units = Curriculum.levelUnits(lv.code).map(u => {
        const us = Adaptive.unitStats(u);
        const uUnlocked = Adaptive.isUnitUnlocked(u);
        const isOpenUnit = App.openUnit === u.id;
        const stageRows = isOpenUnit ? u.stages.map((s, i) => {
          const rec = Store.stage(s.id);
          const sUn = Adaptive.isStageUnlocked(s);
          const m = (rec || {}).mastery || 0;
          return `
            <button class="stage-row ${sUn ? "" : "locked"} ${rec && rec.passed ? "passed" : ""}" data-act="stage" data-id="${s.id}" ${sUn ? "" : "disabled"}>
              <span class="stage-num">${sUn ? (rec && rec.passed ? icon("check") : (i + 1)) : icon("lock")}</span>
              <span class="stage-copy">
                <b>${esc(s.title)}</b>
                <i>${sUn ? esc(s.mission) : "Complete the stage above to open this"}</i>
              </span>
              <span class="stage-right">
                ${m > 0 ? `<span class="mastery">${"●".repeat(m)}${"○".repeat(3 - m)}</span>` : ""}
                ${rec && rec.best > 0 ? `<span class="stage-best">${rec.best}%</span>` : ""}
              </span>
            </button>`;
        }).join("") : "";
        return `
          <div class="unit ${uUnlocked ? "" : "locked"} ${isOpenUnit ? "open" : ""}">
            <button class="unit-head" data-act="unit" data-id="${u.id}">
              <div class="unit-copy">
                <div class="unit-title">${esc(u.title)}</div>
                <div class="unit-sub">${uUnlocked ? esc(u.sub) : "Finish the unit above at 80%+ — previews stay visible"}</div>
              </div>
              <div class="unit-right">
                ${uUnlocked
                  ? `<div class="unit-prog"><div class="unit-bar"><i style="width:${us.pct}%"></i></div><span>${us.passed}/${us.total}</span></div>`
                  : `<span class="unit-lock">${icon("lock")}</span>`}
              </div>
            </button>
            ${isOpenUnit ? `<div class="unit-body">
              ${u.uses ? `<div class="unit-uses">${icon("refresh")} Builds on: ${esc(u.uses)}</div>` : ""}
              <div class="unit-why">${esc(u.why)}</div>
              ${stageRows}
            </div>` : ""}
          </div>`;
      }).join("");

      return `
        <section class="level ${open ? "open" : ""} ${unlocked ? "" : "locked"}">
          <button class="level-head" data-act="level" data-level="${lv.code}">
            <span class="level-badge">${lv.code}</span>
            <span class="level-meta">
              <b class="level-title">${lv.name}</b>
              <i class="level-sub">${unlocked ? esc(lv.slogan) : "Reach 80% in the level below to unlock"}</i>
            </span>
            ${unlocked
              ? `<span class="level-pct">${st.pct}%</span><span class="level-chev ${open ? "up" : ""}">${icon("next")}</span>`
              : `<span class="unit-lock">${icon("lock")}</span>`}
          </button>
          ${open ? `<div class="level-body">${units}</div>` : ""}
        </section>`;
    }).join("");

    return `
      <div class="typebox" id="typebox" data-full="${escAttr(App.preview)}">${App.preview ? esc(App.preview) : ""}<span class="cursor"></span></div>
      ${planHtml}
      <div class="map-label">${esc(cur.name)} · ${cur.code} — the map below grows with you</div>
      ${levels}`;
  },

  bindLearn(root) {
    if (App.preview) App.setPreview(App.preview, true);
  },

  /* ============ REVIEW ============ */
  review: { queue: [], idx: 0, flipped: false, done: 0 },
  reviewView() {
    const R = this.review;
    if (!R.queue.length) {
      const due = Store.dueWords(14);
      const items = due.map(de => Curriculum.allItems().find(i => i.de === de)).filter(Boolean);
      if (!items.length) {
        return `
          <div class="empty-state">
            <div class="empty-ico">${icon("refresh")}</div>
            <h2>All caught up.</h2>
            <p>New words arrive here automatically after every stage — first tomorrow, then in 3 days, a week, two weeks, a month.</p>
            <div class="empty-stats">
              <div><b>${Store.knownCount()}</b><span>words strengthening</span></div>
              <div><b>${Store.get().today.reviews}</b><span>reviewed today</span></div>
            </div>
            <button class="ghost" data-act="goLearn">Back to the map</button>
          </div>`;
      }
      R.queue = items; R.idx = 0; R.flipped = false; R.done = 0;
    }
    if (R.idx >= R.queue.length) {
      const n = R.queue.length;
      R.queue = []; R.idx = 0;
      Store.bumpToday("reviews");
      return `
        <div class="empty-state">
          <div class="empty-ico good">${icon("check")}</div>
          <h2>Queue clear.</h2>
          <p>${n} words pushed further into long-term memory. They'll return when they start fading — not before.</p>
          <button class="ghost" data-act="goLearn">Continue learning</button>
        </div>`;
    }
    const it = R.queue[R.idx];
    return `
      <div class="review-top">
        <div class="run-title">Spaced review</div>
        <div class="dots">${R.queue.map((_, j) => `<i class="dot ${j === R.idx ? "on" : j < R.idx ? "ok" : ""}"></i>`).join("")}</div>
      </div>
      <div class="rev-card ${R.flipped ? "flipped" : ""}" data-act="flip">
        <div class="rev-kicker">Do you remember this?</div>
        <div class="rev-front">${esc(it.en)}</div>
        ${R.flipped ? `
          <div class="rev-back">
            <div class="rev-de">${esc(it.de)} ${speakBtn(it.de, false, "mini")}</div>
            ${it.gender ? `<div class="gender g-${it.gender}">${it.gender} form</div>` : ""}
            ${it.exampleDe ? `<div class="rev-ex">„${esc(it.exampleDe)}“<span>${esc(it.exampleEn)}</span></div>` : ""}
          </div>` : `
          <div class="rev-tap">${icon("eye")} Tap to reveal</div>`}
      </div>
      ${R.flipped ? `
        <div class="grade-grid">
          <button class="grade g1" data-act="gradeRev" data-q="1"><b>Again</b><span>10 min</span></button>
          <button class="grade g2" data-act="gradeRev" data-q="3"><b>Hard</b><span>1 day</span></button>
          <button class="grade g3" data-act="gradeRev" data-q="4"><b>Good</b><span>3 days</span></button>
          <button class="grade g4" data-act="gradeRev" data-q="5"><b>Easy</b><span>7+ days</span></button>
        </div>` : ""}`;
  },

  /* ============ PRACTICE ============ */
  practice() {
    const items = Adaptive.unlockedItems();
    const axes = ["vocabulary", "listening", "grammar", "speaking"];
    const axScore = ax => Store.axisScore(ax);
    const card = (id, ico, name, desc, heat) => `
      <button class="drill-card" data-act="drill" data-d="${id}">
        <div class="drill-ico">${icon(ico)}</div>
        <div class="drill-copy"><b>${name}</b><span>${desc}</span></div>
        ${heat !== null && heat !== undefined ? `<div class="drill-heat ${heat < 50 ? "hot" : ""}">${heat}%</div>` : ""}
      </button>`;
    const nouns = items.filter(i => i.gender).length;
    return `
      <div class="page-head"><h2>Practice</h2><p>Free drills from everything you've unlocked — ${items.length} items loaded. No gates here, just reps.</p></div>
      <div class="drill-grid">
        ${card("sprint", "bolt", "Word sprint", "8 mixed meaning questions, both directions", axScore("vocabulary"))}
        ${card("hearing", "ear", "Hearing it", "Listen & choose, then type what you hear", axScore("listening"))}
        ${card("articles", "book", "der · die · das", nouns >= 4 ? `${nouns} nouns waiting for article drills` : "Unlock more noun stages first", axScore("grammar"))}
        ${card("doctor", "pen", "Sentence doctor", "Fix broken sentences from real learner errors", axScore("grammar"))}
        ${card("sayit", "mic", "Say it", "Shadow key lines until they're smooth", axScore("speaking"))}
        ${card("mix", "shuffle", "Mix round", "Anything from anywhere — the full workout", null)}
      </div>
      <div class="today-note">Recent misses feed these drills automatically — ${Store.get().mistakes.length} stored.</div>`;
  },
  drill(kind) {
    const items = Adaptive.unlockedItems();
    const refuse = (title, msg) => {
      $("#main").innerHTML = `
        <div class="empty-state">
          <div class="empty-ico">${icon("lock")}</div>
          <h2>${title}</h2>
          <p>${msg}</p>
          <button class="ghost" data-act="goLearn">Keep learning to unlock it</button>
        </div>`;
    };
    if (!items.length) { refuse("Practice wakes up after your first stage.", "Drills feed on the words and sentences you've unlocked. Finish Unit 1 · Stage 1 first — it takes about two minutes."); return; }
    const nounPool = items.filter(i => i.gender);
    let qs = [];
    const others = (i, f) => shuffle(unique(items.filter(x => x[f] && x[f] !== i[f]).map(x => x[f]))).slice(0, 3);
    const mc = (i, dir) => ({ engine: "mc", kicker: dir === "de2en" ? "What does this mean?" : "How do you say this?", text: dir === "de2en" ? i.de : i.en, options: shuffle([dir === "de2en" ? i.en : i.de, ...others(i, dir === "de2en" ? "en" : "de")]), answer: dir === "de2en" ? i.en : i.de, item: i, why: i.gender ? `It's ${i.de}.` : "" });

    if (kind === "sprint") qs = shuffle(items).slice(0, 8).map((i, n) => mc(i, n % 2 ? "de2en" : "en2de"));
    else if (kind === "hearing") {
      const pool = shuffle(items.filter(i => (i.exampleDe || i.de) && (i.exampleDe || i.de).length <= 46)).slice(0, 6);
      qs = pool.slice(0, 3).map(i => replayer("listen", i)).concat(pool.slice(3, 6).map(i => ({
        engine: "dictation", audio: i.exampleDe || i.de, answer: i.exampleDe || i.de,
        alts: [(i.exampleDe || i.de).replace(/[.!?]$/, "")], item: i, why: ""
      })));
    } else if (kind === "articles") {
      if (nounPool.length < 4) { refuse("Article drill needs more nouns.", `You have ${nounPool.length} noun${nounPool.length === 1 ? "" : "s"} unlocked — this drill needs at least 4. Pass the next vocabulary stage (Unit 2 has plenty) and come back.`); return; }
      qs = shuffle(nounPool).slice(0, 8).map(i => ({
        engine: "mc", kicker: "Which article?", text: i.de.replace(/^(der|die|das)\s+/i, ""),
        options: ["der", "die", "das"], answer: i.gender, item: i,
        why: `Tag it in memory: ${i.de}.`
      }));
    } else if (kind === "doctor") {
      const repairs = [];
      for (const st of Curriculum.stages) {
        if (!Store.stage(st.id) || !(Store.stage(st.id).passed || Store.stage(st.id).attempts)) continue;
        for (const a of (st.ask || [])) if (a.engine === "repair") repairs.push(a);
      }
      repairs.push(...DEFAULT_REPAIRS);
      qs = shuffle(repairs).slice(0, 6).map(r => ({ ...r }));
      if (items.length) {
        const ib = shuffle(items.filter(i => i.exampleDe && i.exampleDe.split(/\s+/).length >= 3 && i.exampleDe.split(/\s+/).length <= 8)).slice(0, 2);
        for (const i of ib) qs.push({ engine: "builder", chunks: i.exampleDe.replace(/[!.]/g, "").split(/\s+/), answer: i.exampleDe.replace(/[!.]/g, ""), hint: i.exampleEn, item: i, why: "Check the verb position in the model." });
      }
    } else if (kind === "sayit") {
      const pool = shuffle(items.filter(i => (i.exampleDe || i.de).length >= 8)).slice(0, 4);
      qs = pool.map(i => ({ engine: "say", prompt: "Shadow this line until it's smooth:", target: i.exampleDe || i.de, model: i.exampleDe || i.de, item: i, why: "" }));
      if (!qs.length) qs = shuffle(items).slice(0, 4).map(i => ({ engine: "say", prompt: "Say this clearly:", target: i.de, model: i.de, item: i, why: "" }));
    } else {
      const pool = shuffle(items).slice(0, 8);
      qs = pool.map((i, n) => n % 3 === 2 ? replayer("listen", i) : mc(i, n % 2 ? "de2en" : "en2de"));
    }
    if (!qs.length) { refuse("That drill is still empty.", "It fills up automatically as you unlock stages — try the word sprint meanwhile."); return; }
    RunSession({
      title: "Drill",
      steps: qs,
      onExit: () => App.render(),
      onDone: (res) => {
        Store.bumpToday("drills");
        if (!res) { App.render(); return; }
        $("#main").innerHTML = `
          <div class="result">
            <div class="result-badge">${icon("bolt")}</div>
            <h2>${res.ok}/${res.total} clean.</h2>
            <p class="result-sub">${res.score >= 80 ? "Strong set. The bar for that skill just moved." : "Every miss is stored — Review and Practice will resurface it."}</p>
            <button class="primary" data-act="goPractice">More practice</button>
          </div>`;
        App.syncProgress();
      }
    });

    function replayer(engine, i) {
      const text = i.exampleDe && i.exampleDe.length <= 46 ? i.exampleDe : i.de;
      const answer = i.exampleDe && i.exampleDe.length <= 46 ? i.exampleEn : i.en;
      const distract = others(i, "en");
      return { engine, kicker: "What did you hear?", audio: text, options: shuffle([answer, ...distract]), answer, item: i, why: "" };
    }
  },

  /* ============ STORIES ============ */
  stories() {
    return `
      <div class="page-head"><h2>Stories</h2><p>Short graded German — always one step above your level. Listen first, read second, translate only if stuck.</p></div>
      ${STORIES.map(st => {
        const done = (Store.get().read || {})[st.id];
        const order = Curriculum.LEVELS.map(l => l.code);
        const locked = order.indexOf(st.level) > order.indexOf(Adaptive.current().code);
        if (locked) return `
          <div class="story-card locked" aria-disabled="true">
            <div class="story-tag">${st.level}</div>
            <div class="story-copy"><b>${esc(st.title)}</b><span>Unlocks when you reach ${st.level} — ${Adaptive.current().pct}% through ${Adaptive.current().code} now.</span></div>
            <div class="story-arrow">${icon("lock")}</div>
          </div>`;
        return `
          <button class="story-card" data-act="story" data-id="${st.id}">
            <div class="story-tag">${st.level}</div>
            <div class="story-copy"><b>${esc(st.title)}</b><span>${esc(st.gist)}</span></div>
            <div class="story-mins">${icon("book")} ${st.mins} min${done ? " · gelesen" : ""}</div>
          </button>`;
      }).join("")}`;
  },
  story: null,
  openStory(id) {
    this.story = STORIES.find(s => s.id === id);
    App.render();
  },
  storyView(st) {
    return `
      <div class="back-row"><button class="ghost" data-act="storyBack">${icon("back")} Stories</button></div>
      <div class="reader">
        <div class="story-tag big">${st.level}</div>
        <h2>${esc(st.title)}</h2>
        <p class="story-gist">${esc(st.gist)}</p>
        <div class="reader-controls">
          <button class="audio-btn big" data-act="playAll" data-id="${st.id}">${icon("play")}</button>
          <button class="pill-toggle" data-act="togSlow">Slow</button>
          <button class="pill-toggle" data-act="togEn">English</button>
        </div>
        <div class="reader-lines" id="readerLines">
          ${st.lines.map((l, i) => `
            <div class="ctx-line" data-line="${i}">
              <div class="ctx-who">${esc(l.who)}</div>
              <div class="ctx-de">${esc(l.de)} ${speakBtn(l.de, false, "mini")}</div>
              <div class="ctx-en hidden">${esc(l.en)}</div>
            </div>`).join("")}
        </div>
        <div class="gloss">
          <div class="gloss-label">Words from this story</div>
          ${st.words.map(w => {
            const hit = Curriculum.allItems().find(i => i.de === w || i.de.includes(w));
            return `<button class="pill" data-act="gloss" data-w="${escAttr(w)}">${esc(w)}${hit ? ` <em>${esc(hit.en)}</em>` : ""}</button>`;
          }).join("")}
          <button class="ghost" data-act="glossAdd" data-id="${st.id}">${icon("plus")} Add all to Review</button>
        </div>
        <div class="story-qs" id="storyQs">
          <div class="gloss-label">Did you follow?</div>
          ${st.qs.map((q, i) => `
            <div class="sq" data-i="${i}">
              <div class="sq-q">${esc(q.q)}</div>
              <div class="choices">${q.options.map(o => `<button class="choice" data-act="storyAns" data-q="${i}" data-val="${escAttr(o)}">${esc(o)}</button>`).join("")}</div>
              <div class="feedback"></div>
            </div>`).join("")}
        </div>
      </div>`;
  },

  /* ============ EXPLORE ============ */
  exploreView() {
    const E = App.exp;
    return `
      <div class="page-head slim"><p>Type a word or sentence in <b>either</b> box, then hit Go — the other side fills in. ${navigator.onLine ? "" : "You're offline: course words only."}</p></div>
      <div class="pane">
        <div class="pane-top">
          <span class="lang">English</span>
          <span class="pane-tools">
            <button class="ico" data-act="spkEn" ${E.en ? "" : "disabled"} aria-label="Listen">${icon("speaker")}</button>
            <button class="ico" data-act="clrEn" ${E.en ? "" : "disabled"} aria-label="Clear">${icon("close")}</button>
            <button class="ico go" data-act="goEn" aria-label="Translate">${icon("enter")}</button>
          </span>
        </div>
        <textarea id="enBox" rows="2" placeholder="Type English… press Go">${esc(E.en)}</textarea>
      </div>
      <div class="pane de">
        <div class="pane-top">
          <span class="lang">German</span>
          <span class="pane-tools">
            <button class="ico" data-act="spkDe" ${E.de ? "" : "disabled"} aria-label="Listen">${icon("speaker")}</button>
            <button class="ico" data-act="clrDe" ${E.de ? "" : "disabled"} aria-label="Clear">${icon("close")}</button>
            <button class="ico go" data-act="goDe" aria-label="Translate">${icon("enter")}</button>
          </span>
        </div>
        <textarea id="deBox" rows="2" placeholder="Oder Deutsch…">${esc(E.de)}</textarea>
      </div>
      <div class="exp-status" id="expStatus">${E.status ? esc(E.status) : ""}</div>
      <div class="sug-row ${E.sugs && E.sugs.length ? "show" : ""}" id="sugRow">${E.sugs && E.sugs.length ? `<span class="sug-label">Did you mean:</span>` + E.sugs.slice(0, 4).map(it => `<button class="sug-chip" data-act="sug" data-de="${escAttr(it.de)}">${esc(it.de)}<span>${esc(it.en)}</span></button>`).join("") : ""}</div>
      <div class="sentence-sheet ${E.showSentence && E.result && E.result.examples.length ? "show" : ""}" id="sheet">
        ${E.result ? `
          <div class="sheet-top">
            <h3>In a real sentence</h3>
            <button class="ico" data-act="nextEx" aria-label="Another example">${icon("shuffle")}</button>
          </div>
          <div class="sentence-de">${esc(E.result.examples[E.exIdx] ? E.result.examples[E.exIdx].de : "—")}</div>
          <div class="sentence-en">${esc(E.result.examples[E.exIdx] ? E.result.examples[E.exIdx].en : "")}</div>
          <div class="sheet-foot">
            <button class="ghost" data-act="spkEx">${icon("speaker")} Listen</button>
            <span class="sheet-via">${(() => { const x = E.result.examples[E.exIdx] || {}; const L = { course: "from your course", dict: "from the pocket dictionary", tatoeba: "real sentence · Tatoeba", ai: "written by AI — practice example", mm: "from real translated texts" }; return L[x.src] || (E.result.via === "course" ? "from your course" : E.result.via === "dict" ? "pocket dictionary" : "from the web"); })()}</span>
          </div>` : ""}
      </div>`;
  },

  /* ============ YOU / PROGRESS ============ */
  you() {
    const S = Store.get();
    const cur = Adaptive.current();
    const bars = [
      ["vocabulary", "Vocabulary"], ["grammar", "Grammar"], ["listening", "Listening"],
      ["speaking", "Speaking"], ["reading", "Reading"], ["writing", "Writing"]
    ];
    const weak = Store.weakestAxes(2);
    const mistakes = S.mistakes.slice(0, 3);
    const vstate = Voice.status();
    const vline = vstate === "native" ? "Device TTS (authentic, works offline)" : vstate === "google" ? "Google voice (online, authentic)" : "Browser voice";

    return `
      <div class="page-head slim"><div class="you-hero">
        <div class="you-level">${cur.code}</div>
        <div><b>${cur.name} · ${cur.pct}%</b><span>${Adaptive.nextStage() ? "Next: " + esc(Adaptive.nextStage().title) : "Checkpoint time"}</span></div>
        <div class="you-streak">${icon("flame")} ${S.streak.days} day${S.streak.days === 1 ? "" : "s"}</div>
      </div></div>

      ${(() => {
        const plan = Adaptive.todayPlan();
        const doneAll = plan.length && plan.every(x => x.done);
        const memEntries = Object.entries(S.memory || {});
        const boxes = [0, 0, 0, 0, 0, 0, 0];
        memEntries.forEach(([, m]) => { boxes[clamp(m.box || 0, 0, 6)] += 1; });
        const maxBox = Math.max(1, ...boxes);
        const dueN = Store.dueCount();
        const week = [...Array(7)].map((_, i) => {
          const d = new Date(Date.now() - (6 - i) * 86400000);
          const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
          return { on: (S.days || {})[key] > 0, label: "SMTWTFS"[d.getDay()], today: i === 6 };
        });
        return `
      <div class="set-group"><div class="set-label">Today's session</div>
        <div class="set-card">
          ${plan.map(x => `
            <div class="set-row today-row ${x.done ? "done" : ""}">
              <div class="set-ico" style="background:${x.done ? "#e8f8ee" : "var(--violet-soft)"};color:${x.done ? "#1c8a4d" : "var(--violet)"}">${icon(x.done ? "check" : x.kind === "review" ? "refresh" : x.kind === "story" ? "book" : "flag")}</div>
              <div class="set-copy"><b>${esc(x.label)}</b><span>${x.done ? "Done — nice" : "Still open"}</span></div>
              ${x.done ? "" : `<button class="set-trail asbtn" data-act="${x.kind === "review" ? "goReview" : x.kind === "story" ? "goStories" : "goLearn"}">Go</button>`}
            </div>`).join("")}
          ${doneAll ? `<div class="needs-work"><span>Full plan cleared — the streak grows tonight.</span></div>` : ""}
        </div>
      </div>

      <div class="set-group"><div class="set-label">Word memory</div>
        <div class="set-card">
          <div class="wk-stats">
            <div><b>${memEntries.length}</b><span>words in long-term training</span></div>
            <div><b>${Store.knownCount()}</b><span>recalled correctly</span></div>
            <div><b>${dueN}</b><span>due right now</span></div>
          </div>
          <div class="mini-hist" title="Memory strength by box">
            ${boxes.map((n, i) => `<div class="mh-col"><i style="height:${Math.round((n / maxBox) * 34) + (n ? 4 : 0)}px"></i><span>${["new", "10m", "1d", "3d", "7d", "14d", "30d"][i]}</span></div>`).join("")}
          </div>
          <div class="needs-work"><span>${dueN ? `${dueN} words are fading — clear them in Review.` : "Nothing fading. New words join this queue after every stage."}</span></div>
        </div>
      </div>

      <div class="set-group"><div class="set-label">This week</div>
        <div class="set-card week-card">
          ${week.map(d => `<div class="week-dot ${d.on ? "on" : ""} ${d.today ? "today" : ""}">${d.on ? icon("check") : ""}<span>${d.label}</span></div>`).join("")}
        </div>
      </div>`;
      })()}

      <div class="set-group"><div class="set-label">Skill profile</div>
        <div class="set-card">
          ${bars.map(([ax, name]) => `
            <div class="skill-row">
              <span class="skill-name">${name}</span>
              <div class="skill-track"><i style="width:${Store.axisScore(ax)}%"></i></div>
              <span class="skill-pct">${Store.axisScore(ax)}%</span>
            </div>`).join("")}
          <div class="needs-work">
            <span>Needs work: ${weak.filter(w => w.ok + w.no > 0).map(w => w.ax).join(", ") || "nothing yet — go learn!"}</span>
          </div>
        </div>
      </div>

      ${mistakes.length ? `<div class="set-group"><div class="set-label">Last misses</div>
        <div class="set-card">${mistakes.map(m => `
          <div class="set-row"><div class="set-copy"><b>${esc(m.de)}</b><span>${esc(m.why || "scheduled for review")}</span></div>${speakBtn(m.de, false, "mini")}</div>`).join("")}</div>
      </div>` : ""}

      <div class="set-group"><div class="set-label">Voice</div>
        <div class="set-card">
          <div class="set-row"><div class="set-ico" style="background:var(--violet-soft);color:var(--violet)">${icon("speaker")}</div>
            <div class="set-copy"><b>German voice</b><span>${vline}</span></div>
            <button class="set-trail asbtn" data-act="testVoice">Test</button></div>
          <div class="set-row"><div class="set-ico" style="background:#e7f3ff;color:#1d6fd6">${icon("slow")}</div>
            <div class="set-copy"><b>Speed</b><span>${S.settings.speechRate.toFixed(2)}×</span></div>
            <input class="range" type="range" min="0.7" max="1.15" step="0.05" value="${S.settings.speechRate}" data-act="rate" /></div>
          <div class="set-row"><div class="set-ico" style="background:#fff3e0;color:#c46b12">${icon("ear")}</div>
            <div class="set-copy"><b>Auto-play audio</b><span>Listen steps play themselves</span></div>
            <button class="toggle ${S.settings.autoSpeak ? "on" : ""}" data-act="tog" data-key="autoSpeak"><i></i></button></div>
        </div>
      </div>

      <div class="set-group"><div class="set-label">Learning</div>
        <div class="set-card">
          <div class="set-row"><div class="set-ico" style="background:var(--violet-soft);color:var(--violet)">${icon("flag")}</div>
            <div class="set-copy"><b>Unlock score</b><span>Pass mark for stages</span></div>
            <select class="selset" data-act="passScore">${[70, 80, 90].map(v => `<option value="${v}" ${S.settings.passScore === v ? "selected" : ""}>${v}%</option>`).join("")}</select></div>
          <div class="set-row"><div class="set-ico" style="background:#e8f8ee;color:#1c8a4d">${icon("translate")}</div>
            <div class="set-copy"><b>Online dictionary</b><span>Live translation + real example sentences</span></div>
            <button class="toggle ${S.settings.onlineDict ? "on" : ""}" data-act="tog" data-key="onlineDict"><i></i></button></div>
        </div>
      </div>

      <div class="set-group"><div class="set-label">Data</div>
        <div class="set-card">
          <button class="set-row" data-act="reset"><div class="set-ico" style="background:#fdecec;color:#d64545">${icon("close")}</div>
            <div class="set-copy"><b>Reset everything</b><span>Progress, memory, streak — fresh start</span></div>
            <span class="set-trail">Reset</span></button>
        </div>
      </div>
      <div class="today-note center">GermanMaster · every stage, every card, every review is on your device.</div>`;
  }
};

const DEFAULT_REPAIRS = [
  { engine: "repair", wrong: "Ich habe nach Berlin gefahren.", options: ["Ich bin nach Berlin gefahren.", "Ich habe nach Berlin gefahrt.", "Ich bin nach Berlin gefahrt."], answer: "Ich bin nach Berlin gefahren.", why: "fahren = movement → Perfekt with sein; participle gefahren." },
  { engine: "repair", wrong: "Ich bin kein müde.", options: ["Ich bin nicht müde.", "Ich habe kein müde.", "Ich nicht bin müde."], answer: "Ich bin nicht müde.", why: "Adjectives take nicht; nouns take kein." },
  { engine: "repair", wrong: "Heute ich lerne Deutsch.", options: ["Heute lerne ich Deutsch.", "Heute Deutsch lerne ich.", "Ich heute lerne Deutsch."], answer: "Heute lerne ich Deutsch.", why: "V2: the verb never leaves position 2." },
  { engine: "repair", wrong: "Ich kann schwimmt.", options: ["Ich kann schwimmen.", "Ich schwimmen kann.", "Ich kannt schwimmen."], answer: "Ich kann schwimmen.", why: "After können the main verb is the bare infinitive at the end." },
  { engine: "repair", wrong: "Ich sehe der Mann.", options: ["Ich sehe den Mann.", "Ich sehe dem Mann.", "Ich sehe die Mann."], answer: "Ich sehe den Mann.", why: "Masculine object → der becomes den." }
];

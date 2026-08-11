const $ = (sel, el = document) => el.querySelector(sel);

const App = {
  tab: "learn",
  openLevel: "A1",
  openSkill: null,
  preview: "",
  typeTimer: null,
  view: "map",
  lesson: null,
  quiz: null,
  qIndex: 0,
  answers: [],
  explore: { en: "", de: "", result: null, showSentence: false },

  init() {
    document.getElementById("dock").addEventListener("click", (e) => {
      const btn = e.target.closest(".dock-btn");
      if (!btn) return;
      this.tab = btn.dataset.tab;
      this.view = "map";
      this.lesson = null;
      this.quiz = null;
      this.setPreview("");
      this.syncDock();
      this.render();
    });
    document.getElementById("quoteBtn").addEventListener("click", () => {
      this.explore.showSentence = !this.explore.showSentence;
      if (this.tab === "explore") this.render();
    });
    this.syncProgress();
    this.render();
  },

  syncDock() {
    document.querySelectorAll(".dock-btn").forEach(b => {
      b.classList.toggle("active", b.dataset.tab === this.tab);
    });
  },

  syncProgress() {
    const cur = Adaptive.currentLevel();
    $("#progressLevel").textContent = cur.code;
    $("#progressFill").style.width = `${cur.pct}%`;
    $("#progressPct").textContent = `${cur.pct}%`;
  },

  setPreview(text) {
    clearInterval(this.typeTimer);
    const box = $("#typebox");
    if (!box) {
      this.preview = text;
      return;
    }
    const current = box.dataset.full || "";
    if (!text) {
      this.erase(box, current);
      return;
    }
    if (current && current !== text) {
      this.erase(box, current, () => this.type(box, text));
    } else if (!current) {
      this.type(box, text);
    }
  },

  type(box, text) {
    let i = 0;
    box.dataset.full = text;
    box.classList.remove("empty");
    this.typeTimer = setInterval(() => {
      i += 1;
      box.innerHTML = `${esc(text.slice(0, i))}<span class="cursor"></span>`;
      if (i >= text.length) clearInterval(this.typeTimer);
    }, 18);
  },

  erase(box, text, done) {
    let i = text.length;
    this.typeTimer = setInterval(() => {
      i -= 2;
      if (i <= 0) {
        clearInterval(this.typeTimer);
        box.dataset.full = "";
        box.innerHTML = `<span class="cursor"></span>`;
        if (done) done();
        return;
      }
      box.innerHTML = `${esc(text.slice(0, i))}<span class="cursor"></span>`;
    }, 12);
  },

  render() {
    this.syncProgress();
    const main = $("#main");
    if (this.tab === "learn") {
      if (this.view === "teach") main.innerHTML = this.teachView();
      else if (this.view === "quiz") main.innerHTML = this.quizView();
      else if (this.view === "result") main.innerHTML = this.resultView();
      else main.innerHTML = this.mapView();
    } else if (this.tab === "explore") {
      main.innerHTML = this.exploreView();
      this.bindExplore();
    } else {
      main.innerHTML = this.youView();
    }
    this.bind();
  },

  mapView() {
    const due = Store.dueWords();
    const review = due.length >= 3 ? `
      <button class="review-card" data-act="review">
        <div>
          <strong>Quick review</strong>
          <span>${due.length} words are due — fused from what you missed.</span>
        </div>
      </button>` : "";

    const levels = Curriculum.levels.map(lv => {
      const unlocked = Adaptive.isLevelUnlocked(lv.code);
      const prog = Adaptive.levelProgress(lv.code);
      const open = this.openLevel === lv.code && unlocked;
      const skills = Curriculum.skills.map(sk => {
        const list = Curriculum.lessons.filter(l => l.level === lv.code && l.skill === sk.id);
        if (!list.length) return "";
        const done = list.filter(l => Store.get().completed[l.id]?.passed).length;
        const firstLocked = list.every(l => !Adaptive.isLessonUnlocked(l));
        const active = this.openSkill === `${lv.code}:${sk.id}`;
        return `
          <button class="skill-tile ${active ? "active" : ""} ${firstLocked ? "locked" : ""}"
            data-act="skill" data-level="${lv.code}" data-skill="${sk.id}">
            <div class="skill-ico" style="background:${sk.color};color:${sk.ink}">${skillIcon(sk.id)}</div>
            <div class="skill-name">${sk.name}</div>
            <div class="skill-count">${done}/${list.length}</div>
          </button>`;
      }).join("");

      let lessonHtml = "";
      if (this.openSkill && this.openSkill.startsWith(lv.code + ":")) {
        const skill = this.openSkill.split(":")[1];
        const list = Curriculum.lessons.filter(l => l.level === lv.code && l.skill === skill);
        lessonHtml = `<div class="lesson-list">${list.map((l, i) => {
          const rec = Store.get().completed[l.id];
          const un = Adaptive.isLessonUnlocked(l);
          const cls = !un ? "locked" : rec?.passed ? "done" : "";
          return `
            <button class="lesson-row ${cls}" data-act="lesson" data-id="${l.id}" ${un ? "" : "disabled"}>
              <div class="lesson-dot">${!un ? "🔒" : rec?.passed ? "✓" : i + 1}</div>
              <div class="lesson-copy">
                <div class="lesson-title">${esc(l.title)}</div>
                <div class="lesson-hint">${un ? esc(l.blurb) : "Finish the previous tile at 80%+"}</div>
              </div>
              ${rec?.passed ? `<div class="lesson-score">${rec.best}%</div>` : ""}
            </button>`;
        }).join("")}</div>`;
      }

      return `
        <section class="level ${open ? "open" : ""} ${unlocked ? "" : "locked"}">
          <button class="level-head" data-act="level" data-level="${lv.code}">
            <div class="level-badge">${lv.code}</div>
            <div class="level-meta">
              <div class="level-title">${lv.name}</div>
              <div class="level-sub">${unlocked ? `${prog.done}/${prog.total} · ${prog.pct}%` : "Unlock by finishing the level above at 80%"}</div>
            </div>
            ${unlocked ? `<svg class="level-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>` : `<span style="color:var(--lock)">🔒</span>`}
          </button>
          <div class="level-body">
            <div class="skill-grid">${skills}</div>
            ${lessonHtml}
          </div>
        </section>`;
    }).join("");

    return `
      <div class="typebox" id="typebox" data-full="${escAttr(this.preview)}">${this.preview ? esc(this.preview) : ""}<span class="cursor"></span></div>
      ${review}
      ${levels}`;
  },

  teachView() {
    const l = this.lesson;
    const pills = l.items.map(it => `
      <button class="pill" data-act="speak" data-text="${escAttr(it.de)}">
        ${it.gender ? `<span class="gender g-${it.gender}">${it.gender}</span>` : ""}
        <b>${esc(it.de)}</b>
        <em>${esc(it.en)}</em>
      </button>`).join("");
    return `
      <div class="back-row">
        <button class="ghost" data-act="back">${chev()} Back</button>
      </div>
      <article class="teach">
        <h2>${esc(l.title)}</h2>
        <p>${esc(l.teach || l.blurb)}</p>
        <div class="word-pills">${pills}</div>
        <button class="primary" data-act="start">Start quiz</button>
      </article>`;
  },

  quizView() {
    const q = this.quiz[this.qIndex];
    const dots = this.quiz.map((_, i) => {
      const a = this.answers[i];
      const cls = i === this.qIndex ? "on" : a === true ? "ok" : a === false ? "no" : "";
      return `<i class="dot ${cls}"></i>`;
    }).join("");

    let body = "";
    if (q.type === "mc") {
      body = `<div class="choices">${q.choices.map(c =>
        `<button class="choice" data-act="choose" data-val="${escAttr(c)}">${esc(c)}</button>`
      ).join("")}</div>`;
    } else if (q.type === "gender") {
      body = `<div class="choices">
        ${["der", "die", "das"].map(g => `<button class="choice" data-act="choose" data-val="${g}">${g}</button>`).join("")}
      </div>`;
    } else if (q.type === "listen") {
      body = `
        <button class="speak-btn" data-act="speak" data-text="${escAttr(q.prompt)}">${speaker()}</button>
        <div class="choices">${q.choices.map(c =>
          `<button class="choice" data-act="choose" data-val="${escAttr(c)}">${esc(c)}</button>`
        ).join("")}</div>`;
    } else if (q.type === "type") {
      body = `
        <input class="type-input" id="typed" autocomplete="off" autocapitalize="off" placeholder="Type the German…" />
        <button class="primary" data-act="submitType">Check</button>`;
    } else if (q.type === "blank") {
      body = `
        <input class="blank-input" id="typed" autocomplete="off" autocapitalize="off" placeholder="Missing word…" />
        <button class="primary" data-act="submitType">Check</button>`;
    }

    return `
      <div class="quiz-top">
        <button class="ghost" data-act="back">${chev()} Exit</button>
        <div class="dots">${dots}</div>
      </div>
      <article class="qcard">
        <div class="q-kicker">${q.kicker}</div>
        <div class="q-text">${esc(q.text)}</div>
        ${body}
        <div class="feedback" id="fb"></div>
      </article>`;
  },

  resultView() {
    const total = this.quiz.length;
    const ok = this.answers.filter(Boolean).length;
    const score = Math.round((ok / total) * 100);
    const pass = score >= Store.get().settings.passScore;
    const circ = 2 * Math.PI * 54;
    const dash = (score / 100) * circ;
    return `
      <div class="result">
        <h2>${pass ? "Unlocked." : "Almost."}</h2>
        <p>${pass ? "That tile is done. The next one is open." : `You need ${Store.get().settings.passScore}% to move on. Same quiz, fresh order.`}</p>
        <div class="score-ring">
          <svg width="128" height="128" viewBox="0 0 128 128">
            <circle cx="64" cy="64" r="54" fill="none" stroke="#ece6f4" stroke-width="10"/>
            <circle cx="64" cy="64" r="54" fill="none" stroke="${pass ? "#1f9d63" : "#e85a8c"}" stroke-width="10"
              stroke-linecap="round" stroke-dasharray="${dash} ${circ}"/>
          </svg>
          <div class="score-num">${score}%</div>
        </div>
        <button class="primary" data-act="${pass ? "back" : "retry"}">${pass ? "Back to map" : "Try again"}</button>
      </div>`;
  },

  exploreView() {
    const r = this.explore.result;
    return `
      <div style="height:10px"></div>
      <div class="pane">
        <div class="pane-top">
          <span class="lang">English</span>
          <button class="ico" data-act="speakEn" ${this.explore.en ? "" : "disabled"}>${speaker()}</button>
        </div>
        <textarea id="enBox" rows="3" placeholder="Type English…">${esc(this.explore.en)}</textarea>
      </div>
      <div class="swap-row">
        <button class="swap" data-act="swap" aria-label="Swap">${swapIco()}</button>
      </div>
      <div class="pane de">
        <div class="pane-top">
          <span class="lang">German</span>
          <button class="ico" data-act="speakDe" ${this.explore.de ? "" : "disabled"}>${speaker()}</button>
        </div>
        <textarea id="deBox" rows="3" placeholder="Oder Deutsch…">${esc(this.explore.de)}</textarea>
      </div>
      <div class="sentence-sheet ${this.explore.showSentence && r ? "show" : ""}" id="sheet">
        <h3>In a sentence</h3>
        <div class="sentence-de">${r ? esc(r.exampleDe) : ""}</div>
        <div class="sentence-en">${r ? esc(r.exampleEn) : ""}</div>
        <button class="ghost" style="margin-top:10px" data-act="speakDeEx">${speaker()} Play</button>
      </div>
    `;
  },

  youView() {
    const s = Store.get().settings;
    const cur = Adaptive.currentLevel();
    const due = Store.dueWords().length;
    return `
      <div style="height:8px"></div>
      <p class="insight">${esc(Adaptive.insight())}</p>

      <div class="set-group">
        <div class="set-label">Learning</div>
        <div class="set-card">
          <div class="set-row">
            <div class="set-ico" style="background:#efe7ff;color:#5b3cc4">${skillIcon("vocabulary")}</div>
            <div class="set-copy"><b>Current level</b><span>${cur.code} · ${cur.pct}% complete</span></div>
            <div class="set-trail">${cur.done}/${cur.total}</div>
          </div>
          <div class="set-row">
            <div class="set-ico" style="background:#e8f8ee;color:#1c8a4d">${skillIcon("grammar")}</div>
            <div class="set-copy"><b>Pass mark</b><span>Next tile unlocks at this score</span></div>
            <div class="set-trail">${s.passScore}%</div>
          </div>
          <div class="set-row">
            <div class="set-ico" style="background:#fff3e0;color:#c46b12">${skillIcon("listening")}</div>
            <div class="set-copy"><b>Words to review</b><span>Spaced into Learn, not a separate tab</span></div>
            <div class="set-trail">${due}</div>
          </div>
        </div>
      </div>

      <div class="set-group">
        <div class="set-label">Voice</div>
        <div class="set-card">
          <div class="set-row">
            <div class="set-ico" style="background:#e7f3ff;color:#1d6fd6">${speaker()}</div>
            <div class="set-copy"><b>Speech speed</b><span>${s.speechRate.toFixed(2)}×</span></div>
            <input class="range" type="range" min="0.7" max="1.1" step="0.02" value="${s.speechRate}" data-act="rate" />
          </div>
          <div class="set-row">
            <div class="set-ico" style="background:#efe7ff;color:#5b3cc4">${skillIcon("speaking")}</div>
            <div class="set-copy"><b>Auto-speak prompts</b><span>Play German when a listen card opens</span></div>
            <button class="toggle ${s.autoSpeak ? "on" : ""}" data-act="tog" data-key="autoSpeak"><i></i></button>
          </div>
        </div>
      </div>

      <div class="set-group">
        <div class="set-label">Dictionary</div>
        <div class="set-card">
          <div class="set-row">
            <div class="set-ico" style="background:#ffe8f1;color:#c4336a">${skillIcon("reading")}</div>
            <div class="set-copy"><b>Live translation</b><span>Explore uses the web when a word isn’t in the course</span></div>
            <button class="toggle ${s.onlineDict ? "on" : ""}" data-act="tog" data-key="onlineDict"><i></i></button>
          </div>
        </div>
      </div>

      <div class="set-group">
        <div class="set-label">Data</div>
        <div class="set-card">
          <button class="set-row" data-act="reset">
            <div class="set-ico" style="background:#fdecec;color:#d64545">${skillIcon("writing")}</div>
            <div class="set-copy"><b>Reset progress</b><span>Lessons lock again. Words forget you.</span></div>
            <div class="set-trail">Reset</div>
          </button>
        </div>
      </div>
    `;
  },

  bind() {
    $("#main").onclick = (e) => {
      const t = e.target.closest("[data-act]");
      if (!t) return;
      const act = t.dataset.act;
      if (act === "level") {
        const code = t.dataset.level;
        if (!Adaptive.isLevelUnlocked(code)) {
          this.preview = "";
          this.render();
          this.setPreview(`Finish the level before ${code} at 80% to open it.`);
          return;
        }
        this.openLevel = this.openLevel === code ? null : code;
        this.openSkill = null;
        const lv = Curriculum.levels.find(l => l.code === code);
        const text = this.openLevel && lv ? lv.hint : "";
        this.preview = "";
        this.render();
        this.setPreview(text);
      } else if (act === "skill") {
        const key = `${t.dataset.level}:${t.dataset.skill}`;
        this.openLevel = t.dataset.level;
        this.openSkill = this.openSkill === key ? null : key;
        const text = this.openSkill ? Curriculum.blurbs[t.dataset.skill] : "";
        this.preview = "";
        this.render();
        this.setPreview(text);
      } else if (act === "lesson") {
        const lesson = Curriculum.lessons.find(l => l.id === t.dataset.id);
        if (!lesson || !Adaptive.isLessonUnlocked(lesson)) return;
        this.lesson = lesson;
        this.view = "teach";
        this.setPreview(lesson.blurb);
        this.render();
      } else if (act === "back") {
        this.view = "map";
        this.quiz = null;
        this.setPreview("");
        this.render();
      } else if (act === "start" || act === "retry") {
        this.startQuiz(this.lesson);
      } else if (act === "speak") {
        TTS.speak(t.dataset.text, "de-DE");
      } else if (act === "choose") {
        this.grade(t.dataset.val, t);
      } else if (act === "submitType") {
        const val = $("#typed")?.value || "";
        this.grade(val);
      } else if (act === "review") {
        this.startReview();
      } else if (act === "tog") {
        Store.setSetting(t.dataset.key, !Store.get().settings[t.dataset.key]);
        this.render();
      } else if (act === "reset") {
        if (confirm("Reset all progress?")) {
          Store.reset();
          this.openLevel = "A1";
          this.openSkill = null;
          this.render();
        }
      } else if (act === "swap") {
        const { en, de } = this.explore;
        this.explore.en = de;
        this.explore.de = en;
        this.render();
      } else if (act === "speakEn") {
        TTS.speak(this.explore.en, "en-US");
      } else if (act === "speakDe") {
        TTS.speak(this.explore.de, "de-DE");
      } else if (act === "speakDeEx") {
        if (this.explore.result) TTS.speak(this.explore.result.exampleDe, "de-DE");
      } else if (act === "toggleSentence") {
        this.explore.showSentence = !this.explore.showSentence;
        this.render();
      }
    };

    $("#main").oninput = (e) => {
      if (e.target.dataset.act === "rate") {
        Store.setSetting("speechRate", Number(e.target.value));
        e.target.previousElementSibling.querySelector("span").textContent = `${Number(e.target.value).toFixed(2)}×`;
      }
    };
  },

  bindExplore() {
    const en = $("#enBox");
    const de = $("#deBox");
    let timer;
    const run = async (source) => {
      clearTimeout(timer);
      timer = setTimeout(async () => {
        const text = source === "en" ? en.value : de.value;
        this.explore.en = en.value;
        this.explore.de = de.value;
        if (!text.trim()) {
          this.explore.result = null;
          this.explore.showSentence = false;
          this.updateExploreChrome();
          return;
        }
        const r = await Translate.lookup(text);
        if (!r) return;
        this.explore.result = r;
        if (source === "en") {
          this.explore.de = r.de;
          de.value = r.de;
        } else {
          this.explore.en = r.en;
          en.value = r.en;
        }
        this.updateExploreChrome();
      }, 380);
    };
    en.addEventListener("input", () => run("en"));
    de.addEventListener("input", () => run("de"));
  },

  updateExploreChrome() {
    const r = this.explore.result;
    const btn = $("#quoteBtn");
    const sheet = $("#sheet");
    if (btn) btn.classList.toggle("show", !!r);
    if (sheet && r) {
      sheet.querySelector(".sentence-de").textContent = r.exampleDe;
      sheet.querySelector(".sentence-en").textContent = r.exampleEn;
      if (this.explore.showSentence) sheet.classList.add("show");
    }
  },

  startQuiz(lesson) {
    const items = Adaptive.injectWeakItems(lesson.items, lesson.skill);
    this.quiz = buildQuiz(lesson, items);
    this.qIndex = 0;
    this.answers = [];
    this.view = "quiz";
    this.render();
    const q = this.quiz[0];
    if (q.type === "listen" && Store.get().settings.autoSpeak) TTS.speak(q.prompt);
  },

  startReview() {
    const due = Store.dueWords(10);
    const items = due.map(de => Curriculum.allItems().find(i => i.de === de)).filter(Boolean);
    if (!items.length) return;
    this.lesson = {
      id: "review",
      level: Adaptive.currentLevel().code,
      skill: "vocabulary",
      title: "Review",
      blurb: "Words that need another pass.",
      teach: "These came back because you missed them or they're due.",
      items
    };
    this.startQuiz(this.lesson);
  },

  grade(val, btn) {
    const q = this.quiz[this.qIndex];
    const ok = normalize(val) === normalize(q.answer) ||
      (Array.isArray(q.alts) && q.alts.some(a => normalize(a) === normalize(val)));
    this.answers[this.qIndex] = ok;
    Store.markSkill(this.lesson.skill, ok);
    if (q.item) Store.rememberWord(q.item.de, ok ? 4 : 1);

    const fb = $("#fb");
    if (fb) {
      fb.className = `feedback ${ok ? "good" : "bad"}`;
      fb.textContent = ok ? "Yes." : `It's ${q.answer}`;
    }
    if (btn) {
      document.querySelectorAll(".choice").forEach(c => {
        c.disabled = true;
        if (normalize(c.dataset.val) === normalize(q.answer)) c.classList.add("right");
      });
      if (!ok) btn.classList.add("wrong");
    }
    if (q.item && Store.get().settings.autoSpeak) TTS.speak(q.item.de);

    setTimeout(() => {
      if (this.qIndex + 1 < this.quiz.length) {
        this.qIndex += 1;
        this.render();
        const nq = this.quiz[this.qIndex];
        if (nq.type === "listen" && Store.get().settings.autoSpeak) TTS.speak(nq.prompt);
      } else {
        const okN = this.answers.filter(Boolean).length;
        const score = Math.round((okN / this.quiz.length) * 100);
        if (this.lesson.id !== "review") Store.completeLesson(this.lesson.id, score);
        this.view = "result";
        this.render();
      }
    }, 700);
  }
};

function buildQuiz(lesson, items) {
  const pool = [...items];
  const qs = [];
  const take = () => pool.length ? pool.splice(Math.floor(Math.random() * pool.length), 1)[0] : items[0];

  const addMc = (item, dir) => {
    const answer = dir === "de2en" ? item.en : item.de;
    const field = dir === "de2en" ? "en" : "de";
    const distract = shuffle(Curriculum.allItems().filter(i => i[field] !== answer).map(i => i[field]));
    const choices = shuffle([answer, ...unique(distract).slice(0, 3)]);
    qs.push({
      type: "mc",
      kicker: dir === "de2en" ? "What does this mean?" : "How do you say this?",
      text: dir === "de2en" ? item.de : item.en,
      choices,
      answer,
      item
    });
  };

  if (lesson.skill === "listening" || lesson.skill === "speaking") {
    for (let i = 0; i < Math.min(6, items.length); i++) {
      const item = items[i];
      const distract = shuffle(items.filter(x => x.en !== item.en).map(x => x.en)).slice(0, 3);
      qs.push({
        type: "listen",
        kicker: "What did you hear?",
        text: " ",
        prompt: item.exampleDe || item.de,
        choices: shuffle([item.en, ...distract]),
        answer: item.en,
        item
      });
    }
  } else if (lesson.skill === "writing") {
    items.slice(0, 5).forEach(item => {
      qs.push({
        type: "type",
        kicker: "Type this in German",
        text: item.en,
        answer: item.de,
        alts: [item.de.replace(/[.…]/g, "").trim()],
        item
      });
    });
  } else {
    const nouns = items.filter(i => i.gender);
    if (nouns.length) {
      const n = takeNoun(nouns);
      if (n) qs.push({
        type: "gender",
        kicker: "Which article?",
        text: n.de.replace(/^(der|die|das)\s+/i, ""),
        answer: n.gender,
        item: n
      });
    }
    addMc(take(), "de2en");
    addMc(take(), "en2de");
    const typed = take();
    qs.push({
      type: "type",
      kicker: "Type the German",
      text: typed.en,
      answer: typed.de,
      item: typed
    });
    const blank = items.find(i => (i.exampleDe || "").includes(" ")) || take();
    const word = blank.de.replace(/^(der|die|das)\s+/i, "").split(" ")[0];
    const sentence = (blank.exampleDe || blank.de).replace(new RegExp(word, "i"), "______");
    qs.push({
      type: "blank",
      kicker: "Fill the blank",
      text: sentence,
      answer: word,
      item: blank
    });
    addMc(take(), "de2en");
    if (lesson.skill === "grammar" && nouns[1]) {
      qs.push({
        type: "gender",
        kicker: "Which article?",
        text: nouns[1].de.replace(/^(der|die|das)\s+/i, ""),
        answer: nouns[1].gender,
        item: nouns[1]
      });
    }
  }
  return qs.slice(0, 8);
}

function takeNoun(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function unique(arr) { return [...new Set(arr)]; }
function normalize(s) {
  return String(s || "").trim().toLowerCase()
    .replace(/[.…?!„“"']/g, "")
    .replace(/\s+/g, " ");
}
function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function escAttr(s) { return esc(s).replace(/`/g, ""); }

function skillIcon(id) {
  const icons = {
    vocabulary: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 6h9M4 12h7M4 18h11"/><path d="M16 7l4 5-4 5"/></svg>`,
    grammar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 5h8a3 3 0 0 1 0 6H5z"/><path d="M5 11h10a3 3 0 0 1 0 6H5z"/></svg>`,
    listening: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 10v4M8 7v10M12 4v16M16 7v10M20 10v4"/></svg>`,
    speaking: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="8" y="3" width="8" height="12" rx="4"/><path d="M6 11a6 6 0 0 0 12 0M12 17v4M8 21h8"/></svg>`,
    reading: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 6a4 4 0 0 1 4-2h12v16H8a4 4 0 0 0-4 4z"/><path d="M8 4v16"/></svg>`,
    writing: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 20h4l10-10-4-4L4 16z"/><path d="M13 7l4 4"/></svg>`
  };
  return icons[id] || icons.vocabulary;
}
function speaker() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 10v4h4l5 4V6L8 10H4z"/><path d="M16 9a4 4 0 0 1 0 6"/></svg>`;
}
function chev() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 6l-6 6 6 6"/></svg>`;
}
function swapIco() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 7h11l-3-3M17 17H6l3 3"/></svg>`;
}
function quoteIco() {
  return `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 17h4l2-5V7H5v5h4zm8 0h4l2-5V7h-8v5h4z"/></svg>`;
}

document.addEventListener("DOMContentLoaded", () => App.init());

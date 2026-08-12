/* Shell: tabs, header progress, typewriter, explore controller, global actions */
const App = {
  tab: "learn",
  openLevel: "A1",
  openUnit: null,
  preview: "",
  typeTimer: null,
  exp: { en: "", de: "", result: null, exIdx: 0, showSentence: false, status: "", sugs: [], alts: [] },
  reqToken: 0,

  init() {
    if (this._inited) return;
    this._inited = true;
    $("#dock").addEventListener("click", (e) => {
      const btn = e.target.closest(".dock-btn");
      if (!btn) return;
      if (btn.dataset.tab === this.tab) {
        // tap again = go home within the section (exit stage/drill/reader)
        if (this.tab === "stories") Views.story = null;
        Voice.stop();
        this.render();
        return;
      }
      Voice.stop();
      if (this.tab === "stories") Views.story = null;
      this.tab = btn.dataset.tab;
      this.preview = "";
      Views.review.queue = [];
      this.syncDock();
      this.render();
    });
    $("#quoteBtn").addEventListener("click", () => {
      this.exp.showSentence = !this.exp.showSentence;
      const sheet = $("#sheet");
      if (sheet) sheet.classList.toggle("show", this.exp.showSentence);
    });
    this.bindGlobal();
    this.render();
  },

  syncDock() {
    $$(".dock-btn").forEach(b => b.classList.toggle("active", b.dataset.tab === this.tab));
  },

  syncProgress() {
    const cur = Adaptive.current();
    const pctEl = $("#progressPct"), fillEl = $("#progressFill"), lvlEl = $("#progressLevel");
    if (lvlEl) lvlEl.textContent = cur.code;
    if (fillEl) fillEl.style.width = `${cur.pct}%`;
    if (pctEl) pctEl.textContent = `${cur.pct}%`;
    const sk = $("#streakChip");
    if (sk) sk.textContent = Store.get().streak.days;
  },

  setPreview(text, instant) {
    clearInterval(this.typeTimer);
    const box = $("#typebox");
    this.preview = text;
    if (!box) return;
    if (instant) { box.dataset.full = text; box.innerHTML = `${esc(text)}<span class="cursor"></span>`; return; }
    const current = box.dataset.full || "";
    if (!text) { if (current) this.erase(box, current); return; }
    if (current && current !== text) this.erase(box, current, () => this.type(box, text));
    else if (!current) this.type(box, text);
  },
  type(box, text) {
    let i = 0;
    box.dataset.full = text;
    this.typeTimer = setInterval(() => {
      i += 2;
      box.innerHTML = `${esc(text.slice(0, i))}<span class="cursor"></span>`;
      if (i >= text.length) clearInterval(this.typeTimer);
    }, 16);
  },
  erase(box, text, done) {
    let i = text.length;
    this.typeTimer = setInterval(() => {
      i -= 3;
      if (i <= 0) {
        clearInterval(this.typeTimer);
        box.dataset.full = "";
        box.innerHTML = `<span class="cursor"></span>`;
        done && done();
        return;
      }
      box.innerHTML = `${esc(text.slice(0, i))}<span class=\"cursor\"></span>`;
    }, 10);
  },

  render() {
    this.syncProgress();
    this.syncDock();
    const main = $("#main");
    const quote = $("#quoteBtn");
    quote.classList.toggle("show", this.tab === "explore" && !!this.exp.result);
    if (this.tab === "learn") main.innerHTML = Views.learn();
    else if (this.tab === "review") main.innerHTML = Views.reviewView();
    else if (this.tab === "practice") main.innerHTML = Views.practice();
    else if (this.tab === "stories") main.innerHTML = Views.story ? Views.storyView(Views.story) : Views.stories();
    else if (this.tab === "explore") { main.innerHTML = Views.exploreView(); this.bindExplore(); }
    else main.innerHTML = Views.you();
    main.scrollTop = 0;
  },

  /* ---------- explore: robust two-way translate ---------- */
  bindExplore() {
    const en = $("#enBox"), de = $("#deBox");
    [en, de].forEach(el => {
      el.addEventListener("input", () => { autoSize(el); this.exp[el === en ? "en" : "de"] = el.value; });
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          this.expRun(el === en ? "en" : "de");
        }
      });
      autoSize(el);
    });
  },
  async expRun(source) {
    const token = ++this.reqToken;
    const en = $("#enBox"), de = $("#deBox");
    const fromEl = source === "en" ? en : de;
    const text = (fromEl && fromEl.value || "").trim();
    const st = $("#expStatus");
    const toEl = source === "en" ? de : en;
    const tools = () => { // refresh per-pane tool buttons
      [["En", en], ["De", de]].forEach(([sfx, el]) => {
        const has = !!(el && el.value.trim());
        const spk = $(`.ico[data-act="spk${sfx}"]`), clr = $(`.ico[data-act="clr${sfx}"]`);
        if (spk) has ? spk.removeAttribute("disabled") : spk.setAttribute("disabled", "");
        if (clr) has ? clr.removeAttribute("disabled") : clr.setAttribute("disabled", "");
      });
    };
    if (!text) {
      this.exp.result = null; this.exp.status = ""; this.exp.sugs = [];
      $("#quoteBtn").classList.remove("show");
      if (st) st.textContent = "";
      const sheet = $("#sheet"); if (sheet) sheet.classList.remove("show");
      this.renderSugs();
      tools();
      return;
    }
    this.exp.status = "Translating…";
    if (st) st.innerHTML = `<span class="spinner"></span> Translating…`;
    toEl.classList.add("busy");
    let r = null;
    try {
      r = await Translate.lookup(text);
    } catch (e) { r = null; } // lookup never throws, but never trust the network
    if (token !== this.reqToken) return; // newer request won
    toEl.classList.remove("busy");
    if (!r) {
      this.exp.result = null; this.exp.sugs = [];
      this.exp.status = "Something hiccuped — please try that once more.";
      if (st) st.textContent = this.exp.status;
      this.renderSugs(); tools();
      return;
    }
    this.exp.result = r;
    this.exp.exIdx = 0;
    this.exp.en = en.value;
    this.exp.de = de.value;
    this.exp.sugs = r.suggestions || [];
    this.exp.alts = (r.alts || []).slice(0, 3);
    const missing = !r || r.via === "error" || r.via === "noresult";
    if (missing) {
      // clear the stale pane so the user never sees an old answer and thinks it's the new one
      toEl.value = ""; this.exp[source === "en" ? "de" : "en"] = ""; autoSize(toEl);
      $("#quoteBtn").classList.remove("show");
      this.exp.status = r.via === "error"
        ? (navigator.onLine
          ? `Couldn't reach the live dictionary for “${text}” — try again in a moment.`
          : `“${text}” isn't in your course yet, and you're offline — the live dictionary needs internet.`)
        : `“${text}” isn't in your course vocabulary${navigator.onLine ? " or the live dictionary" : ""}.${this.exp.sugs.length ? " Did you mean one of these?" : " Try another word — everything you learn lands here instantly."}`;
    } else {
      const val = source === "en" ? r.de : r.en;
      if (val) {
        toEl.value = val;
        this.exp[source === "en" ? "de" : "en"] = val;
        autoSize(toEl);
        this.exp.status = r.via === "course" ? "From your course — instant"
          : r.via === "dict" ? "Pocket dictionary — works offline"
          : r.via === "gloss" ? "Word-by-word (offline) — internet gives the full sentence"
          : (r.cached ? "From memory — instant"
            : r.sources && r.sources.google ? "Google Translate"
            : r.sources && r.sources.mm ? "Live translation (MyMemory)" : "Live translation");
      } else this.exp.status = "";
      if (r.examples && r.examples.length) {
        $("#quoteBtn").classList.add("show");
        const hasAi = r.examples.some(x => x.src === "ai");
        this.exp.status += hasAi
          ? " · 💬 examples ready — tap ✨ for fresh AI sentences"
          : navigator.onLine && !r.offline
            ? " · tap 💬 for examples — ✨ writes new ones"
            : " · tap 💬 for a real example sentence";
      } else {
        // keep 💬 visible even with zero examples so the AI generator stays reachable
        $("#quoteBtn").classList.add("show");
        this.exp.status += navigator.onLine && !r.offline
          ? " · tap 💬, then ✨ — AI writes fresh examples for this word"
          : " · no example sentence found for this one — the translation is still solid";
      }
    }
    if (st) st.textContent = this.exp.status;
    this.renderSugs();
    this.renderAlts();
    this.renderSheet();
    tools();
  },

  renderAlts() {
    let row = $("#altRow");
    if (!row) return;
    const alts = this.exp.alts || [];
    if (!alts.length) { row.innerHTML = ""; row.classList.remove("show"); return; }
    row.innerHTML = `<span class="sug-label">also:</span>` + alts.map(a =>
      `<button class="sug-chip alt" data-act="alt" data-v="${escAttr(a)}">${esc(a)}</button>`).join("");
    row.classList.add("show");
  },

  renderSugs() {
    const row = $("#sugRow");
    if (!row) return;
    const sugs = (this.exp.sugs || []).slice(0, 4);
    if (!sugs.length) { row.innerHTML = ""; row.classList.remove("show"); return; }
    row.innerHTML = `<span class="sug-label">Did you mean:</span>` + sugs.map(it =>
      `<button class="sug-chip" data-act="sug" data-de="${escAttr(it.de)}">${esc(it.de)}<span>${esc(it.en)}</span></button>`
    ).join("");
    row.classList.add("show");
  },
  renderSheet() {
    const r = this.exp.result;
    const sheet = $("#sheet");
    if (!sheet) return;
    if (!r) { sheet.classList.remove("show"); sheet.innerHTML = ""; return; }
    const online = navigator.onLine && !r.offline;
    if (!r.examples || !r.examples.length) {
      if (this.exp.showSentence) {
        sheet.innerHTML = `
          <div class="sheet-top">
            <h3>Example sentences</h3>
            ${online ? `<button class="ico fresh" data-act="freshEx" aria-label="Write fresh examples with AI">${icon("sparkle")}</button>` : ""}
          </div>
          <div class="sentence-en">No stored sentence for “${esc(r.query)}” yet${online ? " — tap the ✨ above and the AI writes new ones just for you" : " — the course examples grow as you pass stages"}.</div>
          ${r.sources ? `<div class="sheet-via">sources online: Google ${r.sources.google ? "✓" : "✗"} · Tatoeba ${r.sources.tatoeba ? "✓" : "✗"} · AI writer ${r.sources.ai ? "✓" : "✗"} · texts ${r.sources.mm ? "✓" : "✗"}</div>` : ""}`;
        sheet.classList.add("show");
      } else { sheet.classList.remove("show"); sheet.innerHTML = ""; }
      return;
    }
    const total = r.examples.length;
    const cur = this.exp.exIdx % total;
    const ex = r.examples[cur];
    sheet.innerHTML = `
      <div class="sheet-top">
        <h3>Example sentences <span class="sheet-count">${cur + 1}/${total}</span></h3>
        <span class="sheet-tools">
          <button class="ico" data-act="nextEx" aria-label="Next example">${icon("next")}</button>
          ${online ? `<button class="ico fresh" data-act="freshEx" aria-label="Fresh examples written by AI">${icon("sparkle")}</button>` : ""}
        </span>
      </div>
      <div class="sentence-de">${esc(ex.de)}</div>
      <div class="sentence-en">${esc(ex.en)}</div>
      <div class="sheet-foot">
        <button class="ghost" data-act="spkEx">${icon("speaker")} Listen</button>
        <span class="sheet-via">${({ course: "from your course", dict: "from the pocket dictionary", tatoeba: "real sentence · Tatoeba", ai: "✨ AI-written · fresh for you", mm: "from real translated texts" })[ex.src] || (r.via === "course" ? "from your course" : r.via === "dict" ? "pocket dictionary" : "from the web")}</span>
      </div>`;
    if (this.exp.showSentence) sheet.classList.add("show");
  },

  /* ---------- global action delegation ---------- */
  bindGlobal() {
    document.addEventListener("click", (e) => {
      const say = e.target.closest("[data-say]");
      if (say) {
        e.stopPropagation();
        Voice.speak(say.dataset.say, { lang: "de", slow: say.dataset.slow === "1" });
        return;
      }
      const uml = e.target.closest(".uml");
      if (uml) {
        e.preventDefault();
        const box = $("#" + (uml.closest(".umlauts").dataset.for || "typed"));
        if (box) {
          const pos = box.selectionStart ?? box.value.length;
          box.value = box.value.slice(0, pos) + uml.dataset.u + box.value.slice(box.selectionEnd ?? pos);
          box.focus();
          box.setSelectionRange(pos + 1, pos + 1);
        }
        return;
      }
      const t = e.target.closest("[data-act]");
      if (!t) return;
      this.action(t.dataset.act, t.dataset, t, e);
    });
    document.addEventListener("input", (e) => {
      if (e.target.dataset && e.target.dataset.act === "rate") {
        Store.setSetting("speechRate", Number(e.target.value));
        const span = e.target.closest(".set-row")?.querySelector(".set-copy span");
        if (span) span.textContent = `${Number(e.target.value).toFixed(2)}×`;
      }
    });
    document.addEventListener("change", (e) => {
      if (e.target.dataset && e.target.dataset.act === "passScore") {
        Store.setSetting("passScore", Number(e.target.value));
      }
    });
  },

  action(act, d, t) {
    switch (act) {
      /* learn map */
      case "level": {
        const code = d.level;
        if (!Adaptive.isLevelUnlocked(code)) {
          this.setPreview(`${code} stays locked until the level below reaches 80% — stages chain, so keep going.`);
          return;
        }
        this.openLevel = this.openLevel === code ? null : code;
        this.openUnit = null;
        const lv = Curriculum.LEVELS.find(l => l.code === code);
        this.preview = "";
        this.render();
        this.setPreview(this.openLevel && lv ? lv.slogan : "");
        break;
      }
      case "unit": {
        const u = Curriculum.byUnit(d.id);
        if (!u) return;
        if (!Adaptive.isUnitUnlocked(u)) {
          const list = Curriculum.levelUnits(u.level);
          const i = list.findIndex(x => x.id === u.id);
          const prev = list[i - 1];
          this.setPreview(prev ? `“${prev.title}” needs 80% — including its mission — before “${u.title}” opens.` : "Locked for now.");
          return;
        }
        this.openLevel = u.level;
        this.openUnit = this.openUnit === u.id ? null : u.id;
        const text = this.openUnit ? `${u.title}: ${u.why}` : "";
        this.preview = "";
        this.render();
        this.setPreview(text);
        break;
      }
      case "stage": {
        const s = Curriculum.byStage(d.id);
        if (s && Adaptive.isStageUnlocked(s)) StageFlow.run(s);
        break;
      }
      case "stageNext": {
        const s = Curriculum.byStage(d.id);
        const u = Curriculum.byUnit(s.unitId);
        const next = u.stages[s.index + 1];
        if (next && Adaptive.isStageUnlocked(next)) StageFlow.run(next);
        else { this.render(); }
        break;
      }
      case "stageRetry": {
        const s = Curriculum.byStage(d.id);
        if (s) StageFlow.run(s);
        break;
      }
      case "planGo": {
        if (d.kind === "stage" && d.id) { const s = Curriculum.byStage(d.id); if (s) StageFlow.run(s); }
        else if (d.kind === "review") { this.tab = "review"; Views.review.queue = []; this.render(); }
        else if (d.kind === "story") { this.tab = "stories"; Views.story = null; this.render(); }
        break;
      }
      case "goLearn": this.tab = "learn"; this.render(); break;

      /* review */
      case "flip": Views.review.flipped = true; this.render(); break;
      case "gradeRev": {
        const R = Views.review;
        const it = R.queue[R.idx];
        Store.rememberWord(it.de, Number(d.q));
        Store.grade("vocabulary", Number(d.q) >= 3, it, "");
        R.idx += 1; R.flipped = false;
        if (R.idx >= R.queue.length) Store.bumpToday("reviews");
        this.render();
        break;
      }

      /* practice */
      case "drill": Views.drill(t.dataset.d); break;
      case "goPractice": this.tab = "practice"; this.render(); break;
      case "goReview": this.tab = "review"; this.render(); break;
      case "goStories": this.tab = "stories"; this.render(); break;

      /* stories */
      case "story": Views.openStory(d.id); break;
      case "storyBack": Voice.stop(); Views.story = null; this.render(); break;
      case "playAll": {
        const st = Views.story;
        if (!st) break;
        const slowBtn = $('[data-act="togSlow"]');
        const slow = !!(slowBtn && slowBtn.classList.contains("slowOn"));
        Voice.stop();
        const lines = $("#readerLines");
        Voice.speakLines(st.lines.map(l => ({ de: l.de })), {
          slow,
          online: (i) => {
            $$(".ctx-line", lines).forEach((el, j) => el.classList.toggle("playing", j === i));
            const el = $(`.ctx-line[data-line="${i}"]`, lines);
            if (el) el.scrollIntoView({ block: "nearest", behavior: "smooth" });
          },
          ondone: () => $$(".ctx-line", lines).forEach(el => el.classList.remove("playing"))
        });
        break;
      }
      case "togSlow": t.classList.toggle("slowOn"); break;
      case "togEn": {
        t.classList.toggle("on");
        $$("#readerLines .ctx-en").forEach(el => el.classList.toggle("hidden", !t.classList.contains("on")));
        break;
      }
      case "gloss": {
        const w = d.w;
        const hit = Curriculum.allItems().find(i => i.de === w || i.de.includes(w));
        if (hit) Voice.speak(hit.de, { lang: "de" });
        break;
      }
      case "glossAdd": {
        const st = STORIES.find(s => s.id === d.id);
        st.words.forEach(w => {
          const hit = Curriculum.allItems().find(i => i.de === w || i.de.includes(w));
          if (hit) Store.seedWord(hit.de);
        });
        t.textContent = "Added to Review ✓";
        t.disabled = true;
        break;
      }
      case "storyAns": {
        const st = Views.story;
        const q = st.qs[Number(d.q)];
        const wrap = t.closest(".sq");
        const ok = looseEq(d.val, q.answer);
        $$(".choice", wrap).forEach(c => {
          c.disabled = true;
          if (looseEq(c.dataset.val, q.answer)) c.classList.add("right");
        });
        if (!ok) t.classList.add("wrong");
        Store.grade("reading", ok, null, "");
        const fb = wrap.querySelector(".feedback");
        fb.className = `feedback show ${ok ? "good" : "bad"}`;
        fb.innerHTML = ok ? "<b>Richtig.</b>" : `<b>Not quite.</b> It's “${esc(q.answer)}”.`;
        const answered = $$(".sq").filter(sq => sq.querySelector(".choice:disabled")).length;
        if (answered === st.qs.length) {
          const read = Store.get().read || {};
          read[st.id] = true;
          Store.get().read = read;
          Store.bumpToday("stories");
          Store.save();
        }
        break;
      }

      /* explore */
      case "goEn": this.expRun("en"); break;
      case "goDe": this.expRun("de"); break;
      case "clrEn": { const b = $("#enBox"); b.value = ""; this.exp.en = ""; this.focusBox("en"); break; }
      case "clrDe": { const b = $("#deBox"); b.value = ""; this.exp.de = ""; this.focusBox("de"); break; }
      case "spkEn": Voice.speak($("#enBox").value, { lang: "en" }); break;
      case "spkDe": Voice.speak($("#deBox").value, { lang: "de" }); break;
      case "alt": {
        const v = d.v || "";
        const box = $("#deBox");
        if (box) { box.value = v; this.exp.de = v; autoSize(box); }
        break;
      }
      case "sug": {
        const word = d.de || "";
        const box = $("#deBox");
        if (box) {
          box.value = word; this.exp.de = word; autoSize(box);
          this.expRun("de");
        }
        break;
      }
      case "nextEx": {
        const r = this.exp.result;
        if (r && r.examples.length) {
          this.exp.exIdx = (this.exp.exIdx + 1) % r.examples.length;
          this.renderSheet();
        }
        break;
      }
      case "freshEx": {
        const r = this.exp.result;
        if (!r || !navigator.onLine || r.offline) break;
        const st = $("#expStatus");
        if (t && t.classList) t.classList.add("spin");
        if (st) st.textContent = "✨ AI is writing fresh examples for “" + r.query + "”…";
        Translate.freshExamples(r).then(nr => {
          this.exp.result = nr;
          this.exp.exIdx = 0;
          this.exp.showSentence = true;
          const got = nr.examples.filter(x => x.src === "ai").length;
          this.exp.status = got
            ? `✨ ${got} fresh AI example${got === 1 ? "" : "s"} — every tap writes new ones`
            : "AI writer is unreachable right now — kept the existing examples.";
          if (st) st.textContent = this.exp.status;
          this.renderSheet();
          const sheet = $("#sheet");
          if (sheet) sheet.classList.add("show");
        });
        break;
      }
      case "spkEx": {
        const r = this.exp.result;
        if (r && r.examples[this.exp.exIdx]) Voice.speak(r.examples[this.exp.exIdx].de, { lang: "de" });
        break;
      }

      /* you/settings */
      case "tog": Store.setSetting(d.key, !Store.get().settings[d.key]); this.render(); break;
      case "testVoice": Voice.speak("Hallo! So klingt dein Deutsch.", { lang: "de" }); break;
      case "reset":
        if (confirm("Reset all progress and memory? This can't be undone.")) {
          Store.reset();
          views_story_reset();
          this.openLevel = "A1"; this.openUnit = null; Views.story = null; this.exp = { en: "", de: "", result: null, exIdx: 0, showSentence: false, status: "", sugs: [], alts: [] };
          this.render();
        }
        break;
    }
  },
  focusBox(which) {
    const el = $(which === "en" ? "#enBox" : "#deBox");
    if (el) el.focus();
  }
};
function views_story_reset() { /* placeholder keeps intent clear */ }

function autoSize(el) {
  if (!el) return;
  el.style.height = "auto";
  el.style.height = Math.min(150, el.scrollHeight || 60) + "px";
}

document.addEventListener("DOMContentLoaded", () => App.init());

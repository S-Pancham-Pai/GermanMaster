/* Two-way EN<->DE lookup with real example sentences.
   Order: course bank (instant) -> MyMemory (translation) ->
   Tatoeba (real sentences from real texts) -> MyMemory matches. */
const Translate = (() => {
  const CACHE_KEY = "germanmaster.tcache.v2";   // v2: bulk dictionary era
  let cache = {};
  try { cache = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}"); } catch (_) { cache = {}; }
  const saveCache = () => {
    try {
      const ks = Object.keys(cache);
      if (ks.length > 300) delete cache[ks[0]];
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch (_) { /* full */ }
  };

  function detectGerman(text) {
    const t = " " + String(text).toLowerCase()
      .replace(/[.,!?…:;()„“"»«']/g, " ").replace(/\s+/g, " ") + " ";
    if (/[äöüß]/.test(t)) return true;
    const words = [
      "der", "die", "das", "den", "dem", "des", "ich", "du", "er", "sie", "es", "wir", "ihr",
      "mich", "dich", "ihn", "uns", "euch", "und", "nicht", "mit", "für", "ein", "eine", "einen",
      "ist", "sind", "bin", "bist", "seid", "habe", "hat", "wie", "was", "guten", "vielen",
      "bitte", "danke", "kein", "keine", "jetzt", "heute", "morgen", "gestern", "wo", "warum",
      "wann", "woher", "wohin", "hier", "dort", "immer", "nie", "noch", "schon", "sehr", "viel",
      "gut", "neu", "alt", "schnell", "langsam", "helfen", "hilfe", "gehen", "kommen", "sehen",
      "essen", "trinken", "wissen", "können", "müssen", "wollen", "haben", "sein", "werden",
      "vielleicht", "ziemlich", "eigentlich", "wirklich", "manchmal", "meine", "mein", "deine",
      "dein", "diese", "dieser", "dieses", "jeder", "alle", "alles", "etwas", "nichts"
    ];
    const padded = " " + t.trim() + " ";
    return words.some(w => padded.includes(" " + w + " "));
  }

  /* pocket dictionary lookup (offline-capable); returns an item-shaped hit or null */
  function lookupDict(q) {
    const stripQ = s => normalize(String(s)
      .replace(/^(der|die|das|den|dem|des|ein|eine|einen|einem)\s+/i, "")
      .replace(/^(the|a|an|to|my|your|its)\s+/i, ""));
    const needle = stripQ(q);
    const bare = normalize(q);
    if (!needle) return null;
    if (DICT.byKey) {   // ~6k entries: always hit the prebuilt index, never a full scan
      const hit = DICT.byKey.get(needle) || DICT.byKey.get(bare) ||
                  DICT.byKey.get(deFold(needle)) || DICT.byKey.get(deFold(bare));
      if (hit) return hit;
      if (/^[\wäöüßÄÖÜ-]+$/.test(needle) && needle.length >= 3) {
        // word-boundary fallback over the curated slice only (multiword phrases live there)
        const rx = new RegExp(`\\b${needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
        const N = Math.min(DICT.entries.length, 700);
        for (let i = 0; i < N; i++) {
          const it = DICT.entries[i];
          if (rx.test(stripQ(it.de)) || rx.test(stripQ(it.en))) return it;
        }
      }
      return null;
    }
    const hit = DICT.entries.find(it =>
      stripQ(it.de) === needle || stripQ(it.en) === needle ||
      normalize(it.de) === bare || normalize(it.en) === bare ||
      deFold(stripQ(it.de)) === deFold(needle));
    if (hit) return hit;
    if (/^[\wäöüßÄÖÜ-]+$/.test(needle) && needle.length >= 3) {
      const rx = new RegExp(`\\b${needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
      return DICT.entries.find(it => rx.test(stripQ(it.de)) || rx.test(stripQ(it.en))) || null;
    }
    return null;
  }

  /* word-by-word gloss for offline phrases — honest, never fakes a full translation */
  function glossWords(q, toGerman) {
    const strip = s => normalize(String(s)
      .replace(/^(der|die|das|den|dem|des|ein|eine|einen|einem|the|a|an|to|my|your)\s+/i, ""));
    return q.split(/\s+/).filter(Boolean).map(w => {
      const hit = lookupDict(w) || (Curriculum.allItems().find(it => strip(it.de) === strip(w) || strip(it.en) === strip(w)));
      if (!hit) return w;
      return toGerman ? hit.de : hit.en.replace(/^(the|a|an|to)\s+/i, "");
    }).join(" · ");
  }

  function lookupLocal(q) {
    // strip leading articles/aux from BOTH sides so "die Katze", "the cat",
    // "Katze" or "cat" all land on the same entry
    const stripQ = s => normalize(String(s)
      .replace(/^(der|die|das|den|dem|des|ein|eine|einen|einem)\s+/i, "")
      .replace(/^(the|a|an|to|my|your)\s+/i, ""));
    const needle = stripQ(q);
    const needleBare = normalize(q);
    const strip = s => normalize(String(s).replace(/^(der|die|das|den|dem|des|ein|eine|einen|einem)\s+/i, ""));
    const stripEn = s => normalize(String(s).replace(/^(the|a|an|to|my|your)\s+/i, ""));
    const all = Curriculum.allItems();
    const exact = all.find(it =>
      strip(it.de) === needle || stripEn(it.en) === needle ||
      strip(it.de) === needleBare || stripEn(it.en) === needleBare ||
      deFold(strip(it.de)) === deFold(needle) || deFold(stripEn(it.en)) === deFold(needle));
    if (exact) return exact;
    // multiword: exact phrase on either side
    const phrase = all.find(it => normalize(it.de) === needleBare || normalize(it.en) === needleBare);
    if (phrase) return phrase;
    // single-word query: word-boundary containment inside an item's phrase
    if (/^[\wäöüßÄÖÜ-]+$/.test(needle) && needle.length >= 3) {
      const rx = new RegExp(`\\b${needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
      return all.find(it => rx.test(strip(it.de)) || rx.test(stripEn(it.en)) || rx.test(normalize(it.de)) || rx.test(normalize(it.en))) || null;
    }
    return null;
  }

  /* nearest course entries — powers "did you mean" chips when a lookup misses */
  function suggestions(q, n = 4) {
    const stripQ = s => normalize(String(s).replace(/^(der|die|das|the|a|an|to)\s+/i, ""));
    const words = stripQ(q).split(" ").filter(x => x.length >= 3);
    if (!words.length) return [];
    const wordsOf = txt => stripQ(txt).split(" ");
    return Curriculum.allItems()
      .map(it => {
        const toks = [...wordsOf(it.de), ...wordsOf(it.en)];
        let best = 99;
        for (const wd of words) {
          for (const tk of toks) {
            if (tk === wd) { best = Math.min(best, 0); continue; }
            if (tk.startsWith(wd) || wd.startsWith(tk)) { best = Math.min(best, 1); continue; }
            if (tk.includes(wd) || wd.includes(tk)) { best = Math.min(best, 2); continue; }
            const d = lev(wd, tk);
            if (d <= (wd.length >= 6 ? 2 : 1)) best = Math.min(best, 3 + d * 0.1);
          }
        }
        return { it, score: best };
      })
      .filter(x => x.score < 99)
      .sort((a, b) => a.score - b.score)
      .slice(0, n)
      .map(x => x.it);
  }

  const stripArticle = s => String(s).replace(/^(der|die|das)\s+/i, "").trim();

  async function fetchJSON(url, ms = 7000) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), ms);
    try {
      const res = await fetch(url, { signal: ctrl.signal });
      if (!res.ok) throw new Error("http " + res.status);
      return await res.json();
    } finally { clearTimeout(t); }
  }

  async function fetchText(url, ms = 8000) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), ms);
    try {
      const res = await fetch(url, { signal: ctrl.signal });
      if (!res.ok) throw new Error("http " + res.status);
      return await res.text();
    } finally { clearTimeout(t); }
  }

  /* Tatoeba & the AI writer don't always send CORS headers, which silently
     kills them on phones — and some networks block individual relay hosts.
     So we race direct + several INDEPENDENT relays; first success wins. */
  const RELAYS_JSON = [
    u => u,                                                              // direct, when CORS allows
    u => "https://api.allorigins.win/raw?url=" + encodeURIComponent(u),
    u => "https://corsproxy.io/?url=" + encodeURIComponent(u),
    u => "https://api.codetabs.com/v1/proxy?quest=" + encodeURIComponent(u)
  ];
  /* the jina.ai reader relay returns plain text — useless for JSON APIs,
     but a genuine extra route for the AI writer's prose */
  const RELAYS_TEXT = [...RELAYS_JSON, u => "https://r.jina.ai/" + u];
  function firstSuccess(promises) {
    let left = promises.length, lastErr = null;
    return new Promise((done, fail) => {
      promises.forEach(p => Promise.resolve(p).then(done,
        e => { lastErr = e; if (--left === 0) fail(lastErr || new Error("unreachable")); }));
    });
  }
  function fetchRelay(url, ms, wantJson) {   // direct + relays race in parallel — first success wins
    const rels = wantJson ? RELAYS_JSON : RELAYS_TEXT;
    return firstSuccess(rels.map(wrap => (wantJson ? fetchJSON(wrap(url), ms) : fetchText(wrap(url), ms))));
  }

  /* Google Translate's own endpoint — the same engine Google Search uses.
     Returns { text, alts[] } — alts are the other dictionary translations. */
  async function googleTranslate(q, fromDe) {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${fromDe ? "de" : "en"}&tl=${fromDe ? "en" : "de"}&dt=t&dt=bd&q=${encodeURIComponent(q)}`;
    const json = await fetchRelay(url, 6000, true);
    const parts = json && Array.isArray(json[0]) ? json[0].map(seg => seg && seg[0]).filter(Boolean) : [];
    const text = String(parts.join(" ")).replace(/\s+/g, " ").trim();
    if (!text || normalize(text) === normalize(q)) throw new Error("gtx-echo");
    const alts = [];
    try {
      for (const block of (json[1] || [])) {           // [pos, [t1, t2, ...], ...]
        for (const alt of (block && block[1] || [])) {
          const w = String(alt || "").trim();
          if (w && w.length < 60 && normalize(w) !== normalize(text) && !alts.includes(w)) alts.push(w);
          if (alts.length >= 3) break;
        }
        if (alts.length >= 3) break;
      }
    } catch (_) { /* alternatives optional */ }
    return { text, alts };
  }

  /* AI-written practice sentences (like Google's AI mode, tuned for A1/A2 German).
     A random topic + batch salt makes every call produce NEW sentences. */
  const AI_TOPICS = ["meeting friends after work", "ordering at a café", "a weekend trip", "a normal day at work or school", "learning a new skill", "cooking dinner for someone", "texting a friend", "shopping in the city", "a family get-together", "a lazy Sunday morning", "planning a small party", "getting around town", "bad weather ruining plans", "sports and hobbies", "a funny misunderstanding", "movie night", "moving to a new flat", "a visit to the doctor", "trains and delays", "a summer evening outside"];
  async function aiExamples(deTerm, enHint) {
    const w = stripArticle(deTerm || "").trim();
    if (!w || w.length > 32) return [];
    const rnd = arr => arr[Math.floor(Math.random() * arr.length)];
    const topics = `${rnd(AI_TOPICS)} or ${rnd(AI_TOPICS)}`;
    const batch = Math.random().toString(36).slice(2, 8);
    const prompt = `Write 4 different short, natural German sentences (CEFR A1-A2, everyday conversational style, one could be a question) using the German word "${w}"${enHint ? ` (it means: "${String(enHint).slice(0, 40)}")` : ""}. Set each sentence in a scene about: ${topics}. Each sentence must actually contain the word "${w}". Add an English translation for each. Reply with ONLY the lines, exactly in this format, nothing else:\nGerman sentence => English translation\n\n(batch ${batch})`;
    let txt = "";
    const pol = "https://text.pollinations.ai/";
    try {
      txt = await fetchRelay(pol + encodeURIComponent(prompt) + "?referrer=germanmaster-app", 9500);
    } catch (_) {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 9000);
      try {
        const res = await fetch(pol, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: [{ role: "user", content: prompt }], model: "openai-fast", referrer: "germanmaster-app" }),
          signal: ctrl.signal
        });
        if (res.ok) txt = await res.text();
      } catch (_) { /* both shapes failed */ }
      finally { clearTimeout(t); }
    }
    if (!txt) throw new Error("ai-unavailable");
    const out = [];
    const rx = new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    for (const line of String(txt).split(/\n+/)) {
      const parts = line.split("=>");
      if (parts.length !== 2) continue;
      const de = parts[0].trim().replace(/^[\d]+[.)]\s*/, "").replace(/^[-*•]\s*/, "").replace(/^["„“]+|["“”]+$/g, "");
      const en = parts[1].trim().replace(/^["“”]+|["“”]+$/g, "");
      if (de.length < 8 || de.length > 130 || !rx.test(de)) continue;
      if (!en || en.length > 140) continue;
      out.push({ de, en, src: "ai" });
      if (out.length >= 4) break;
    }
    return out;
  }

  async function myMemoryTranslate(q, fromDe) {
    const pair = fromDe ? "de|en" : "en|de";
    const json = await fetchRelay(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(q)}&langpair=${pair}`, 7000, true);
    const translated = String((json && json.responseData && json.responseData.translatedText) || "").trim();
    if (!translated || /^[A-Z ]*(QUERY LENGTH|INVALID|MYMEMORY)/i.test(translated)) throw new Error("quota");
    // MyMemory echoes untranslatable input back — treat an echo as a miss
    if (normalize(translated) === normalize(q)) throw new Error("echo");
    const examples = [];
    for (const m of (json.matches || [])) {
      const seg = String(m.segment || "").trim(), tr = String(m.translation || "").trim();
      if (!seg.includes(" ") || seg.length < 14 || seg.length > 110) continue;
      const de = fromDe ? seg : tr, en = fromDe ? tr : seg;
      if (/[<>{}]/.test(de + en)) continue;
      examples.push({ de, en });
      if (examples.length >= 6) break;
    }
    return { translated, examples };
  }

  async function tatoebaExamples(deWord) {
    const term = stripArticle(deWord);
    const url = `https://tatoeba.org/en/api_v1/search?from=deu&to=eng&orphans=no&sort=relevance&word_count_max=14&query=${encodeURIComponent("=" + term)}`;
    const json = await fetchRelay(url, 8000, true);
    const out = [];
    const rx = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    for (const r of (json.results || [])) {
      const de = String(r.text || "").trim();
      if (de.length < 12 || de.length > 110 || !rx.test(de)) continue;
      let en = "";
      for (const group of (r.translations || [])) {
        for (const tr of group) {
          if (tr.lang === "eng" && tr.text) { en = tr.text.trim(); break; }
        }
        if (en) break;
      }
      if (en) out.push({ de, en });
      if (out.length >= 8) break;
    }
    return out;
  }

  /* main entry — never throws, always returns a result object or null on empty input */
  async function lookup(text) {
    try {
      return await lookupInner(text);
    } catch (e) {
      // absolute last resort — Explore must always get an answer-shaped object
      try {
        const q = String(text || "").trim().replace(/\s+/g, " ");
        const local = q ? lookupLocal(q) : null;
        if (local) return finish(q, detectGerman(q), local.de, local.en, local.gender,
          local.exampleDe ? [{ de: local.exampleDe, en: local.exampleEn, src: "course" }] : [], "course", true);
        const fromDe = q ? detectGerman(q) : false;
        return { query: q, fromDe, de: fromDe ? q : "", en: fromDe ? "" : q, gender: null,
          examples: [], via: "error", offline: true, idx: 0, suggestions: q ? suggestions(q) : [] };
      } catch (_) { return null; }
    }
  }

  async function lookupInner(text) {
    const q = String(text || "").trim().replace(/\s+/g, " ");
    if (!q) return null;
    const fromDe = detectGerman(q);
    const key = (fromDe ? "de:" : "en:") + q.toLowerCase();
    if (cache[key]) {
      // memory answers are instant; fresh AI sentences get attached by loadExamples
      return { ...cache[key], cached: true };
    }
    if (!navigator.onLine || !Store.get().settings.onlineDict) {
      const local = lookupLocal(q);
      if (local) {
        return finish(q, fromDe, local.de, local.en, local.gender,
          local.exampleDe ? [{ de: local.exampleDe, en: local.exampleEn, src: "course" }] : [], "course", true);
      }
      const dh = lookupDict(q);
      if (dh) {
        return finish(q, fromDe, dh.de, dh.en, dh.gender,
          dh.exampleDe ? [{ de: dh.exampleDe, en: dh.exampleEn, src: "dict" }] : [], "dict", true);
      }
      // multiword offline: honest word-by-word gloss
      if (q.includes(" ")) {
        const gloss = glossWords(q, !fromDe);
        return {
          query: q, fromDe,
          de: fromDe ? q : gloss, en: fromDe ? gloss : q,
          gender: null, examples: [], via: "gloss", offline: true, idx: 0,
          suggestions: suggestions(q)
        };
      }
      return {
        query: q, fromDe, de: fromDe ? q : "", en: fromDe ? "" : q,
        gender: null, examples: [], via: "noresult", offline: true, idx: 0,
        suggestions: suggestions(q)
      };
    }

    // online path — course first, then the pocket dictionary (both instant), then the web
    const courseHit = lookupLocal(q);
    const dictHit = courseHit ? null : lookupDict(q);
    const local = courseHit || dictHit;
    let de = fromDe ? q : "", en = fromDe ? "" : q, gender = local ? local.gender : null;
    let examples = [];
    let via = "live";

    if (local) { de = local.de; en = local.en; via = courseHit ? "course" : "dict"; }
    if (local && local.exampleDe) examples.push({ de: local.exampleDe, en: local.exampleEn, src: courseHit ? "course" : "dict" });

    // 1) translation: Google vs MyMemory — first GOOD answer wins, the other is abandoned.
    //    Example sentences do NOT block this; they stream in via loadExamples().
    let translated = "", alts = [];
    const srcs = { google: false, mm: false, tatoeba: false, ai: false };
    try {
      const winner = await firstSuccess([
        googleTranslate(q, fromDe).then(v => ({ kind: "g", v })),
        myMemoryTranslate(q, fromDe).then(v => ({ kind: "m", v }))
      ]);
      if (winner.kind === "g") { translated = winner.v.text; alts = winner.v.alts || []; srcs.google = true; }
      else {
        translated = winner.v.translated; srcs.mm = true;
        examples.push(...winner.v.examples.map(x => ({ ...x, src: "mm" })));
      }
    } catch (_) { /* both sources failed */ }
    if (!local) {
      if (translated) { de = fromDe ? q : translated; en = fromDe ? translated : q; }
      else {
        return { query: q, fromDe, de: fromDe ? q : "", en: fromDe ? "" : q, gender: null,
          examples: [], via: "error", idx: 0, suggestions: suggestions(q) };
      }
    }

    // adopt article/lemma from the pocket dictionary when the live translation
    // is a bare noun — "rat" should answer "die Ratte", not just "Ratte"
    if (!local && translated && !gender) {
      const enr = lookupDict(fromDe ? q : translated);
      if (enr && enr.gender) {
        gender = enr.gender;
        if (!fromDe && stripArticle(enr.de).toLowerCase() === stripArticle(translated).toLowerCase()) de = enr.de;
      }
    }

    const res = finish(q, fromDe, de, en, gender, examples, via, false, key, { alts, sources: srcs });
    res.examplesPending = true;   // sentences stream in right after the answer is on screen
    return res;
  }

  /* Wiktionary (de.wiktionary.org) sends CORS headers and is reachable on
     networks that block relay hosts — real dictionary example sentences.
     No English there, so each line gets a Google translation on the fly. */
  async function wiktExamples(deTerm) {
    const term = stripArticle(deTerm).trim();
    if (!term || term.length > 32 || term.includes(" ")) return [];
    const title = term.charAt(0).toUpperCase() + term.slice(1);
    const url = "https://de.wiktionary.org/w/api.php?action=query&prop=extracts&explaintext=1&redirects=1&format=json&origin=*&titles=" + encodeURIComponent(title);
    const json = await fetchRelay(url, 8000, true);
    const pages = (json && json.query && json.query.pages) || {};
    let ext = "";
    for (const k in pages) if (pages[k] && typeof pages[k].extract === "string") ext = pages[k].extract;
    if (!ext) return [];
    const rx = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    const cands = [];
    for (const raw of ext.split(/\n+/)) {
      const line = raw.replace(/^\[\d+\]\s*/, "").replace(/^[:*#›»\s]+/, "").replace(/^["„“′']+|["“”′']+$/g, "").trim();
      if (line.length < 14 || line.length > 110) continue;
      if (!/[.!?…]["”»]?$/.test(line)) continue;
      if (!rx.test(line)) continue;
      if (/[{<]|\|/ .test(line) || /Beispiele|Wortart|Aussprache|Herkunft|Übersetzungen|Bedeutungen|Wortbildung|Gegenwörter|Verweise/.test(line)) continue;
      if (!cands.includes(line)) cands.push(line);
      if (cands.length >= 3) break;
    }
    const settled = await Promise.allSettled(cands.map(async de => {
      const t = await googleTranslate(de, true);
      return { de, en: t.text, src: "wikt" };
    }));
    return settled.filter(s => s.status === "fulfilled" && s.value.en && s.value.en.length > 3).map(s => s.value);
  }

  /* Built-in practice-line writer — grammar-safe templates fed by the pocket
     dictionary's gender/part-of-speech. Guarantees the sheet is NEVER empty,
     even when every network source is unreachable. */
  function miniWriter(deTerm, enHint) {
    const raw = stripArticle(deTerm).trim();
    if (!raw || raw.length > 30) return [];
    const hit = lookupDict(raw) || lookupLocal(raw) || null;
    const en = (String((hit && hit.en) || enHint || "").replace(/^(the|a|an|to)\s+/i, "")
      .split(/[;/]/)[0].trim()) || raw;
    const pos = hit && hit.pos ? hit.pos : "";
    const g = hit && hit.gender;                    // "der" | "die" | "das" | null
    const T = raw.charAt(0).toUpperCase() + raw.slice(1);
    const out = [];
    const push = (de, enT) => { if (de && enT && !out.some(x => x.de === de)) out.push({ de, en: enT, src: "mini" }); };
    if (pos === "noun" || g) {
      const def = g === "der" ? "Der" : g === "die" ? "Die" : "Das";
      const akk = g === "der" ? "einen" : g === "die" ? "eine" : "ein";
      const nom = g === "die" ? "eine" : "ein";
      push(`${def} ${T} ist hier.`, `The ${en} is here.`);
      push(`Ich sehe ${akk} ${T}.`, `I see a ${en}.`);
      push(`Wo ist ${def.toLowerCase()} ${T}?`, `Where is the ${en}?`);
      push(`„${T}“ heißt „${en}“ auf Englisch.`, `"${T}" means "${en}" in English.`);
    } else if (pos === "verb") {
      const inf = raw.toLowerCase();
      push(`Ich will ${inf}.`, `I want to ${en}.`);
      push(`Wir müssen heute ${inf}.`, `We have to ${en} today.`);
      push(`Kannst du ${inf}?`, `Can you ${en}?`);
      push(`„${T}“ heißt „${en}“ auf Englisch.`, `"${T}" means "${en}" in English.`);
    } else if (pos === "adjective") {
      const a = raw.toLowerCase();
      push(`Das ist sehr ${a}.`, `That is very ${en}.`);
      push(`Das Wetter ist heute ${a}.`, `The weather is ${en} today.`);
      push(`Ich finde das ${a}.`, `I think that is ${en}.`);
      push(`„${T}“ heißt „${en}“ auf Englisch.`, `"${T}" means "${en}" in English.`);
    } else if (raw) {                               // unknown word — always-true lines about the word itself
      push(`„${T}“ heißt „${en}“ auf Englisch.`, `"${T}" means "${en}" in English.`);
      push(`Ich lerne das Wort „${T}“.`, `I am learning the word "${T}".`);
      push(`Was bedeutet „${T}“?`, `What does "${T}" mean?`);
      push(`Kannst du „${T}“ sagen?`, `Can you say "${T}"?`);
    }
    return out.slice(0, 4);
  }

  /* Example sentences, loaded AFTER the translation is already showing.
     onlyAi = regenerate just the AI-written batch (the sparkle button).
     If every network source fails, the built-in writer guarantees lines. */
  async function loadExamples(res, opts) {
    const onlyAi = !!(opts && opts.onlyAi);
    if (!res || res.offline || !navigator.onLine || !Store.get().settings.onlineDict) return res;
    const term = stripArticle(res.fromDe ? res.query : (res.de || res.query));
    if (!term || term.length > 40) return { ...res, examplesPending: false };
    const jobs = onlyAi ? [aiExamples(term, res.en || res.query)]
      : [tatoebaExamples(term), aiExamples(term, res.en || res.query), wiktExamples(term)];
    const settled = await Promise.allSettled(jobs);
    const val = r => (r.status === "fulfilled" ? r.value : []);
    const tato = onlyAi ? [] : val(settled[0]).map(x => ({ ...x, src: "tatoeba" }));
    const ai = val(settled[settled.length - (onlyAi ? 1 : 2)]);
    const wik = onlyAi ? [] : val(settled[2]);
    // rebuild: course/dict first, then fresh AI, Wiktionary, corpus —
    // keep old batches that were NOT refreshed this round (✨ only regenerates AI)
    const keep = (res.examples || []).filter(x =>
      x.src !== "ai" && (onlyAi || (x.src !== "tatoeba" && x.src !== "wikt" && x.src !== "mini")));
    const first = keep.filter(x => x.src === "course" || x.src === "dict");
    const rest = keep.filter(x => x.src !== "course" && x.src !== "dict");
    const seen = new Set([...first, ...rest].map(k => k.de));
    const addA = ai.filter(x => !seen.has(x.de) && seen.add(x.de));
    const addW = wik.filter(x => !seen.has(x.de) && seen.add(x.de));
    const addT = tato.filter(x => !seen.has(x.de) && seen.add(x.de));
    let examples = [...first.slice(0, 4), ...addA, ...addW, ...addT, ...rest].slice(0, 10);
    let miniFallback = false;
    if (!examples.length) {              // the whole internet said no — the built-in writer takes over
      examples = miniWriter(term, res.en || res.query);
      miniFallback = examples.length > 0;
    }
    return {
      ...res,
      examples,
      sources: { ...(res.sources || {}),
        ai: examples.some(x => x.src === "ai"),
        tatoeba: examples.some(x => x.src === "tatoeba"),
        wikt: examples.some(x => x.src === "wikt"),
        mini: examples.some(x => x.src === "mini") },
      idx: 0,
      fresh: (addA.length > 0) || undefined,
      miniFallback: (miniFallback && onlyAi) || undefined,
      examplesPending: false
    };
  }
  const freshExamples = res => loadExamples(res, { onlyAi: true });

  function finish(query, fromDe, de, en, gender, examples, via, offline, cacheKey, extras) {
    // dedupe + prefer containing the queried term
    const term = stripArticle(fromDe ? query : de).toLowerCase();
    const seen = new Set();
    examples = examples.filter(x => x.de && !seen.has(x.de) && seen.add(x.de));
    examples.sort((a, b) => (b.de.toLowerCase().includes(term) - a.de.toLowerCase().includes(term)));
    const res = { query, fromDe, de, en, gender, examples: examples.slice(0, 10), via, offline: !!offline, idx: 0 };
    if (extras) {
      if (extras.alts && extras.alts.length) res.alts = extras.alts;
      if (extras.sources) res.sources = extras.sources;
    }
    if (cacheKey) {
      // AI sentences must stay fresh — never freeze them into the cache
      cache[cacheKey] = { ...res, examples: res.examples.filter(x => x.src !== "ai") };
      saveCache();
    }
    return res;
  }

  return { lookup, detectGerman, freshExamples, loadExamples };
})();

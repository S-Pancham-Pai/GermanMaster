/* Two-way EN<->DE lookup with real example sentences.
   Order: course bank (instant) -> MyMemory (translation) ->
   Tatoeba (real sentences from real texts) -> MyMemory matches. */
const Translate = (() => {
  const CACHE_KEY = "germanmaster.tcache.v1";
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

  /* Google Translate's own endpoint — the same engine Google Search uses.
     Returns { text, alts[] } — alts are the other dictionary translations. */
  async function googleTranslate(q, fromDe) {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${fromDe ? "de" : "en"}&tl=${fromDe ? "en" : "de"}&dt=t&dt=bd&q=${encodeURIComponent(q)}`;
    const json = await fetchJSON(url, 6000);
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
     GET first; if the network/CORS blocks it, try the POST chat shape. */
  async function aiExamples(deTerm, enHint) {
    const w = stripArticle(deTerm || "").trim();
    if (!w || w.length > 32) return [];
    const prompt = `Write 3 different short, natural German sentences (CEFR A1-A2, everyday conversational style, one sentence could be a question) using the German word "${w}"${enHint ? ` (it means: "${String(enHint).slice(0, 40)}")` : ""}. Each sentence must actually contain the word "${w}". Add an English translation for each. Reply with ONLY the lines, exactly in this format, nothing else:\nGerman sentence => English translation`;
    let txt = "";
    try {
      txt = await fetchText("https://text.pollinations.ai/" + encodeURIComponent(prompt), 9000);
    } catch (_) {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 9000);
      try {
        const res = await fetch("https://text.pollinations.ai/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: [{ role: "user", content: prompt }] }),
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
      if (out.length >= 3) break;
    }
    return out;
  }

  async function myMemoryTranslate(q, fromDe) {
    const pair = fromDe ? "de|en" : "en|de";
    const json = await fetchJSON(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(q)}&langpair=${pair}`);
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
    const json = await fetchJSON(url, 8000);
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
    if (cache[key]) return { ...cache[key], cached: true };
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

    // 1) translation: Google Translate + MyMemory race in parallel — first good one wins
    const [gtR, mmR] = await Promise.allSettled([googleTranslate(q, fromDe), myMemoryTranslate(q, fromDe)]);
    let translated = "", alts = [];
    const srcs = { google: gtR.status === "fulfilled", mm: mmR.status === "fulfilled", tatoeba: false, ai: false };
    if (gtR.status === "fulfilled") { translated = gtR.value.text; alts = gtR.value.alts || []; }
    else if (mmR.status === "fulfilled") translated = mmR.value.translated;
    if (!local) {
      if (translated) { de = fromDe ? q : translated; en = fromDe ? translated : q; }
      else {
        return { query: q, fromDe, de: fromDe ? q : "", en: fromDe ? "" : q, gender: null,
          examples: [], via: "error", idx: 0, suggestions: suggestions(q) };
      }
    }
    if (mmR.status === "fulfilled") examples.push(...mmR.value.examples.map(x => ({ ...x, src: "mm" })));

    // 2) sentences need the GERMAN term — search corpora + AI writer in parallel
    const term = stripArticle(fromDe ? q : (de || q));
    const needAi = examples.length < 3; // keep the sheet stocked even when the corpus is thin
    const [tatoR, aiR] = await Promise.allSettled([
      tatoebaExamples(term),
      needAi ? aiExamples(term, en || q) : Promise.resolve([])
    ]);
    if (tatoR.status === "fulfilled") srcs.tatoeba = tatoR.value.length > 0;
    if (tatoR.status === "fulfilled" && tatoR.value.length) {
      const tato = tatoR.value.map(x => ({ ...x, src: "tatoeba" }));
      // natural corpus sentences first, right after the course example
      const course = examples.filter(x => x.src === "course");
      const rest = examples.filter(x => x.src !== "course");
      examples = [...course, ...tato, ...rest.filter(x => !tato.some(t => t.de === x.de))];
    }
    if (aiR.status === "fulfilled") srcs.ai = aiR.value.length > 0;
    if (aiR.status === "fulfilled" && aiR.value.length) {
      const ai = aiR.value.filter(a => !examples.some(e => e.de === a.de));
      const course = examples.filter(x => x.src === "course");
      const tato = examples.filter(x => x.src === "tatoeba");
      const rest = examples.filter(x => x.src !== "course" && x.src !== "tatoeba");
      examples = [...course, ...tato, ...ai, ...rest];
    }

    const res = finish(q, fromDe, de, en, gender, examples, via, false, key);
    res.alts = alts;
    res.sources = srcs;
    return res;
  }

  function finish(query, fromDe, de, en, gender, examples, via, offline, cacheKey) {
    // dedupe + prefer containing the queried term
    const term = stripArticle(fromDe ? query : de).toLowerCase();
    const seen = new Set();
    examples = examples.filter(x => x.de && !seen.has(x.de) && seen.add(x.de));
    examples.sort((a, b) => (b.de.toLowerCase().includes(term) - a.de.toLowerCase().includes(term)));
    const res = { query, fromDe, de, en, gender, examples: examples.slice(0, 10), via, offline: !!offline, idx: 0 };
    if (cacheKey) { cache[cacheKey] = res; saveCache(); }
    return res;
  }

  return { lookup, detectGerman };
})();

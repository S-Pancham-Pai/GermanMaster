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
    const t = " " + text.trim().toLowerCase() + " ";
    if (/[äöüß]/.test(t)) return true;
    const words = ["der ", "die ", "das ", "ich ", "du ", "und ", "nicht ", "mit ", "für ", "ein ", "eine ", "ist ", "wie ", "was ", "guten ", "vielen "];
    return words.some(w => t.includes(w));
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
          local.exampleDe ? [{ de: local.exampleDe, en: local.exampleEn }] : [], "course", true);
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
          local.exampleDe ? [{ de: local.exampleDe, en: local.exampleEn }] : [], "course", true);
      }
      return {
        query: q, fromDe, de: fromDe ? q : "", en: fromDe ? "" : q,
        gender: null, examples: [], via: "noresult", offline: true, idx: 0,
        suggestions: suggestions(q)
      };
    }

    // online path
    const local = lookupLocal(q);
    let de = fromDe ? q : "", en = fromDe ? "" : q, gender = local ? local.gender : null;
    let examples = [];
    let via = "live";

    if (local) { de = local.de; en = local.en; via = "course"; }
    try {
      const mm = await myMemoryTranslate(q, fromDe);
      if (local && (fromDe || !local)) { /* translation already known locally; still harvest examples */ }
      if (!local) { de = fromDe ? q : stripArticle(mm.translated); en = fromDe ? mm.translated : q; }
      examples = mm.examples;
    } catch (e) {
      if (!local) {
        return { query: q, fromDe, de: fromDe ? q : "", en: fromDe ? "" : q, gender: null,
          examples: [], via: "error", idx: 0, suggestions: suggestions(q) };
      }
    }
    if (local && local.exampleDe) examples.unshift({ de: local.exampleDe, en: local.exampleEn });
    // best examples: Tatoeba real sentences
    try {
      const tato = await tatoebaExamples(fromDe ? q : (de || q));
      if (tato.length) examples = [...tato, ...examples.filter(x => !tato.some(t => t.de === x.de))];
    } catch (_) { /* tatoeba optional */ }

    return finish(q, fromDe, de, en, gender, examples, via, false, key);
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

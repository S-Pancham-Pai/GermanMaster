const Translate = (() => {
  const cache = new Map();

  function detectGerman(text) {
    const t = text.trim();
    if (/[äöüßÄÖÜ]/.test(t)) return true;
    if (/^(der|die|das|ich|du|wir|ihr|ein|eine|und|nicht|mit)\b/i.test(t)) return true;
    const endings = ["ung", "keit", "heit", "schaft", "chen", "lein"];
    return endings.some(e => t.toLowerCase().endsWith(e)) && t[0] === t[0].toUpperCase();
  }

  function offlineLookup(text) {
    const q = text.trim().toLowerCase();
    const items = Curriculum.allItems();
    const hit = items.find(it =>
      it.de.toLowerCase() === q ||
      it.en.toLowerCase() === q ||
      it.de.toLowerCase().replace(/^(der|die|das)\s+/, "") === q ||
      it.en.toLowerCase().includes(q) && q.length > 3
    );
    return hit || null;
  }

  async function lookup(text) {
    const q = text.trim();
    if (!q) return null;
    if (cache.has(q.toLowerCase())) return cache.get(q.toLowerCase());

    const fromDe = detectGerman(q);
    const off = offlineLookup(q);
    let result;

    if (off) {
      result = {
        source: fromDe ? "de" : "en",
        de: off.de,
        en: off.en,
        gender: off.gender,
        ipa: off.ipa,
        exampleDe: off.exampleDe,
        exampleEn: off.exampleEn,
        via: "curriculum"
      };
    } else if (Store.get().settings.onlineDict) {
      try {
        const pair = fromDe ? "de|en" : "en|de";
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(q)}&langpair=${pair}`;
        const res = await fetch(url);
        const json = await res.json();
        const translated = json?.responseData?.translatedText || "";
        let exampleDe = "", exampleEn = "";
        const matches = json?.matches || [];
        for (const m of matches) {
          if (m.segment && m.segment.includes(" ") && m.segment.length > 12) {
            if (fromDe) { exampleDe = m.segment; exampleEn = m.translation; }
            else { exampleEn = m.segment; exampleDe = m.translation; }
            break;
          }
        }
        const de = fromDe ? q : translated;
        const en = fromDe ? translated : q;
        if (!exampleDe) {
          exampleDe = `Ich benutze das Wort „${de.replace(/^(der|die|das)\s+/i, "")}“ jeden Tag.`;
          exampleEn = `I use the word “${en}” every day.`;
        }
        result = { source: fromDe ? "de" : "en", de, en, gender: null, ipa: "", exampleDe, exampleEn, via: "live" };
      } catch (_) {
        result = fallback(q, fromDe);
      }
    } else {
      result = fallback(q, fromDe);
    }

    cache.set(q.toLowerCase(), result);
    return result;
  }

  function fallback(q, fromDe) {
    return {
      source: fromDe ? "de" : "en",
      de: fromDe ? q : q,
      en: fromDe ? q : q,
      gender: null,
      ipa: "",
      exampleDe: `Probier „${q}“ in einem kurzen Satz.`,
      exampleEn: `Try “${q}” in a short sentence.`,
      via: "offline"
    };
  }

  return { lookup, detectGerman, offlineLookup };
})();

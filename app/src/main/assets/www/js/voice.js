/* German voice with three layers, best first:
   1. Native Android TTS bridge (offline, authentic Google TTS voice on device)
   2. Google Translate speech endpoint over the network (authentic native MP3)
   3. Browser speechSynthesis with a real de-DE voice (preview fallback)
*/
const Voice = (() => {
  let audio = null;
  let speaking = false;
  let seq = 0; // bumping this aborts any running speakLines chain
  const hasNative = typeof window.AndroidVoice !== "undefined";

  function chunks(text, max = 190) {
    const clean = String(text).replace(/\s+/g, " ").trim();
    if (clean.length <= max) return [clean];
    const parts = clean.match(/[^.!?…]+[.!?…]*/g) || [clean];
    const out = [];
    let cur = "";
    for (const p of parts) {
      if ((cur + " " + p).trim().length > max && cur) { out.push(cur.trim()); cur = p; }
      else cur = (cur + " " + p).trim();
    }
    if (cur) out.push(cur.trim());
    return out.flatMap(c => c.length > max ? c.match(new RegExp(`.{1,${max}}(\\s|$)`, "g")) || [c] : [c]);
  }

  function speakNative(text, lang, slow) {
    try {
      const rate = slow ? 0.55 : (Store.get().settings.speechRate || 0.95);
      window.AndroidVoice.speak(text, lang, rate);
      speaking = true;
      // no end callback from the bridge; estimate duration
      const ms = Math.max(700, text.length * 95 / rate);
      setTimeout(() => { speaking = false; }, ms);
      return true;
    } catch (_) { return false; }
  }

  function speakGoogle(text, lang, slow, onend) {
    return new Promise((resolve) => {
      if (!navigator.onLine) return resolve(false);
      const parts = chunks(text);
      let i = 0;
      const rate = slow ? 0.55 : Math.min(1.25, Math.max(0.5, Store.get().settings.speechRate || 0.95));
      const playNext = () => {
        if (i >= parts.length) { speaking = false; onend && onend(); return resolve(true); }
        if (!audio) audio = new Audio();
        speaking = true;
        audio.src = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${lang}&q=${encodeURIComponent(parts[i++])}`;
        audio.playbackRate = rate;
        audio.onended = playNext;
        audio.onerror = () => resolve(playFallback(text, lang, slow, onend));
        const p = audio.play();
        if (p && p.catch) p.catch(() => resolve(playFallback(text, lang, slow, onend)));
      };
      playNext();
    });
  }

  function playFallback(text, lang, slow, onend) {
    if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) return false;
    return withVoices((voices) => {
      stop();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang;
      u.rate = slow ? 0.6 : (Store.get().settings.speechRate || 0.95);
      const v = voices.find(v => v.lang && v.lang.toLowerCase().startsWith(lang.slice(0, 2)));
      if (v) u.voice = v;
      u.onend = () => { speaking = false; onend && onend(); };
      speaking = true;
      speechSynthesis.speak(u);
      return true;
    });
  }

  let voicesCache = null;
  function withVoices(cb) {
    const v = voicesCache || (window.speechSynthesis ? speechSynthesis.getVoices() : []);
    if (v && v.length) return cb(v);
    let tries = 0;
    const t = setInterval(() => {
      const list = speechSynthesis.getVoices();
      if (list.length || ++tries > 10) {
        clearInterval(t);
        voicesCache = list;
        cb(list);
      }
    }, 100);
    speechSynthesis.onvoiceschanged = () => { voicesCache = speechSynthesis.getVoices(); };
    return true;
  }

  function speak(text, opts = {}) {
    if (!text) return;
    const lang = opts.lang || "de";
    const full = lang.includes("-") ? lang : (lang === "de" ? "de-DE" : "en-US");
    const slow = !!opts.slow;
    const onend = opts.onend || null;
    if (hasNative) { speakNative(text, full, slow); onend && setTimeout(onend, Math.max(600, text.length * 90)); return; }
    speakGoogle(text, lang === "de" ? "de" : "en", slow, onend);
  }

  function stop() {
    seq++;
    try {
      if (hasNative) window.AndroidVoice.stop();
      if (audio) { audio.pause(); audio.src = ""; }
      if (window.speechSynthesis) speechSynthesis.cancel();
    } catch (_) { /* noop */ }
    speaking = false;
  }

  function speakLines(lines, opts = {}) {
    const slow = !!opts.slow;
    const mySeq = ++seq;
    let idx = 0;
    const step = () => {
      if (mySeq !== seq || idx >= lines.length) {
        if (idx >= lines.length && mySeq === seq) opts.ondone && opts.ondone();
        return;
      }
      const line = lines[idx];
      opts.online && opts.online(idx);
      speak(line.de, { lang: "de", slow });
      const rate = slow ? 0.6 : (Store.get().settings.speechRate || 0.95);
      idx += 1;
      setTimeout(step, Math.max(1400, line.de.length * 105 / rate + 900));
    };
    step();
    return () => { if (mySeq === seq) seq++; stop(); };
  }

  const status = () => hasNative ? "native" : (navigator.onLine ? "google" : (window.speechSynthesis ? "device" : "none"));

  if (window.speechSynthesis) withVoices(() => {});
  return { speak, stop, speakLines, status, hasNative };
})();

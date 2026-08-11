const TTS = {
  speak(text, lang = "de-DE") {
    if (!text || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = Store.get().settings.speechRate || 0.92;
    const voices = speechSynthesis.getVoices();
    const match = voices.find(v => v.lang.startsWith(lang.slice(0, 2)));
    if (match) u.voice = match;
    speechSynthesis.speak(u);
  },
  stop() {
    if (window.speechSynthesis) speechSynthesis.cancel();
  }
};
if (window.speechSynthesis) speechSynthesis.getVoices();

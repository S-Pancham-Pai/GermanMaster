/* Shared helpers (loaded first) */
const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function unique(arr) { return [...new Set(arr)]; }
function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }

/* Tolerant German comparison: umlauts/ß fallbacks, punctuation, case */
function normalize(s) {
  return String(s ?? "").trim().toLowerCase()
    .replace(/[.…?!„“"»«']/g, "")
    .replace(/\s+/g, " ");
}
function deFold(s) {
  return normalize(s)
    .replace(/ä/g, "a").replace(/ö/g, "o").replace(/ü/g, "u").replace(/ß/g, "ss");
}
function looseEq(a, b, alts = []) {
  const A = normalize(a), B = normalize(b);
  if (A === B) return true;
  if (deFold(a) === deFold(b)) return true; // tolerate missing umlauts
  return alts.some(x => normalize(x) === A || deFold(x) === deFold(a));
}
/* small edit-distance for near-miss feedback */
function lev(a, b) {
  a = normalize(a); b = normalize(b);
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}
function esc(s) {
  return String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}
function escAttr(s) { return esc(s); }
function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function dayDiff(aKey, bKey) {
  return Math.round((new Date(bKey) - new Date(aKey)) / 86400000);
}

/* --- inline SVG icon set (Material-ish) --- */
function icon(name) {
  const P = {
    back: `<path d="M15 6l-6 6 6 6"/>`,
    next: `<path d="M9 6l6 6-6 6"/>`,
    play: `<path d="M8 5v14l11-7z"/>`,
    slow: `<path d="M12 3a9 9 0 1 0 9 9h-2a7 7 0 1 1-7-7z"/><path d="M12 7v5l3.5 2"/>`,
    speaker: `<path d="M4 10v4h4l5 4V6L8 10H4z"/><path d="M16.5 9.5a3.5 3.5 0 0 1 0 5M18.5 7a7 7 0 0 1 0 10"/>`,
    check: `<path d="M5 12.5l4.5 4.5L19 7"/>`,
    close: `<path d="M6 6l12 12M18 6L6 18"/>`,
    quote: `<path d="M7 17h4l2-5V7H5v5h4zm8 0h4l2-5V7h-8v5h4z" fill="currentColor" stroke="none"/>`,
    shuffle: `<path d="M4 7h4l8 10h4m0 0-2-2m2 2-2 2M4 17h4l2-2.5M14 9.5 16 7h4m0 0-2-2m2 2-2 2"/>`,
    enter: `<path d="M20 5v6H6m0 0 3.5-3.5M6 11l3.5 3.5"/><path d="M20 17H9"/>`,
    lock: `<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>`,
    star: `<path d="M12 3.5l2.7 5.4 6 .9-4.3 4.2 1 5.9-5.4-2.8-5.4 2.8 1-5.9L3.3 9.8l6-.9z"/>`,
    flame: `<path d="M12 3c1 3-2 4.5-2 7a4.5 4.5 0 0 0 9 .5C19 7 14 6 12 3z"/><path d="M10.5 21a5.5 5.5 0 0 1-5-5.5C5.5 12 8 10 9 8"/>`,
    mic: `<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7"/>`,
    eye: `<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>`,
    translate: `<path d="M4 6h9M8.5 4v2c0 3.5-2.4 6.6-5 8"/><path d="M6.5 9.5c1 2.4 3.3 4.6 6 5.5"/><path d="M12.5 20l4-9 4 9M14 17h5"/>`,
    book: `<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 5.5v15"/>`,
    bolt: `<path d="M13 3 5 13.5h5L11 21l8-10.5h-5z"/>`,
    refresh: `<path d="M20 11a8 8 0 1 0-2.3 6.3M20 5v6h-6"/>`,
    map: `<path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6z"/><path d="M9 4v14M15 6v14"/>`,
    user: `<circle cx="12" cy="8" r="3.4"/><path d="M5 20a7.5 7.5 0 0 1 14 0"/>`,
    calendar: `<rect x="4" y="6" width="16" height="15" rx="2.5"/><path d="M4 10.5h16M8 3.5V7M16 3.5V7"/>`,
    plus: `<path d="M12 5v14M5 12h14"/>`,
    flag: `<path d="M5 21V4"/><path d="M5 4h13l-2.5 4L18 12H5"/>`,
    ear: `<path d="M6 9a6 6 0 1 1 12 0c0 4-4 4.5-4 8a3 3 0 0 1-6 0"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 2-2.5 2.5-2.5 5"/>`,
    pen: `<path d="M4 20l1-4L16 5l3 3L8 19z"/><path d="M13.5 7.5l3 3"/>`,
    chat: `<path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8l-4 4z"/>`,
    grad: `<path d="M12 4 2.5 8.5 12 13l9.5-4.5z"/><path d="M6.5 10.5V16c0 1.5 2.5 3 5.5 3s5.5-1.5 5.5-3v-5.5"/>`,
    heart: `<path d="M12 20s-7.5-4.6-7.5-9.5A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 3.5C19.5 15.4 12 20 12 20z"/>`,
    sparkle: `<path d="M12 3.5l1.9 5.1L19 10.5l-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9z"/><path d="M18.8 15.2l.8 2.1 2.1.8-2.1.8-.8 2.1-.8-2.1-2.1-.8 2.1-.8z"/>`
  };
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${P[name] || P.star}</svg>`;
}

# GermanMaster

A focused German course — A1 to C2 — with a clean learning map, quizzes that actually gate the next tile, and an Apple-Translate-style word explorer.

## Try it

Open the live preview, or from this folder:

```bash
python3 -m http.server 4173 --directory web --bind 0.0.0.0
```

Then visit `http://localhost:4173`.

## How it works

- **Learn** — A1 opens first. Vocab, grammar, listen, speak, read, write. Each tile unlocks only after you score 80%+ on the one before it. A2 stays locked until A1 is 80% done. Higher levels reuse earlier words on purpose.
- **Explore** — Type English on top or German below. The other side fills in. A small quote button appears after a word; tap it (or scroll) for a sentence.
- **You** — Pixel-style settings. Review is fused into Learn, not a fourth tab.

Progress lives in the browser (`localStorage`). Reset it from You → Data.

## Android

The same UI is bundled in `app/src/main/assets/www`. Open the project in Android Studio and Run. `MainActivity` loads that WebView.

Internet permission is only used by Explore when live translation is on.

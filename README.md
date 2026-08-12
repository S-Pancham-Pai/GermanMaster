# GermanMaster

A German course that behaves like a tutor, not a quiz dump. Native Android shell (WebView) around a self-contained web app — no servers, no accounts, everything on-device.

## The six sections

| Section | What it is |
|---|---|
| **Learn** | CEFR map: level → unit → stage. Every stage runs the full cycle: **Mission → Context → Notice → Cards → Practice → Recall → Listening → Produce → Result**. Unlock = 80% (configurable). A2 opens only after A1's checkpoint. |
| **Review** | Spaced repetition queue, automatically filled with every word you see and every word you miss. Intervals: 10 min → 1 → 3 → 7 → 14 → 30 days. |
| **Practice** | Free drills built by reusable engines: word sprint, listening, der/die/das, sentence doctor (error repair), shadowing. Feeds on everything you've unlocked. |
| **Stories** | Graded mini-stories with read-aloud (normal/slow), toggleable translation, comprehension checks, one-tap "add words to Review". |
| **Explore** | Two-way EN ⇄ DE. Type + Go. Example sentences are real ones (Tatoeba corpus), never templates. |
| **You** | Skill bars (vocabulary / grammar / listening / speaking / reading / writing), "needs work", misses, streak, settings. |

## German voice

1. **Native device TTS** via `AndroidVoice` JS bridge (offline, authentic) inside the APK.
2. Google Translate speech endpoint (online) — in browsers and as a fallback.
3. `speechSynthesis` as a last resort.

## How it's built

```
web/                     → the app (source of truth)
  js/data.js             → curriculum: A1 deep (13 units, 57 stages), A2/B1/B2/C1/C2
  js/banks.js            → 429 curated word/phrase items with examples
  js/engines.js          → reusable activity engines + session runner
  js/stage.js            → the learning-cycle flow
  js/voice.js            → layered German TTS
  js/translate.js        → course → MyMemory → Tatoeba lookup
app/src/main/assets/www  → byte-identical copy bundled into the APK
app/.../MainActivity.kt  → WebView + native TTS bridge
```

## Build

GitHub Actions builds the debug APK on every push (workflow `build.yml`, artifact `GermanMasterM3-APK`).
Locally: `./gradlew assembleDebug`.

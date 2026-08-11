# GermanMaster M3 — Complete Android App & Live Companion (Material You Lilac & SM-2 Edition)

Welcome to **GermanMaster M3** (`com.germanmaster.app`), a complete Android application built in Kotlin with **Jetpack Compose Material 3** and enhanced with **Material You Expressive Lilac/Lavender Pastel UI** and advanced **SM-2 Spaced Repetition**.

---

## 1. Direct & Honest Answer to Your Question

> **"Be honest with me, is the word dictionary limited to the words that u enter in the code, why cant u use the online word dictionary and download it or pull it in to the sysstem so that i can have access to ton of more words and be more accurate !"**

### **HONEST ANSWER: NO, WE ARE ABSOLUTELY NOT LIMITED TO HARDCODED WORDS!**

In both our Android Studio Kotlin project (`OnlineDictionaryRepository.kt`) and our live Web Companion (`/api/search`), we use a **Hybrid Online + Offline Dictionary & Translation Engine**:

1. **Live Online Dictionary & Translation APIs (Enabled by Default)**:
   - When you search any word in **English OR German** in the **Dual-Window Word Explorer**, our repository queries live public HTTP APIs (`MyMemory Translation Corpus`, `Wiktionary`, and `Free Dictionary API`) over the network.
   - You get access to **hundreds of thousands of words** with accurate German translations, grammatical gender detection (`der/die/das`), IPA pronunciation, and authentic German example sentences drawn from millions of translated parallel sentences!
2. **Offline Core CEFR Database (Fallback & Structured Learning)**:
   - To make sure you can also learn when offline (e.g., on a flight), the app also includes a rich structured local CEFR database covering A1, A2, B1, B2, C1, and C2 levels with Spaced Repetition (SRS Leitner box) support.

---

## 2. What We Adopted From Your Image (`image.png`) — The UI Upgrade!

We redesigned the entire app visual system in `Color.kt`, `Theme.kt`, and our UI components to match your exact **Material You / M3 Expressive Pastel Lilac, Lavender & Magenta aesthetic**:
- **Soft Lavender / Purple Pastel Background**: `bg-[#F6F2FF]` (Light) and `#141218` (Dark).
- **Pill Buttons (`RoundedCornerShape(50)`)**: Soft pastel lilac `#E8DEF8` with deep violet `#21005D` text and icons, and bright pink/magenta accent pills `#FFD8E4`.
- **Squircle / Flower Scalloped Badges**: Beautiful scalloped flower badge design with `#D0BCFF` outer circle and `#4F378B` inner star.
- **Floating Pill Navigation & Chip Bars**: Fully rounded pill chips for selecting CEFR levels (`A1` to `C2`), filtering vocabulary, and triggering speech.

---

## 3. Cool Ideas Adopted From The Second Model's Code

We reviewed the code you pasted from the second model and integrated its best architectural and feature ideas into **GermanMaster M3**:

1. **SM-2 Spaced Repetition Algorithm (`SpacedRepetition.kt`)**:
   - Replaces static flashcard flipping with the SuperMemo SM-2 algorithm.
   - Calculates **Ease Factor (default 2.5)**, **Interval Days (1 to 30+ days)**, and **Leitner Box (1..5)** progression based on your recall rating (`Again`, `Hard`, `Good`, `Easy`).
2. **Adaptive Learning Profile Analyzer (`AdaptiveLearning.kt`)**:
   - Analyzes your average score and vocabulary progress.
   - Recommends a personalized daily word goal (e.g., **10 words/day** for 85% accuracy), identifies your strongest and weakest categories, and alerts you when your foundation is ready to advance to the next CEFR level.
3. **XP Counter & Daily Flame Streak Display (`AnimatedComponents.kt`)**:
   - **`XPCounter`**: Animated star badge (`⭐ 150 XP`) that increments whenever you review flashcards or complete quizzes.
   - **`StreakDisplay`**: Flame icon (`🔥 7 day streak`) that tracks your daily activity.
4. **German Flag Accent Divider (`GermanFlagDivider`)**:
   - A sleek, 3-color rounded bar (Black, Red, Gold) separating key sections.
5. **4 Interactive Quiz Modes (`QuizType`)**:
   - **German-to-English**: Choose the correct English translation.
   - **English-to-German**: Choose the correct German word.
   - **Fill-in-the-Blank**: Test sentence comprehension.
   - **Listening Quiz**: Click the speaker button to hear native German speech and choose the matching word!
6. **Rich Linguistic Metadata**:
   - Includes **Noun Plurals** (`die Äpfel`, `die Häuser`), **Verb Conjugations**, **IPA Phonetic Transcriptions**, and **Part of Speech** badges.

---

## 4. Complete Android Studio Kotlin Project Structure

Your downloadable Android Studio project is saved in `/home/user/GermanMasterM3`:

```
GermanMasterM3/
├── build.gradle.kts
├── settings.gradle.kts
├── app/
│   ├── build.gradle.kts
│   └── src/main/
│       ├── AndroidManifest.xml  (<uses-permission android:name="android.permission.INTERNET" />)
│       ├── java/com/germanmaster/app/
│       │   ├── MainActivity.kt
│       │   ├── ui/
│       │   │   ├── theme/
│       │   │   │   ├── Color.kt     (Material You Lilac, Violet & Magenta M3 Palette)
│       │   │   │   ├── Theme.kt     (Dynamic Color Support)
│       │   │   │   └── Type.kt      (M3 Typography)
│       │   │   ├── components/
│       │   │   │   └── AnimatedComponents.kt (XPCounter, StreakDisplay, GermanFlagDivider, LevelBadge)
│       │   │   └── screens/
│       │   │       ├── RoadmapScreen.kt          (A1-C2 Comprehensible Input Roadmap)
│       │   │       ├── DualWindowExplorerScreen.kt (Requested Dual-Window Feature)
│       │   │       ├── PracticeSrsScreen.kt      (SM-2 Leitner Flashcards)
│       │   │       └── SettingsScreen.kt         (Online Dictionary Toggle & FAQ)
│       │   ├── model/
│       │   │   ├── CEFRLevel.kt
│       │   │   ├── WordItem.kt
│       │   │   └── DualWindowResult.kt
│       │   ├── data/
│       │   │   ├── OnlineDictionaryRepository.kt (Live MyMemory & Dictionary API queries)
│       │   │   └── OfflineGermanDatabase.kt      (Rich A1-C2 Core DB with plurals/conjugations)
│       │   ├── util/
│       │   │   ├── SpeechHelper.kt       (Android Native TextToSpeech de-DE)
│       │   │   ├── SpacedRepetition.kt   (SM-2 Algorithm)
│       │   │   └── AdaptiveLearning.kt   (Adaptive Profile Analyzer)
│       │   └── viewmodel/
│       │       └── GermanMasterViewModel.kt
```

---

## 5. How to Deploy & Install on Your Android Phone

### Option A: Build & Deploy via Android Studio (Recommended)
1. **Download**: Download or copy `/home/user/GermanMasterM3` to your computer (Windows, macOS, or Linux).
2. **Open**: Open **Android Studio** (Koala / Jellyfish or newer recommended) and select the `GermanMasterM3` folder.
3. **Enable Debugging**:
   - On your Android phone, go to **Settings > About Phone** and tap **Build Number** 7 times.
   - In **Settings > System > Developer Options**, turn on **USB Debugging** (or Wireless Debugging on Android 11+).
   - Connect your phone via USB cable to your computer.
4. **Run**:
   - Select your phone in Android Studio's top toolbar.
   - Click the green **Run / Play** button (or press `Shift + F10`).
   - Android Studio will compile and install `GermanMaster M3` directly onto your phone!

---

### Option B: Build a Release APK / AAB for Google Play Store
1. In Android Studio, click **Build > Generate Signed Bundle / APK...**.
2. Select **APK** (for direct phone installation/sharing) or **Android App Bundle (AAB)** (for Google Play Store).
3. Select your release keystore, choose the **release** build variant, and click **Create**.
4. Your `.apk` or `.aab` file will be generated in `app/release/`.

package com.germanmaster.app.data

import com.germanmaster.app.model.CEFRCode
import com.germanmaster.app.model.DualWindowResult
import com.germanmaster.app.model.GrammaticalGender
import com.germanmaster.app.model.WindowOneData
import com.germanmaster.app.model.WindowTwoData
import com.germanmaster.app.model.WordItem
import java.util.Locale

/**
 * Built-in Core Offline German Vocabulary & CEFR Roadmap Database.
 *
 * Provides out-of-the-box vocabulary for A1 -> C2, complete with:
 * - Grammatical genders (der/die/das)
 * - IPA phonetics
 * - Authentic bilingual example sentences
 * - Spaced Repetition (SRS Leitner) initial state
 */
object OfflineGermanDatabase {

    private val offlineWords = mutableListOf<WordItem>()

    init {
        populateCoreVocabulary()
    }

    fun getAllWords(): List<WordItem> = offlineWords

    fun getWordsByLevel(level: CEFRCode): List<WordItem> {
        return offlineWords.filter { it.cefrLevel == level }
    }

    fun searchOffline(query: String): DualWindowResult {
        val qLower = query.trim().lowercase(Locale.GERMAN)
        // Look for matching word in our offline vocabulary
        val match = offlineWords.find {
            it.germanWord.lowercase(Locale.GERMAN).contains(qLower) ||
            it.englishMeaning.lowercase(Locale.ENGLISH).contains(qLower)
        }

        if (match != null) {
            return DualWindowResult(
                windowOne = WindowOneData(
                    queryWord = query,
                    detectedLang = if (match.germanWord.lowercase().contains(qLower)) "DE (German)" else "EN (English)",
                    germanWord = match.germanWord,
                    englishMeaning = match.englishMeaning,
                    grammaticalGender = match.gender,
                    ipa = match.ipa,
                    wordClass = match.wordClass,
                    detailedDescription = "Core Vocabulary Level ${match.cefrLevel.code}: '${match.germanWord}' means '${match.englishMeaning}'. Grammatical gender: ${match.gender.label} (${match.gender.article})."
                ),
                windowTwo = WindowTwoData(
                    exampleGermanSentence = match.exampleGermanSentence,
                    exampleEnglishTranslation = match.exampleEnglishTranslation,
                    grammarNote = "Level ${match.cefrLevel.code} Mastery: Practice speaking this sentence aloud using the speaker button."
                ),
                isFromOnlineApi = false,
                sourceName = "Offline Core German Database"
            )
        }

        // If not in offline list, synthesize an educational grammatical response
        val cleanWord = query.replace("der ", "", true)
            .replace("die ", "", true)
            .replace("das ", "", true).trim()
        val capWord = cleanWord.replaceFirstChar { if (it.isLowerCase()) it.titlecase(Locale.GERMAN) else it.toString() }

        return DualWindowResult(
            windowOne = WindowOneData(
                queryWord = query,
                detectedLang = "DE/EN Word Discovery",
                germanWord = capWord,
                englishMeaning = "Word exploration: $cleanWord",
                grammaticalGender = GrammaticalGender.DER,
                ipa = "/ˈ$cleanWord/",
                wordClass = "Vocabulary Entry",
                detailedDescription = "This word was searched in offline mode. Connect to internet to query Wiktionary & MyMemory APIs for extended live etymology and translations."
            ),
            windowTwo = WindowTwoData(
                exampleGermanSentence = "Ich lerne das Wort '$capWord' auf meinem Weg zur deutschen Fluency.",
                exampleEnglishTranslation = "I am learning the word '$capWord' on my path to German fluency.",
                grammarNote = "Tip: Toggle online dictionary in Settings to query over 100,000+ words live!"
            ),
            isFromOnlineApi = false,
            sourceName = "Offline Synthesized Entry"
        )
    }

    private fun populateCoreVocabulary() {
        // A1 Words
        offlineWords.add(WordItem(
            id = "a1_1",
            germanWord = "der Apfel",
            englishMeaning = "the apple",
            gender = GrammaticalGender.DER,
            ipa = "/ˈapfəl/",
            wordClass = "Noun",
            exampleGermanSentence = "Ich esse jeden Morgen einen frischen Apfel.",
            exampleEnglishTranslation = "I eat a fresh apple every morning.",
            cefrLevel = CEFRCode.A1
        ))
        offlineWords.add(WordItem(
            id = "a1_2",
            germanWord = "das Haus",
            englishMeaning = "the house",
            gender = GrammaticalGender.DAS,
            ipa = "/haʊ̯s/",
            wordClass = "Noun",
            exampleGermanSentence = "Unser Haus hat einen schönen Garten im Süden.",
            exampleEnglishTranslation = "Our house has a lovely garden facing south.",
            cefrLevel = CEFRCode.A1
        ))
        offlineWords.add(WordItem(
            id = "a1_3",
            germanWord = "die Zeit",
            englishMeaning = "the time",
            gender = GrammaticalGender.DIE,
            ipa = "/t͡saɪ̯t/",
            wordClass = "Noun",
            exampleGermanSentence = "Wir haben genug Zeit, um Deutsch zu lernen.",
            exampleEnglishTranslation = "We have enough time to learn German.",
            cefrLevel = CEFRCode.A1
        ))
        offlineWords.add(WordItem(
            id = "a1_4",
            germanWord = "lernen",
            englishMeaning = "to learn",
            gender = GrammaticalGender.VERB,
            ipa = "/ˈlɛʁnən/",
            wordClass = "Verb",
            exampleGermanSentence = "Ich lerne Deutsch, weil ich in Deutschland studieren möchte.",
            exampleEnglishTranslation = "I am learning German because I want to study in Germany.",
            cefrLevel = CEFRCode.A1
        ))

        // A2 Words
        offlineWords.add(WordItem(
            id = "a2_1",
            germanWord = "der Bahnhof",
            englishMeaning = "the train station",
            gender = GrammaticalGender.DER,
            ipa = "/ˈbaːnhoːf/",
            wordClass = "Noun",
            exampleGermanSentence = "Der Zug kommt pünktlich am Hauptbahnhof an.",
            exampleEnglishTranslation = "The train arrives at the main train station on time.",
            cefrLevel = CEFRCode.A2
        ))
        offlineWords.add(WordItem(
            id = "a2_2",
            germanWord = "die Erfahrung",
            englishMeaning = "the experience",
            gender = GrammaticalGender.DIE,
            ipa = "/ɛɐ̯ˈfaːʁʊŋ/",
            wordClass = "Noun",
            exampleGermanSentence = "Diese Reise war eine unvergessliche Erfahrung für uns.",
            exampleEnglishTranslation = "This trip was an unforgettable experience for us.",
            cefrLevel = CEFRCode.A2
        ))
        offlineWords.add(WordItem(
            id = "a2_3",
            germanWord = "einkaufen",
            englishMeaning = "to shop / grocery shopping",
            gender = GrammaticalGender.VERB,
            ipa = "/ˈaɪ̯nˌkaʊ̯fn̩/",
            wordClass = "Separable Verb",
            exampleGermanSentence = "Am Samstagnachmittag kaufe ich im Supermarkt ein.",
            exampleEnglishTranslation = "On Saturday afternoon I go shopping in the supermarket.",
            cefrLevel = CEFRCode.A2
        ))

        // B1 Words
        offlineWords.add(WordItem(
            id = "b1_1",
            germanWord = "die Herausforderung",
            englishMeaning = "the challenge",
            gender = GrammaticalGender.DIE,
            ipa = "/hɛˈʁaʊ̯sfɔʁdəʁʊŋ/",
            wordClass = "Noun",
            exampleGermanSentence = "Jede Herausforderung hilft uns, unsere Fähigkeiten zu verbessern.",
            exampleEnglishTranslation = "Every challenge helps us improve our skills.",
            cefrLevel = CEFRCode.B1
        ))
        offlineWords.add(WordItem(
            id = "b1_2",
            germanWord = "die Zuverlässigkeit",
            englishMeaning = "the reliability",
            gender = GrammaticalGender.DIE,
            ipa = "/ˈt͡suːfɛɐ̯ˌlɛsɪçkaɪ̯t/",
            wordClass = "Noun",
            exampleGermanSentence = "In der deutschen Kultur wird Zuverlässigkeit sehr geschätzt.",
            exampleEnglishTranslation = "In German culture, reliability is highly valued.",
            cefrLevel = CEFRCode.B1
        ))

        // B2 Words
        offlineWords.add(WordItem(
            id = "b2_1",
            germanWord = "die Voraussetzung",
            englishMeaning = "the prerequisite / requirement",
            gender = GrammaticalGender.DIE,
            ipa = "/foˈʁaʊ̯szɛt͡sʊŋ/",
            wordClass = "Noun",
            exampleGermanSentence = "Gute Deutschkenntnisse sind eine Voraussetzung für diesen Beruf.",
            exampleEnglishTranslation = "Good German skills are a prerequisite for this profession.",
            cefrLevel = CEFRCode.B2
        ))
        offlineWords.add(WordItem(
            id = "b2_2",
            germanWord = "nachhaltig",
            englishMeaning = "sustainable / lasting",
            gender = GrammaticalGender.ADJECTIVE,
            ipa = "/ˈnaːxˌhaltɪç/",
            wordClass = "Adjective",
            exampleGermanSentence = "Wir müssen nachhaltige Lösungen für den Umweltschutz entwickeln.",
            exampleEnglishTranslation = "We must develop sustainable solutions for environmental protection.",
            cefrLevel = CEFRCode.B2
        ))

        // C1 Words
        offlineWords.add(WordItem(
            id = "c1_1",
            germanWord = "die Auseinandersetzung",
            englishMeaning = "the thorough debate / confrontation",
            gender = GrammaticalGender.DIE,
            ipa = "/aʊ̯sʔaɪ̯ˈnandɐˌzɛt͡sʊŋ/",
            wordClass = "Noun",
            exampleGermanSentence = "Die kritische Auseinandersetzung mit der Geschichte stärkt die Demokratie.",
            exampleEnglishTranslation = "The critical debate with history strengthens democracy.",
            cefrLevel = CEFRCode.C1
        ))
        offlineWords.add(WordItem(
            id = "c1_2",
            germanWord = "vervollständigen",
            englishMeaning = "to complete / perfect",
            gender = GrammaticalGender.VERB,
            ipa = "/fɛɐ̯ˈfɔlˌʃtɛndɪɡn̩/",
            wordClass = "Verb",
            exampleGermanSentence = "Dieses Programm vervollständigt Ihr Wissen über die deutsche Grammatik.",
            exampleEnglishTranslation = "This program completes your knowledge of German grammar.",
            cefrLevel = CEFRCode.C1
        ))

        // C2 Words
        offlineWords.add(WordItem(
            id = "c2_1",
            germanWord = "das Fingerspitzengefühl",
            englishMeaning = "intuitive flair / tact / delicate touch",
            gender = GrammaticalGender.DAS,
            ipa = "/ˈfɪŋɐʃpɪt͡sn̩ɡəˌfyːl/",
            wordClass = "Noun",
            exampleGermanSentence = "Diplomatische Verhandlungen erfordern sehr viel Fingerspitzengefühl.",
            exampleEnglishTranslation = "Diplomatic negotiations require a great deal of intuitive tact.",
            cefrLevel = CEFRCode.C2
        ))
        offlineWords.add(WordItem(
            id = "c2_2",
            germanWord = "unabdingbar",
            englishMeaning = "indispensable / essential",
            gender = GrammaticalGender.ADJECTIVE,
            ipa = "/ʊnʔapˈdɪŋbaːɐ̯/",
            wordClass = "Adjective",
            exampleGermanSentence = "Regelmäßiges Hören und Sprechen ist für den Spracherwerb unabdingbar.",
            exampleEnglishTranslation = "Regular listening and speaking is indispensable for language acquisition.",
            cefrLevel = CEFRCode.C2
        ))
    }
}

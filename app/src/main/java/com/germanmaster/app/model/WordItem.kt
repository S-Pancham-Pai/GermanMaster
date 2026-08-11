package com.germanmaster.app.model

enum class GrammaticalGender(val label: String, val article: String) {
    DER("Masculine", "der"),
    DIE("Feminine", "die"),
    DAS("Neuter", "das"),
    PLURAL("Plural", "die (pl)"),
    VERB("Verb", ""),
    ADJECTIVE("Adjective", ""),
    OTHER("Other", "")
}

data class WordItem(
    val id: String,
    val germanWord: String,
    val englishMeaning: String,
    val gender: GrammaticalGender,
    val ipa: String,
    val wordClass: String = "Noun",
    val exampleGermanSentence: String,
    val exampleEnglishTranslation: String,
    val cefrLevel: CEFRCode,
    var srsBox: Int = 1, // Leitner box 1 to 5
    var lastReviewedMillis: Long = System.currentTimeMillis(),
    val isFromOnlineApi: Boolean = false
)

package com.germanmaster.app.model

data class WindowOneData(
    val queryWord: String,
    val detectedLang: String, // "DE" or "EN"
    val germanWord: String,
    val englishMeaning: String,
    val grammaticalGender: GrammaticalGender,
    val ipa: String,
    val wordClass: String,
    val detailedDescription: String
)

data class WindowTwoData(
    val exampleGermanSentence: String,
    val exampleEnglishTranslation: String,
    val grammarNote: String
)

data class DualWindowResult(
    val windowOne: WindowOneData,
    val windowTwo: WindowTwoData,
    val isFromOnlineApi: Boolean = true,
    val sourceName: String = "Online German Dictionary & MyMemory Corpus"
)

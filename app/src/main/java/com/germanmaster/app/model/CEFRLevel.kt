package com.germanmaster.app.model

enum class CEFRCode(val code: String, val title: String, val description: String) {
    A1("A1", "Beginner (Anfänger)", "Everyday greetings, basic questions, numbers, and fundamental nouns with der/die/das."),
    A2("A2", "Elementary (Grundlegende Kenntnisse)", "Shopping, daily routines, past tense (Perfekt), and common adjectives."),
    B1("B1", "Intermediate (Fortgeschrittene Sprachverwendung)", "Expressing opinions, travel situations, Nebensätze (dass, weil, obwohl), and separable verbs."),
    B2("B2", "Upper Intermediate (Selbstständige Sprachverwendung)", "Abstract topics, workplace discussions, passive voice, and Konjunktiv II for politeness/wishes."),
    C1("C1", "Advanced (Fachkundige Sprachkenntnisse)", "Academic & professional vocabulary, nuanced expressions, and complex sentence structures."),
    C2("C2", "Mastery (Annähernd muttersprachliche Kenntnisse)", "Idiomatic German, literary expressions, subtle irony, and effortless comprehension.")
}

data class CEFRLevelProgress(
    val level: CEFRCode,
    val isUnlocked: Boolean,
    val wordsLearned: Int,
    val totalWords: Int,
    val masteryPercentage: Float
)

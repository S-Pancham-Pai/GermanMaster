package com.germanmaster.app.util

import com.germanmaster.app.model.CEFRCode

/**
 * Adaptive Learning Profile Analyzer.
 * Taken from the second model's cool ideas to dynamically tailor daily goals,
 * suggest review focuses, and decide when the learner is ready to advance to the next CEFR level.
 */
object AdaptiveLearning {

    data class LearningProfile(
        val averageScore: Float,
        val wordsLearned: Int,
        val currentLevel: CEFRCode,
        val recommendedDailyWords: Int,
        val shouldAdvanceLevel: Boolean,
        val suggestedFocus: String
    )

    fun analyzeLearningProfile(
        averageScore: Float,
        wordsLearned: Int,
        totalWordsInLevel: Int,
        currentLevel: CEFRCode
    ): LearningProfile {
        val progressPercentage = if (totalWordsInLevel > 0) {
            (wordsLearned.toFloat() / totalWordsInLevel * 100f)
        } else 0f

        val shouldAdvance = progressPercentage >= 80f && averageScore >= 75f

        val recommendedDaily = when {
            averageScore >= 90f -> 15
            averageScore >= 70f -> 10
            averageScore >= 50f -> 7
            else -> 5
        }

        val suggestedFocus = when {
            averageScore < 70f -> "Review Leitner Box 1 & 2 flashcards"
            shouldAdvance -> "Ready to advance to next level (${getNextLevel(currentLevel)?.code ?: "Mastery"})!"
            else -> "Continue comprehensible input & Dual-Window Word Explorer"
        }

        return LearningProfile(
            averageScore = averageScore,
            wordsLearned = wordsLearned,
            currentLevel = currentLevel,
            recommendedDailyWords = recommendedDaily,
            shouldAdvanceLevel = shouldAdvance,
            suggestedFocus = suggestedFocus
        )
    }

    fun getNextLevel(currentLevel: CEFRCode): CEFRCode? {
        return when (currentLevel) {
            CEFRCode.A1 -> CEFRCode.A2
            CEFRCode.A2 -> CEFRCode.B1
            CEFRCode.B1 -> CEFRCode.B2
            CEFRCode.B2 -> CEFRCode.C1
            CEFRCode.C1 -> CEFRCode.C2
            CEFRCode.C2 -> null
        }
    }
}

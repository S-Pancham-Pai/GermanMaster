package com.germanmaster.app.util

import com.germanmaster.app.model.WordItem

/**
 * SuperMemo SM-2 Algorithm for Spaced Repetition.
 * Adapted from the second model's cool ideas to calculate adaptive intervals
 * based on user recall quality (0=blackout to 5=perfect recall).
 */
object SpacedRepetition {

    data class SrsResult(
        val newBox: Int,
        val newEaseFactor: Float,
        val newIntervalDays: Int,
        val nextReviewTimestamp: Long
    )

    fun calculateNextReview(
        currentBox: Int,
        currentEaseFactor: Float = 2.5f,
        currentIntervalDays: Int = 1,
        quality: Int // 1 to 5 (1=Again, 2=Hard, 3=Good, 4=Easy, 5=Perfect)
    ): SrsResult {
        val mappedQuality = quality.coerceIn(0, 5)
        val newEaseFactor = maxOf(
            1.3f,
            currentEaseFactor + (0.1f - (5 - mappedQuality) * (0.08f + (5 - mappedQuality) * 0.02f))
        )

        val newInterval = when {
            mappedQuality < 3 -> 1
            currentIntervalDays == 1 -> 1
            currentIntervalDays == 2 -> 6
            else -> (currentIntervalDays * newEaseFactor).toInt()
        }

        val newBox = when {
            mappedQuality < 2 -> 1
            mappedQuality == 2 -> currentBox.coerceAtMost(5)
            else -> (currentBox + 1).coerceAtMost(5)
        }

        return SrsResult(
            newBox = newBox,
            newEaseFactor = newEaseFactor,
            newIntervalDays = newInterval,
            nextReviewTimestamp = System.currentTimeMillis() + (newInterval * 24 * 60 * 60 * 1000L)
        )
    }
}

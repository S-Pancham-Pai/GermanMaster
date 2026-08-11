package com.germanmaster.app.util

import android.content.Context
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import android.util.Log
import java.util.Locale

/**
 * Native Text-to-Speech (TTS) helper for German pronunciation.
 *
 * Provides Google/Apple-translate style native voice synthesis everywhere in the app:
 * - Vocabulary words
 * - Grammar notes
 * - Example sentences
 * - Dual-Window Word Explorer results
 */
class SpeechHelper(context: Context) : TextToSpeech.OnInitListener {

    private var tts: TextToSpeech? = null
    private var isReady = false
    private var speechRate = 1.0f

    init {
        tts = TextToSpeech(context.applicationContext, this)
    }

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            val result = tts?.setLanguage(Locale.GERMAN)
            if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
                Log.e("SpeechHelper", "German locale is missing or not supported on this device TTS engine.")
            } else {
                isReady = true
                tts?.setSpeechRate(speechRate)
            }
        } else {
            Log.e("SpeechHelper", "TextToSpeech initialization failed.")
        }
    }

    /**
     * Speak German text aloud. Can toggle between normal (1.0x) and slow (0.75x) for beginners.
     */
    fun speakGerman(text: String, slow: Boolean = false) {
        if (!isReady || tts == null) {
            Log.w("SpeechHelper", "TTS engine not ready yet.")
            return
        }
        val rate = if (slow) 0.75f else speechRate
        tts?.setSpeechRate(rate)
        tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null, "GermanSpeechUtterance")
    }

    /**
     * Set default speech rate (e.g. 0.85f for learners, 1.0f normal)
     */
    fun setRate(rate: Float) {
        speechRate = rate
        if (isReady) {
            tts?.setSpeechRate(rate)
        }
    }

    fun stop() {
        tts?.stop()
    }

    fun shutdown() {
        tts?.stop()
        tts?.shutdown()
        tts = null
        isReady = false
    }
}

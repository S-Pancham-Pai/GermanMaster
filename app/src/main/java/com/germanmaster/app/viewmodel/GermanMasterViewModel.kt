package com.germanmaster.app.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.germanmaster.app.data.OfflineGermanDatabase
import com.germanmaster.app.data.OnlineDictionaryRepository
import com.germanmaster.app.model.CEFRCode
import com.germanmaster.app.model.CEFRLevelProgress
import com.germanmaster.app.model.DualWindowResult
import com.germanmaster.app.model.WordItem
import com.germanmaster.app.util.SpeechHelper
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class GermanMasterViewModel(application: Application) : AndroidViewModel(application) {

    private val onlineRepo = OnlineDictionaryRepository()
    val speechHelper = SpeechHelper(application.applicationContext)

    // Current CEFR Level Filter on Roadmap
    private val _selectedCefrLevel = MutableStateFlow(CEFRCode.A1)
    val selectedCefrLevel: StateFlow<CEFRCode> = _selectedCefrLevel.asStateFlow()

    // Words for selected level
    private val _roadmapWords = MutableStateFlow<List<WordItem>>(emptyList())
    val roadmapWords: StateFlow<List<WordItem>> = _roadmapWords.asStateFlow()

    // Roadmap level progress summaries
    private val _levelProgressList = MutableStateFlow<List<CEFRLevelProgress>>(emptyList())
    val levelProgressList: StateFlow<List<CEFRLevelProgress>> = _levelProgressList.asStateFlow()

    // Dual Window Explorer State
    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    private val _isSearching = MutableStateFlow(false)
    val isSearching: StateFlow<Boolean> = _isSearching.asStateFlow()

    private val _dualWindowResult = MutableStateFlow<DualWindowResult?>(null)
    val dualWindowResult: StateFlow<DualWindowResult?> = _dualWindowResult.asStateFlow()

    // Online dictionary mode toggle (default True: answer to user's question!)
    private val _isOnlineDictionaryEnabled = MutableStateFlow(true)
    val isOnlineDictionaryEnabled: StateFlow<Boolean> = _isOnlineDictionaryEnabled.asStateFlow()

    // Spaced Repetition (SRS Leitner) Practice Words
    private val _srsWords = MutableStateFlow<List<WordItem>>(emptyList())
    val srsWords: StateFlow<List<WordItem>> = _srsWords.asStateFlow()

    private val _currentCardIndex = MutableStateFlow(0)
    val currentCardIndex: StateFlow<Int> = _currentCardIndex.asStateFlow()

    private val _isCardFlipped = MutableStateFlow(false)
    val isCardFlipped: StateFlow<Boolean> = _isCardFlipped.asStateFlow()

    init {
        loadLevelWords(CEFRCode.A1)
        calculateLevelProgress()
        loadSrsDeck()
        // Perform an initial search so the Dual Window Explorer has a welcoming example
        searchWord("der Bahnhof")
    }

    fun selectCefrLevel(level: CEFRCode) {
        _selectedCefrLevel.value = level
        loadLevelWords(level)
    }

    private fun loadLevelWords(level: CEFRCode) {
        _roadmapWords.value = OfflineGermanDatabase.getWordsByLevel(level)
    }

    private fun calculateLevelProgress() {
        val all = OfflineGermanDatabase.getAllWords()
        val list = CEFRCode.values().mapIndexed { idx, code ->
            val wordsInLevel = all.filter { it.cefrLevel == code }
            val learned = wordsInLevel.count { it.srsBox >= 3 }
            val percent = if (wordsInLevel.isNotEmpty()) (learned.toFloat() / wordsInLevel.size) * 100f else 0f
            CEFRLevelProgress(
                level = code,
                isUnlocked = idx == 0 || (idx > 0 && percent >= 30f),
                wordsLearned = learned,
                totalWords = wordsInLevel.size,
                masteryPercentage = percent
            )
        }
        _levelProgressList.value = list
    }

    fun onSearchQueryChanged(query: String) {
        _searchQuery.value = query
    }

    /**
     * Executes the Dual-Window search:
     * Queries online dictionary APIs if enabled, falling back to offline core DB.
     */
    fun searchWord(word: String) {
        val query = word.trim()
        if (query.isEmpty()) return
        _searchQuery.value = query
        _isSearching.value = true

        viewModelScope.launch {
            val result = if (_isOnlineDictionaryEnabled.value) {
                onlineRepo.searchWordOnline(query)
            } else {
                OfflineGermanDatabase.searchOffline(query)
            }
            _dualWindowResult.value = result
            _isSearching.value = false
        }
    }

    fun toggleOnlineDictionary(enabled: Boolean) {
        _isOnlineDictionaryEnabled.value = enabled
    }

    fun speakGermanText(text: String, slow: Boolean = false) {
        speechHelper.speakGerman(text, slow)
    }

    // SRS Flashcard logic (Leitner Box rating)
    private fun loadSrsDeck() {
        val all = OfflineGermanDatabase.getAllWords()
        // Order by smallest SRS box first
        _srsWords.value = all.sortedBy { it.srsBox }
        _currentCardIndex.value = 0
        _isCardFlipped.value = false
    }

    fun flipCard() {
        _isCardFlipped.value = !_isCardFlipped.value
    }

    fun rateRecall(rating: Int) {
        // rating: 1 = Again, 2 = Hard, 3 = Good, 4 = Easy
        val list = _srsWords.value
        val index = _currentCardIndex.value
        if (index in list.indices) {
            val word = list[index]
            word.srsBox = when (rating) {
                1 -> 1
                2 -> (word.srsBox).coerceAtMost(5)
                3 -> (word.srsBox + 1).coerceAtMost(5)
                4 -> (word.srsBox + 2).coerceAtMost(5)
                else -> word.srsBox
            }
            word.lastReviewedMillis = System.currentTimeMillis()
        }

        // Advance to next card
        if (index + 1 < list.size) {
            _currentCardIndex.value = index + 1
            _isCardFlipped.value = false
        } else {
            // Re-shuffle or reload
            loadSrsDeck()
        }
        calculateLevelProgress()
    }

    override fun onCleared() {
        super.onCleared()
        speechHelper.shutdown()
    }
}

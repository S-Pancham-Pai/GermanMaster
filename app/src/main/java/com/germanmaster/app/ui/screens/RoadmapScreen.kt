package com.germanmaster.app.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.LockOpen
import androidx.compose.material.icons.filled.VolumeUp
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.germanmaster.app.model.CEFRCode
import com.germanmaster.app.model.CEFRLevelProgress
import com.germanmaster.app.model.GrammaticalGender
import com.germanmaster.app.model.WordItem
import com.germanmaster.app.ui.theme.DasGreen
import com.germanmaster.app.ui.theme.DerBlue
import com.germanmaster.app.ui.theme.DieRose

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RoadmapScreen(
    levelProgressList: List<CEFRLevelProgress>,
    selectedLevel: CEFRCode,
    roadmapWords: List<WordItem>,
    onSelectLevel: (CEFRCode) -> Unit,
    onSpeak: (String, Boolean) -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        // Top Header
        Surface(
            color = MaterialTheme.colorScheme.primaryContainer,
            shadowElevation = 4.dp
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp)
            ) {
                Text(
                    text = "German CEFR Roadmap",
                    style = MaterialTheme.typography.headlineMedium,
                    color = MaterialTheme.colorScheme.onPrimaryContainer,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = "Structured input from Beginner A1 to Mastery C2 based on spaced repetition & human cognition.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.8f)
                )
            }
        }

        // Horizontal CEFR Level Chips
        CEFRLevelSelector(
            levelProgressList = levelProgressList,
            selectedLevel = selectedLevel,
            onSelectLevel = onSelectLevel
        )

        // Selected Level Banner
        val selectedInfo = CEFRCode.values().find { it == selectedLevel }
        if (selectedInfo != null) {
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.secondaryContainer
                )
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Text(
                        text = "${selectedInfo.code} - ${selectedInfo.title}",
                        style = MaterialTheme.typography.titleMedium,
                        color = MaterialTheme.colorScheme.onSecondaryContainer,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = selectedInfo.description,
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSecondaryContainer.copy(alpha = 0.9f)
                    )
                }
            }
        }

        // Vocabulary & Comprehensible Input Cards
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(roadmapWords, key = { it.id }) { wordItem ->
                WordRoadmapCard(
                    wordItem = wordItem,
                    onSpeak = onSpeak
                )
            }

            item {
                Spacer(modifier = Modifier.height(80.dp))
            }
        }
    }
}

@Composable
fun CEFRLevelSelector(
    levelProgressList: List<CEFRLevelProgress>,
    selectedLevel: CEFRCode,
    onSelectLevel: (CEFRCode) -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 12.dp),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        CEFRCode.values().forEach { cefrCode ->
            val isSelected = (cefrCode == selectedLevel)
            val progress = levelProgressList.find { it.level == cefrCode }
            val isUnlocked = progress?.isUnlocked ?: true

            FilterChip(
                selected = isSelected,
                onClick = { onSelectLevel(cefrCode) },
                label = {
                    Text(
                        text = cefrCode.code,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium
                    )
                },
                leadingIcon = {
                    Icon(
                        imageVector = if (isUnlocked) Icons.Default.LockOpen else Icons.Default.Lock,
                        contentDescription = null,
                        modifier = Modifier.size(16.dp)
                    )
                },
                colors = FilterChipDefaults.filterChipColors(
                    selectedContainerColor = MaterialTheme.colorScheme.primary,
                    selectedLabelColor = MaterialTheme.colorScheme.onPrimary,
                    selectedLeadingIconColor = MaterialTheme.colorScheme.onPrimary
                )
            )
        }
    }
}

@Composable
fun WordRoadmapCard(
    wordItem: WordItem,
    onSpeak: (String, Boolean) -> Unit
) {
    var isExpanded by remember { mutableStateOf(false) }

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { isExpanded = !isExpanded },
        shape = RoundedCornerShape(16.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 3.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        )
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            // Header: Gender Badge, Word, and Speaker Button
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    GrammaticalGenderBadge(gender = wordItem.gender)
                    Column {
                        Text(
                            text = wordItem.germanWord,
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                        Text(
                            text = "${wordItem.ipa} • ${wordItem.wordClass}",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }

                // Native Read-Aloud Speaker Button
                IconButton(
                    onClick = { onSpeak(wordItem.germanWord, false) },
                    modifier = Modifier
                        .size(44.dp)
                        .background(
                            color = MaterialTheme.colorScheme.primaryContainer,
                            shape = RoundedCornerShape(12.dp)
                        )
                ) {
                    Icon(
                        imageVector = Icons.Default.VolumeUp,
                        contentDescription = "Read Aloud German Word",
                        tint = MaterialTheme.colorScheme.onPrimaryContainer
                    )
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // English Meaning
            Text(
                text = "Meaning: ${wordItem.englishMeaning}",
                style = MaterialTheme.typography.bodyLarge,
                fontWeight = FontWeight.SemiBold,
                color = MaterialTheme.colorScheme.primary
            )

            // Expandable Example Sentence & Translation
            AnimatedVisibility(visible = true) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 12.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f))
                        .padding(12.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "Example Sentence (Beispielsatz):",
                            style = MaterialTheme.typography.labelLarge,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            fontWeight = FontWeight.Bold
                        )
                        IconButton(
                            onClick = { onSpeak(wordItem.exampleGermanSentence, false) },
                            modifier = Modifier.size(32.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.VolumeUp,
                                contentDescription = "Read Aloud Sentence",
                                modifier = Modifier.size(18.dp),
                                tint = MaterialTheme.colorScheme.primary
                            )
                        }
                    }
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "„${wordItem.exampleGermanSentence}“",
                        style = MaterialTheme.typography.bodyLarge,
                        fontWeight = FontWeight.Medium,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = wordItem.exampleEnglishTranslation,
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }
    }
}

@Composable
fun GrammaticalGenderBadge(gender: GrammaticalGender) {
    val (bgColor, textColor, badgeText) = when (gender) {
        GrammaticalGender.DER -> Triple(DerBlue.copy(alpha = 0.15f), DerBlue, "DER")
        GrammaticalGender.DIE -> Triple(DieRose.copy(alpha = 0.15f), DieRose, "DIE")
        GrammaticalGender.DAS -> Triple(DasGreen.copy(alpha = 0.15f), DasGreen, "DAS")
        GrammaticalGender.PLURAL -> Triple(Color(0xFF9C27B0).copy(alpha = 0.15f), Color(0xFF9C27B0), "PL")
        GrammaticalGender.VERB -> Triple(Color(0xFFFF9800).copy(alpha = 0.15f), Color(0xFFFF9800), "VERB")
        GrammaticalGender.ADJECTIVE -> Triple(Color(0xFF009688).copy(alpha = 0.15f), Color(0xFF009688), "ADJ")
        else -> Triple(Color.Gray.copy(alpha = 0.15f), Color.Gray, "WORT")
    }

    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(8.dp))
            .background(bgColor)
            .padding(horizontal = 8.dp, vertical = 4.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = badgeText,
            style = MaterialTheme.typography.labelLarge,
            color = textColor,
            fontWeight = FontWeight.Bold
        )
    }
}

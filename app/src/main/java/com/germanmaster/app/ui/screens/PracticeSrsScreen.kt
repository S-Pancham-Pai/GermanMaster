package com.germanmaster.app.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Flip
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.VolumeUp
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.germanmaster.app.model.WordItem

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PracticeSrsScreen(
    srsWords: List<WordItem>,
    currentIndex: Int,
    isFlipped: Boolean,
    onFlip: () -> Unit,
    onRateRecall: (Int) -> Unit,
    onSpeak: (String, Boolean) -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Top Info
        Text(
            text = "Adaptive Spaced Repetition (Leitner SRS)",
            style = MaterialTheme.typography.titleLarge,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onBackground
        )
        Text(
            text = "Your feedback adjusts your roadmap based on human memory consolidation.",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(16.dp))

        if (srsWords.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(300.dp),
                contentAlignment = Alignment.Center
            ) {
                Text("Loading SRS Flashcards...")
            }
            return
        }

        val word = srsWords.getOrNull(currentIndex) ?: srsWords.first()

        // Progress Bar
        LinearProgressIndicator(
            progress = (currentIndex + 1).toFloat() / srsWords.size.coerceAtLeast(1),
            modifier = Modifier
                .fillMaxWidth()
                .height(8.dp)
                .clip(RoundedCornerShape(4.dp))
        )
        Spacer(modifier = Modifier.height(6.dp))
        Text(
            text = "Card ${currentIndex + 1} of ${srsWords.size} • Leitner Box ${word.srsBox} / 5",
            style = MaterialTheme.typography.labelMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )

        Spacer(modifier = Modifier.height(24.dp))

        // Flashcard
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .height(320.dp)
                .clickable { onFlip() },
            shape = RoundedCornerShape(24.dp),
            elevation = CardDefaults.cardElevation(defaultElevation = 8.dp),
            colors = CardDefaults.cardColors(
                containerColor = MaterialTheme.colorScheme.surface
            )
        ) {
            Box(modifier = Modifier.fillMaxSize()) {
                // Top Right Read Aloud Button
                IconButton(
                    onClick = { onSpeak(word.germanWord, false) },
                    modifier = Modifier
                        .align(Alignment.TopEnd)
                        .padding(16.dp)
                        .size(48.dp)
                        .background(
                            color = MaterialTheme.colorScheme.primaryContainer,
                            shape = RoundedCornerShape(14.dp)
                        )
                ) {
                    Icon(
                        imageVector = Icons.Default.VolumeUp,
                        contentDescription = "Speak Word",
                        tint = MaterialTheme.colorScheme.onPrimaryContainer
                    )
                }

                // Center Card Content
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    GrammaticalGenderBadge(gender = word.gender)
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = word.germanWord,
                        style = MaterialTheme.typography.displayLarge,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurface,
                        textAlign = TextAlign.Center
                    )
                    Text(
                        text = "${word.ipa} • CEFR ${word.cefrLevel.code}",
                        style = MaterialTheme.typography.titleMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    if (!isFlipped) {
                        Text(
                            text = "Tap card to reveal English meaning & sentence",
                            style = MaterialTheme.typography.labelLarge,
                            color = MaterialTheme.colorScheme.primary
                        )
                    } else {
                        Text(
                            text = word.englishMeaning,
                            style = MaterialTheme.typography.headlineMedium,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary,
                            textAlign = TextAlign.Center
                        )
                        Spacer(modifier = Modifier.height(10.dp))
                        Text(
                            text = "„${word.exampleGermanSentence}“",
                            style = MaterialTheme.typography.bodyLarge,
                            color = MaterialTheme.colorScheme.onSurface,
                            textAlign = TextAlign.Center
                        )
                        Text(
                            text = word.exampleEnglishTranslation,
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            textAlign = TextAlign.Center
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Flip Action or Rating Buttons
        if (!isFlipped) {
            Button(
                onClick = onFlip,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                shape = RoundedCornerShape(16.dp)
            ) {
                Icon(Icons.Default.Flip, contentDescription = null)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Reveal Answer", style = MaterialTheme.typography.titleMedium)
            }
        } else {
            Text(
                text = "How well did you remember this word?",
                style = MaterialTheme.typography.labelLarge,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Spacer(modifier = Modifier.height(12.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                // Again (1)
                Button(
                    onClick = { onRateRecall(1) },
                    modifier = Modifier
                        .weight(1f)
                        .height(52.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = MaterialTheme.colorScheme.error
                    ),
                    shape = RoundedCornerShape(14.dp)
                ) {
                    Text("Again\n(Noch mal)", textAlign = TextAlign.Center, style = MaterialTheme.typography.labelMedium)
                }

                // Hard (2)
                Button(
                    onClick = { onRateRecall(2) },
                    modifier = Modifier
                        .weight(1f)
                        .height(52.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = MaterialTheme.colorScheme.secondary
                    ),
                    shape = RoundedCornerShape(14.dp)
                ) {
                    Text("Hard\n(Schwer)", textAlign = TextAlign.Center, style = MaterialTheme.typography.labelMedium)
                }

                // Good (3)
                Button(
                    onClick = { onRateRecall(3) },
                    modifier = Modifier
                        .weight(1f)
                        .height(52.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = MaterialTheme.colorScheme.primary
                    ),
                    shape = RoundedCornerShape(14.dp)
                ) {
                    Text("Good\n(Gut)", textAlign = TextAlign.Center, style = MaterialTheme.typography.labelMedium)
                }

                // Easy (4)
                Button(
                    onClick = { onRateRecall(4) },
                    modifier = Modifier
                        .weight(1f)
                        .height(52.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = MaterialTheme.colorScheme.tertiary
                    ),
                    shape = RoundedCornerShape(14.dp)
                ) {
                    Text("Easy\n(Einfach)", textAlign = TextAlign.Center, style = MaterialTheme.typography.labelMedium)
                }
            }
        }
    }
}

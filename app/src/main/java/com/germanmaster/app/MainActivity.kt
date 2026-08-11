package com.germanmaster.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoStories
import androidx.compose.material.icons.filled.Flip
import androidx.compose.material.icons.filled.Map
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.germanmaster.app.ui.screens.*
import com.germanmaster.app.ui.theme.GermanMasterM3Theme
import com.germanmaster.app.viewmodel.GermanMasterViewModel

sealed class AppScreen(val route: String, val title: String, val icon: ImageVector) {
    object Roadmap : AppScreen("roadmap", "Roadmap", Icons.Default.Map)
    object Explorer : AppScreen("explorer", "Word Explorer", Icons.Default.AutoStories)
    object Practice : AppScreen("practice", "SRS Practice", Icons.Default.Flip)
    object Settings : AppScreen("settings", "Settings", Icons.Default.Settings)
}

class MainActivity : ComponentActivity() {

    private val viewModel: GermanMasterViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            GermanMasterM3Theme {
                GermanMasterApp(viewModel = viewModel)
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun GermanMasterApp(viewModel: GermanMasterViewModel) {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route ?: AppScreen.Roadmap.route

    val screens = listOf(
        AppScreen.Roadmap,
        AppScreen.Explorer,
        AppScreen.Practice,
        AppScreen.Settings
    )

    Scaffold(
        bottomBar = {
            NavigationBar(
                containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.9f)
            ) {
                screens.forEach { screen ->
                    val selected = currentRoute == screen.route
                    NavigationBarItem(
                        selected = selected,
                        onClick = {
                            if (currentRoute != screen.route) {
                                navController.navigate(screen.route) {
                                    popUpTo(navController.graph.findStartDestination().id) {
                                        saveState = true
                                    }
                                    launchSingleTop = true
                                    restoreState = true
                                }
                            }
                        },
                        icon = {
                            Icon(
                                imageVector = screen.icon,
                                contentDescription = screen.title
                            )
                        },
                        label = {
                            Text(text = screen.title)
                        }
                    )
                }
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = AppScreen.Roadmap.route,
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            composable(AppScreen.Roadmap.route) {
                val levelProgressList by viewModel.levelProgressList.collectAsState()
                val selectedLevel by viewModel.selectedCefrLevel.collectAsState()
                val roadmapWords by viewModel.roadmapWords.collectAsState()

                RoadmapScreen(
                    levelProgressList = levelProgressList,
                    selectedLevel = selectedLevel,
                    roadmapWords = roadmapWords,
                    onSelectLevel = { viewModel.selectCefrLevel(it) },
                    onSpeak = { text, slow -> viewModel.speakGermanText(text, slow) }
                )
            }

            composable(AppScreen.Explorer.route) {
                val searchQuery by viewModel.searchQuery.collectAsState()
                val isSearching by viewModel.isSearching.collectAsState()
                val result by viewModel.dualWindowResult.collectAsState()
                val isOnlineModeEnabled by viewModel.isOnlineDictionaryEnabled.collectAsState()

                DualWindowExplorerScreen(
                    searchQuery = searchQuery,
                    isSearching = isSearching,
                    result = result,
                    isOnlineModeEnabled = isOnlineModeEnabled,
                    onSearchQueryChanged = { viewModel.onSearchQueryChanged(it) },
                    onSearch = { viewModel.searchWord(it) },
                    onSpeak = { text, slow -> viewModel.speakGermanText(text, slow) }
                )
            }

            composable(AppScreen.Practice.route) {
                val srsWords by viewModel.srsWords.collectAsState()
                val currentIndex by viewModel.currentCardIndex.collectAsState()
                val isFlipped by viewModel.isCardFlipped.collectAsState()

                PracticeSrsScreen(
                    srsWords = srsWords,
                    currentIndex = currentIndex,
                    isFlipped = isFlipped,
                    onFlip = { viewModel.flipCard() },
                    onRateRecall = { viewModel.rateRecall(it) },
                    onSpeak = { text, slow -> viewModel.speakGermanText(text, slow) }
                )
            }

            composable(AppScreen.Settings.route) {
                val isOnlineEnabled by viewModel.isOnlineDictionaryEnabled.collectAsState()
                val levelProgressList by viewModel.levelProgressList.collectAsState()

                SettingsScreen(
                    isOnlineDictionaryEnabled = isOnlineEnabled,
                    onToggleOnlineDictionary = { viewModel.toggleOnlineDictionary(it) },
                    levelProgressList = levelProgressList,
                    onSpeak = { text, slow -> viewModel.speakGermanText(text, slow) }
                )
            }
        }
    }
}

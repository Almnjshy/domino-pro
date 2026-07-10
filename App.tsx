import React, { useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { MainMenu } from './src/screens/MainMenu';
import { GameScreen } from './src/screens/GameScreen';
import { ResultScreen } from './src/screens/ResultScreen';
import { StatisticsScreen } from './src/screens/StatisticsScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { GameState } from './src/core/types';
import { audio } from './src/engines/AudioEngine';
import { AudioStorage } from './src/store/audioStore';
import { saveManager } from './src/managers/SaveManager';
import { statisticsManager } from './src/managers/StatisticsManager';

type Screen = 'menu' | 'game' | 'result' | 'statistics' | 'settings';

export default function App() {
  const [screen, setScreen] = useState<Screen>('menu');
  const [gameConfig, setGameConfig] = useState<{
    count: number; mode: 'classic' | 'draw' | 'block'; themeId: string;
  } | null>(null);
  const [finalGameState, setFinalGameState] = useState<GameState | null>(null);

  useEffect(() => {
    const init = async () => {
      await audio.init();
      await AudioStorage.initialize();
      await saveManager.init();
      await statisticsManager.init();
      const settings = audio.getSettings();
      if (!settings.isMuted && settings.currentTrackId !== 'none') {
        await audio.playMusic(settings.currentTrackId);
      }
    };
    init();
    return () => {
      audio.dispose();
      saveManager.dispose();
      statisticsManager.dispose();
    };
  }, []);

  const handleStart = (count: number, mode: 'classic' | 'draw' | 'block', themeId: string) => {
    audio.play('button_click');
    setGameConfig({ count, mode, themeId });
    setScreen('game');
  };

  const handleGameEnd = (state: GameState) => {
    setFinalGameState(state);
    setScreen('result');
  };

  const handleNewRound = () => {
    audio.play('button_click');
    setScreen('game');
  };

  const handleMainMenu = () => {
    audio.play('button_click');
    setGameConfig(null);
    setFinalGameState(null);
    setScreen('menu');
  };

  const handleContinueGame = (state: GameState, config: any) => {
    audio.play('button_click');
    setGameConfig({
      count: config.playerCount,
      mode: config.mode,
      themeId: config.themeId,
    });
    setScreen('game');
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />

      {screen === 'menu' && (
        <MainMenu
          onStartGame={handleStart}
          onSettings={() => { audio.play('button_click'); setScreen('settings'); }}
          onStatistics={() => { audio.play('button_click'); setScreen('statistics'); }}
          onContinueGame={handleContinueGame}
        />
      )}

      {screen === 'settings' && (
        <SettingsScreen onBack={() => setScreen('menu')} />
      )}

      {screen === 'statistics' && (
        <StatisticsScreen onBack={() => setScreen('menu')} />
      )}

      {screen === 'game' && gameConfig && (
        <GameScreen
          playerCount={gameConfig.count}
          mode={gameConfig.mode}
          tableTheme={gameConfig.themeId}
          onExit={handleMainMenu}
          onGameEnd={handleGameEnd}
        />
      )}

      {screen === 'result' && finalGameState && (
        <ResultScreen
          gameState={finalGameState}
          onNewRound={handleNewRound}
          onMainMenu={handleMainMenu}
        />
      )}
    </>
  );
}
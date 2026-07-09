import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Board } from '../components/Board';
import { Hand } from '../components/Hand';
import { OpponentHand } from '../components/OpponentHand';
import { SaveInfoBadge } from '../components/SaveInfoBadge';
import { GameEngine } from '../core/GameEngine';
import { GameState, LayoutConfig } from '../core/types';
import { useAutoSave, useSave } from '../hooks/useSave';
import { audio } from '../engines/AudioEngine';
import { statisticsManager } from '../managers/StatisticsManager';

interface GameScreenProps {
  playerCount: number;
  mode: 'classic' | 'draw' | 'block';
  tableTheme?: string;
  onExit: () => void;
  onGameEnd: (state: GameState) => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  playerCount, mode, tableTheme = 'green-felt', onExit, onGameEnd
}) => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [showSaveBadge, setShowSaveBadge] = useState(false);
  const engineRef = useRef<GameEngine | null>(null);
  const { save } = useSave();

  useEffect(() => {
    const { width, height } = Dimensions.get('window');
    const config: LayoutConfig = {
      boardWidth: width * 0.9, boardHeight: height * 0.55,
      tileWidth: 60, tileHeight: 120, padding: 30, spacing: 4,
    };

    const engine = new GameEngine(config);
    engineRef.current = engine;
    engine.setupMatch(playerCount, mode, 'human-player');
    setGameState(engine.getState());
    statisticsManager.recordGameStart();

    const unsubscribe = engine.subscribe((state) => {
      setGameState({ ...state });
    });
    return unsubscribe;
  }, [playerCount, mode]);

  useAutoSave(
    () => gameState,
    () => ({
      playerCount, mode,
      themeId: tableTheme,
      targetScore: 100,
    })
  );

  useEffect(() => {
    if (!gameState) return;
    if (gameState.isGameOver) {
      const timer = setTimeout(() => onGameEnd(gameState), 1500);
      return () => clearTimeout(timer);
    }
    const current = gameState.players[gameState.currentPlayerIndex];
    if (!current.isHuman) {
      const timer = setTimeout(() => { engineRef.current?.playAIMove(); }, 1200);
      return () => clearTimeout(timer);
    }
  }, [gameState?.currentPlayerIndex, gameState?.isGameOver]);

  const handleTileSelect = (tileId: string) => { audio.play('tile_select'); };
  const handleTileDrop = (tileId: string, side: 'left' | 'right') => {
    const success = engineRef.current?.playHumanMove(tileId, side);
    if (success) {
      audio.play('tile_place');
      if (gameState) {
        save(gameState, { playerCount, mode, themeId: tableTheme, targetScore: 100 });
        setShowSaveBadge(true);
        setTimeout(() => setShowSaveBadge(false), 2000);
      }
    }
  };

  const handleExit = async () => {
    if (gameState && !gameState.isGameOver) {
      await save(gameState, { playerCount, mode, themeId: tableTheme, targetScore: 100 });
      setShowSaveBadge(true);
      setTimeout(() => onExit(), 800);
    } else {
      onExit();
    }
  };

  if (!gameState) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>جاري التحميل...</Text>
      </View>
    );
  }

  const humanPlayer = gameState.players.find(p => p.isHuman)!;
  const opponents = gameState.players.filter(p => !p.isHuman);
  const isMyTurn = gameState.players[gameState.currentPlayerIndex].isHuman;

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleExit} style={styles.exitBtn}>
          <Text style={styles.exitText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.title}>الجولة {gameState.roundNumber}</Text>
        <Text style={styles.score}>⭐ {humanPlayer.score}</Text>
      </View>

      {opponents.filter(p => p.position === 'top').map(p => (
        <OpponentHand key={p.id} player={p} position="top"
          isCurrentTurn={gameState.currentPlayerIndex === gameState.players.findIndex(pl => pl.id === p.id)} />
      ))}

      {opponents.filter(p => p.position === 'left' || p.position === 'right').map(p => (
        <OpponentHand key={p.id} player={p} position={p.position as 'left' | 'right'}
          isCurrentTurn={gameState.currentPlayerIndex === gameState.players.findIndex(pl => pl.id === p.id)} />
      ))}

      <Board tiles={gameState.board} tableTheme={tableTheme as any} />

      <Hand
        tiles={humanPlayer.hand}
        onTileSelect={handleTileSelect}
        onTileDrop={handleTileDrop}
        disabled={!isMyTurn}
      />

      {isMyTurn && (
        <View style={styles.turnIndicator}>
          <Text style={styles.turnText}>دورك</Text>
        </View>
      )}

      <SaveInfoBadge visible={showSaveBadge} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a' },
  topBar: {
    height: 60, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  exitBtn: { padding: 8 },
  exitText: { color: '#fff', fontSize: 24 },
  title: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  score: { color: '#ffd700', fontSize: 16, fontWeight: 'bold' },
  turnIndicator: {
    position: 'absolute', bottom: 170, alignSelf: 'center',
    backgroundColor: '#ffd700', paddingHorizontal: 20, paddingVertical: 8,
    borderRadius: 20,
  },
  turnText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a1a' },
  loadingText: { color: '#fff', fontSize: 20 },
});
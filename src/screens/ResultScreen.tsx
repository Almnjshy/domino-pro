import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { Confetti } from '../components/Confetti';
import { GameState } from '../core/types';
import { RulesEngine } from '../core/RulesEngine';

interface ResultScreenProps {
  gameState: GameState;
  onNewRound: () => void;
  onMainMenu: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  gameState,
  onNewRound,
  onMainMenu,
}) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const titleOpacity = useSharedValue(0);
  const titleScale = useSharedValue(0.5);

  const results = useMemo(() => {
    const winnerId = gameState.winnerId;
    const winner = gameState.players.find((p) => p.id === winnerId);
    const humanPlayer = gameState.players.find((p) => p.isHuman)!;
    const humanWon = humanPlayer.id === winnerId;
    const roundScores = winnerId ? RulesEngine.calculateRoundScore(gameState, winnerId) : {};

    const sorted = [...gameState.players].sort((a, b) => {
      const aScore = roundScores[a.id] || 0;
      const bScore = roundScores[b.id] || 0;
      if (bScore !== aScore) return bScore - aScore;
      return a.hand.length - b.hand.length;
    });

    return { winner, humanPlayer, humanWon, roundScores, sorted };
  }, [gameState]);

  useEffect(() => {
    titleOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));
    titleScale.value = withDelay(
      200,
      withTiming(1, {
        duration: 700,
        easing: Easing.bezier(0.34, 1.56, 0.64, 1),
      })
    );
  }, []);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ scale: titleScale.value }],
  }));

  const titleText = results.humanWon ? '🎉 فزت!' : '😔 خسرت';
  const titleColor = results.humanWon ? '#ffd700' : '#ff6b6b';

  return (
    <View style={styles.container}>
      <Confetti active={showConfetti && results.humanWon} onComplete={() => setShowConfetti(false)} />

      <ScrollView contentContainerStyle={styles.content}>
        <Animated.Text style={[styles.title, titleStyle, { color: titleColor }]}>
          {titleText}
        </Animated.Text>
        <Text style={styles.subtitle}>الجولة {gameState.roundNumber}</Text>

        {results.winner && (
          <View style={styles.winnerCard}>
            <Text style={styles.trophy}>🏆</Text>
            <Text style={styles.winnerLabel}>الفائز</Text>
            <Text style={styles.winnerName}>{results.winner.name}</Text>
            <View style={styles.scoreBox}>
              <Text style={styles.scoreValue}>+{results.roundScores[results.winner.id] || 0}</Text>
            </View>
          </View>
        )}

        <View style={styles.resultsList}>
          {results.sorted.map((player, idx) => (
            <View
              key={player.id}
              style={[styles.playerRow, player.id === gameState.winnerId && styles.winnerRow]}
            >
              <View
                style={[
                  styles.rankBadge,
                  {
                    backgroundColor:
                      idx === 0 ? '#ffd700' : idx === 1 ? '#c0c0c0' : idx === 2 ? '#cd7f32' : '#888',
                  },
                ]}
              >
                <Text style={[styles.rankText, idx < 2 && styles.rankTextDark]}>{idx + 1}</Text>
              </View>
              <View style={styles.playerInfo}>
                <Text style={styles.playerName}>
                  {player.name} {player.isHuman ? '(أنت)' : ''}
                </Text>
                <Text style={styles.tilesInfo}>القطع المتبقية: {player.hand.length}</Text>
              </View>
              <View style={styles.scoreContainer}>
                <Text style={styles.totalScore}>{player.score}</Text>
                <Text style={styles.totalLabel}>المجموع</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.primaryBtn} onPress={onNewRound}>
            <Text style={styles.primaryBtnText}>جولة جديدة</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} onPress={onMainMenu}>
            <Text style={styles.secondaryBtnText}>القائمة الرئيسية</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  content: { flexGrow: 1, padding: 20, paddingTop: 60, alignItems: 'center' },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 8,
    marginBottom: 4,
  },
  subtitle: { color: 'rgba(255,255,255,0.6)', fontSize: 16, marginBottom: 20, letterSpacing: 2 },
  winnerCard: {
    width: 280,
    backgroundColor: 'rgba(20,20,20,0.95)',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#d4af37',
    shadowColor: '#ffd700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 15,
    marginBottom: 24,
  },
  trophy: { fontSize: 48, marginBottom: 8 },
  winnerLabel: { color: '#d4af37', fontSize: 14, fontWeight: '600', letterSpacing: 3 },
  winnerName: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginBottom: 12 },
  scoreBox: {
    backgroundColor: 'rgba(212,175,55,0.15)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  scoreValue: { color: '#ffd700', fontSize: 32, fontWeight: 'bold' },
  resultsList: { width: '100%', marginTop: 10 },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  winnerRow: { backgroundColor: 'rgba(212,175,55,0.15)', borderColor: '#d4af37', borderWidth: 2 },
  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  rankTextDark: { color: '#000' },
  playerInfo: { flex: 1 },
  playerName: { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 2 },
  tilesInfo: { color: 'rgba(255,255,255,0.5)', fontSize: 12 },
  scoreContainer: { alignItems: 'flex-end', minWidth: 70 },
  totalScore: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  totalLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 10 },
  buttons: { width: '100%', marginTop: 24, marginBottom: 40, gap: 12 },
  primaryBtn: {
    backgroundColor: '#d4af37',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#ffd700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  primaryBtnText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
  secondaryBtn: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  secondaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
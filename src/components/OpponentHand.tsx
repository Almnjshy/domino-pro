import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DominoTile } from './DominoTile';
import { Player } from '../core/types';

interface OpponentHandProps {
  player: Player;
  position: 'top' | 'left' | 'right';
  isCurrentTurn: boolean;
}

export const OpponentHand: React.FC<OpponentHandProps> = ({ player, position, isCurrentTurn }) => {
  const isVertical = position === 'left' || position === 'right';

  return (
    <View style={[styles.container, styles[position], isCurrentTurn && styles.active]}>
      <View style={styles.infoRow}>
        <Text style={styles.name}>{player.name}</Text>
        <Text style={styles.count}>{player.hand.length} 🎴</Text>
      </View>
      <View style={[styles.tilesRow, isVertical && styles.vertical]}>
        {player.hand.slice(0, Math.min(player.hand.length, 10)).map((_, idx) => (
          <View key={idx} style={{ marginLeft: idx === 0 ? 0 : -15 }}>
            <DominoTile left={0} right={0} width={25} height={50} faceDown />
          </View>
        ))}
      </View>
      {isCurrentTurn && <View style={styles.turnIndicator} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute', padding: 8,
    backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 12,
  },
  top: { top: 10, left: 10, right: 10, alignItems: 'center' },
  left: { top: 100, left: 10 },
  right: { top: 100, right: 10 },
  active: { borderWidth: 2, borderColor: '#ffd700' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6, minWidth: 80 },
  name: { color: '#fff', fontSize: 12, fontWeight: '600' },
  count: { color: '#ffd700', fontSize: 12, fontWeight: 'bold' },
  tilesRow: { flexDirection: 'row', alignItems: 'center' },
  vertical: { flexDirection: 'column' },
  turnIndicator: {
    position: 'absolute', top: -5, right: -5,
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: '#ffd700',
  },
});
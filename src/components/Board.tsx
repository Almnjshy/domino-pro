import React, { useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { DominoTile } from './DominoTile';
import { TableBackground, TableTheme } from '../assets/TableBackground';
import { BoardTile } from '../core/types';

interface BoardProps {
  tiles: BoardTile[];
  tableTheme?: TableTheme;
}

export const Board: React.FC<BoardProps> = ({ tiles, tableTheme = 'green-felt' }) => {
  const { width, height } = Dimensions.get('window');
  const boardSize = Math.min(width - 20, height * 0.55);

  const sortedTiles = useMemo(() =>
    [...tiles].sort((a, b) => a.placedAt - b.placedAt),
    [tiles]
  );

  return (
    <View style={styles.container}>
      <View style={[styles.boardWrapper, { width: boardSize, height: boardSize }]}>
        <TableBackground theme={tableTheme} width={boardSize} height={boardSize} />
        <View style={StyleSheet.absoluteFill}>
          {sortedTiles.map(tile => (
            <View
              key={tile.id}
              style={[
                styles.tileWrapper,
                {
                  left: tile.x - 30,
                  top: tile.y - 60,
                  transform: [{ rotate: `${tile.rotation}deg` }],
                }
              ]}
            >
              <DominoTile left={tile.left} right={tile.right} width={60} height={120} />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  boardWrapper: { position: 'relative' },
  tileWrapper: { position: 'absolute' },
});
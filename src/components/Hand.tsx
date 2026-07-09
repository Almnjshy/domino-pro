import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { DraggableTile } from './DraggableTile';
import { DominoTile as DominoTileType } from '../core/types';

interface HandProps {
  tiles: DominoTileType[];
  onTileDrop: (tileId: string, side: 'left' | 'right') => void;
  disabled?: boolean;
  onDragStart?: (tile: DominoTileType) => void;
}

export const Hand: React.FC<HandProps> = ({ tiles, onTileDrop, disabled, onDragStart }) => {
  const [draggingTileId, setDraggingTileId] = useState<string | null>(null);

  const handleDragStart = (tile: DominoTileType) => {
    setDraggingTileId(tile.id);
    onDragStart?.(tile);
  };

  const handleDragEnd = (tileId: string, result: { success: boolean; side?: 'left' | 'right' }) => {
    if (result.success && result.side) {
      onTileDrop(tileId, result.side);
    }
    setDraggingTileId(null);
  };

  const tileWidth = tiles.length > 8 ? 45 : tiles.length > 6 ? 52 : 60;
  const tileHeight = tileWidth * 2;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.handContent}
      >
        {tiles.map((tile, idx) => (
          <View
            key={tile.id}
            style={[
              styles.tileSlot,
              { marginLeft: idx === 0 ? 0 : -8 },
              draggingTileId === tile.id && styles.draggingTile
            ]}
          >
            <DraggableTile
              tile={tile}
              width={tileWidth}
              height={tileHeight}
              disabled={disabled}
              onDragStart={() => handleDragStart(tile)}
              onDragEnd={(result) => handleDragEnd(tile.id, result)}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 160,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  handContent: { paddingHorizontal: 16, alignItems: 'center', paddingVertical: 10 },
  tileSlot: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  draggingTile: { opacity: 0.5 },
});
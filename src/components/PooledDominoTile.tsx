import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { DominoTile } from './DominoTile';
import { PooledDomino } from '../engines/DominoPool';

interface PooledDominoTileProps {
  pooled: PooledDomino;
  width?: number;
  height?: number;
}

export const PooledDominoTile: React.FC<PooledDominoTileProps> = memo(({
  pooled, width = 60, height = 120
}) => {
  if (!pooled.tileData) return null;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: pooled.position.x - width / 2 },
      { translateY: pooled.position.y - height / 2 },
      { rotate: `${pooled.rotation}deg` },
      { scale: pooled.scale },
    ],
    opacity: pooled.opacity,
    zIndex: pooled.zIndex,
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <DominoTile left={pooled.tileData.left} right={pooled.tileData.right}
        width={width} height={height} />
    </Animated.View>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.pooled.id === nextProps.pooled.id &&
    prevProps.pooled.position.x === nextProps.pooled.position.x &&
    prevProps.pooled.position.y === nextProps.pooled.position.y &&
    prevProps.pooled.rotation === nextProps.pooled.rotation
  );
});

const styles = StyleSheet.create({
  container: { position: 'absolute' },
});
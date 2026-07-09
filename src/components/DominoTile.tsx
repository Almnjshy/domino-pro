import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

interface DominoTileProps {
  left: number;
  right: number;
  width?: number;
  height?: number;
  rotation?: number;
  faceDown?: boolean;
  selected?: boolean;
  theme?: 'classic' | 'wood' | 'marble' | 'black';
}

const PIP_POSITIONS: Record<number, Array<[number, number]>> = {
  0: [],
  1: [[0.5, 0.5]],
  2: [[0.25, 0.25], [0.75, 0.75]],
  3: [[0.25, 0.25], [0.5, 0.5], [0.75, 0.75]],
  4: [[0.25, 0.25], [0.75, 0.25], [0.25, 0.75], [0.75, 0.75]],
  5: [[0.25, 0.25], [0.75, 0.25], [0.5, 0.5], [0.25, 0.75], [0.75, 0.75]],
  6: [[0.25, 0.25], [0.75, 0.25], [0.25, 0.5], [0.75, 0.5], [0.25, 0.75], [0.75, 0.75]],
};

const THEMES = {
  classic: { body: ['#fafafa', '#e8e8e8'], border: '#2c2c2c', pip: '#1a1a1a', back: ['#2c3e50', '#1a252f'] },
  wood: { body: ['#d4a574', '#a67c52'], border: '#5c3a1e', pip: '#2c1810', back: ['#6b4423', '#3d2817'] },
  marble: { body: ['#f5f5f0', '#d4d4c8'], border: '#4a4a4a', pip: '#1a1a1a', back: ['#8b8b8b', '#5a5a5a'] },
  black: { body: ['#2c2c2c', '#1a1a1a'], border: '#ffd700', pip: '#ffd700', back: ['#0a0a0a', '#000000'] },
};

export const DominoTile: React.FC<DominoTileProps> = ({
  left, right, width = 60, height = 120, rotation = 0,
  faceDown = false, selected = false, theme = 'classic'
}) => {
  const colors = THEMES[theme];
  const halfHeight = height / 2;
  const pipRadius = Math.min(width, halfHeight) * 0.08;

  const renderPips = (value: number, offsetY: number) => {
    const positions = PIP_POSITIONS[value] || [];
    return positions.map(([px, py], idx) => (
      <Circle key={idx} cx={px * width} cy={offsetY + py * halfHeight}
        r={pipRadius} fill={colors.pip} />
    ));
  };

  return (
    <View style={[
      styles.container,
      { width, height, transform: [{ rotate: `${rotation}deg` }] },
      selected && styles.selected
    ]}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Defs>
          <LinearGradient id={`grad-${theme}-${left}-${right}`} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={colors.body[0]} />
            <Stop offset="1" stopColor={colors.body[1]} />
          </LinearGradient>
          <LinearGradient id={`back-${theme}`} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={colors.back[0]} />
            <Stop offset="1" stopColor={colors.back[1]} />
          </LinearGradient>
        </Defs>

        <Rect x={2} y={3} width={width - 2} height={height - 2}
          rx={8} ry={8} fill="rgba(0,0,0,0.25)" />

        <Rect x={1} y={1} width={width - 2} height={height - 2}
          rx={8} ry={8}
          fill={faceDown ? `url(#back-${theme})` : `url(#grad-${theme}-${left}-${right})`}
          stroke={colors.border} strokeWidth={1.5} />

        {faceDown ? (
          <>
            <Rect x={width * 0.15} y={height * 0.1} width={width * 0.7} height={height * 0.8}
              rx={4} ry={4} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
            <Circle cx={width / 2} cy={height / 2} r={width * 0.15}
              fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={1} />
          </>
        ) : (
          <>
            <Rect x={width * 0.1} y={halfHeight - 1} width={width * 0.8} height={2}
              fill={colors.border} />
            {renderPips(left, 0)}
            {renderPips(right, halfHeight)}
            <Rect x={3} y={3} width={width * 0.3} height={height - 6}
              rx={6} ry={6} fill="rgba(255,255,255,0.15)" />
          </>
        )}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { justifyContent: 'center', alignItems: 'center' },
  selected: { transform: [{ scale: 1.1 }] },
});
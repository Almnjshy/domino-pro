import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { WoodGrainPattern, FeltPattern, MarblePattern, LeatherPattern } from './patterns';

export type TableTheme = 'classic-wood' | 'green-felt' | 'marble' | 'leather' | 'royal-blue';

interface TableBackgroundProps {
  theme?: TableTheme;
  width?: number;
  height?: number;
}

const renderTheme = (theme: TableTheme, width: number, height: number) => {
  switch (theme) {
    case 'classic-wood':
      return (
        <>
          <WoodGrainPattern id="table-wood" />
          <Rect x={20} y={20} width={width - 40} height={height - 40}
            rx={15} ry={15} fill="none" stroke="#d4af37" strokeWidth={2} opacity={0.6} />
          <Rect x={30} y={30} width={width - 60} height={height - 60}
            rx={12} ry={12} fill="none" stroke="#d4af37" strokeWidth={1} opacity={0.4} />
        </>
      );
    case 'green-felt':
      return (
        <>
          <FeltPattern id="table-felt" color="#0a5c2e" />
          <Rect x={15} y={15} width={width - 30} height={height - 30}
            rx={20} ry={20} fill="none" stroke="#d4af37" strokeWidth={1.5}
            strokeDasharray="4,4" opacity={0.7} />
          <Circle cx={width / 2} cy={height / 2} r={Math.min(width, height) * 0.15}
            fill="none" stroke="rgba(212,175,55,0.15)" strokeWidth={1} />
        </>
      );
    case 'marble':
      return (
        <>
          <MarblePattern id="table-marble" />
          <Rect x={10} y={10} width={width - 20} height={height - 20}
            rx={8} ry={8} fill="none" stroke="#8b7355" strokeWidth={3} opacity={0.5} />
        </>
      );
    case 'leather':
      return (
        <>
          <LeatherPattern id="table-leather" />
          <Rect x={25} y={25} width={width - 50} height={height - 50}
            rx={18} ry={18} fill="none" stroke="#8b6914" strokeWidth={1}
            strokeDasharray="2,6" opacity={0.8} />
        </>
      );
    case 'royal-blue':
      return (
        <>
          <FeltPattern id="table-royal" color="#1a2f5c" />
          <Rect x={20} y={20} width={width - 40} height={height - 40}
            rx={15} ry={15} fill="none" stroke="#c9a961" strokeWidth={2} opacity={0.8} />
          {[
            [30, 30], [width - 30, 30], [30, height - 30], [width - 30, height - 30]
          ].map(([cx, cy], i) => (
            <Circle key={i} cx={cx} cy={cy} r={8}
              fill="none" stroke="#c9a961" strokeWidth={1.5} opacity={0.7} />
          ))}
        </>
      );
  }
};

export const TableBackground: React.FC<TableBackgroundProps> = ({
  theme = 'green-felt', width = 400, height = 400,
}) => {
  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {renderTheme(theme, width, height)}
        <Defs>
          <RadialGradient id="vignette" cx="50%" cy="50%" r="75%">
            <Stop offset="0%" stopColor="#000" stopOpacity="0" />
            <Stop offset="100%" stopColor="#000" stopOpacity="0.5" />
          </RadialGradient>
        </Defs>
        <Rect width={width} height={height} fill="url(#vignette)" />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 20,
  },
});
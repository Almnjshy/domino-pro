import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Circle, Defs, RadialGradient, Stop, Path, Pattern, G } from 'react-native-svg';

interface MenuBackgroundProps {
  width?: number;
  height?: number;
}

export const MenuBackground: React.FC<MenuBackgroundProps> = ({
  width = Dimensions.get('window').width,
  height = Dimensions.get('window').height,
}) => {
  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Defs>
          <RadialGradient id="menu-bg" cx="50%" cy="30%" r="80%">
            <Stop offset="0%" stopColor="#2c1810" />
            <Stop offset="50%" stopColor="#1a0f08" />
            <Stop offset="100%" stopColor="#000000" />
          </RadialGradient>
          <RadialGradient id="menu-glow" cx="50%" cy="25%" r="40%">
            <Stop offset="0%" stopColor="#d4af37" stopOpacity="0.3" />
            <Stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
          </RadialGradient>
          <Pattern id="menu-wood" x="0" y="0" width="100" height="20" patternUnits="userSpaceOnUse">
            <Path d="M0,10 Q25,5 50,10 T100,10" stroke="rgba(139,90,43,0.1)" strokeWidth="0.5" fill="none" />
          </Pattern>
          <RadialGradient id="bottom-vignette" cx="50%" cy="100%" r="60%">
            <Stop offset="0%" stopColor="#000" stopOpacity="0.6" />
            <Stop offset="100%" stopColor="#000" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        <Rect width={width} height={height} fill="url(#menu-bg)" />
        <Rect width={width} height={height} fill="url(#menu-wood)" opacity="0.5" />
        <Rect width={width} height={height} fill="url(#menu-glow)" />

        {[
          { x: width * 0.1, y: height * 0.2, rot: -15 },
          { x: width * 0.85, y: height * 0.15, rot: 20 },
          { x: width * 0.15, y: height * 0.75, rot: 35 },
          { x: width * 0.8, y: height * 0.8, rot: -25 },
          { x: width * 0.5, y: height * 0.9, rot: 10 },
        ].map((pos, i) => (
          <G key={i} transform={`translate(${pos.x}, ${pos.y}) rotate(${pos.rot})`} opacity="0.08">
            <Rect x={-20} y={-40} width={40} height={80} rx={5} ry={5}
              fill="#d4af37" stroke="#d4af37" strokeWidth={1} />
            <Rect x={-18} y={-1} width={36} height={2} fill="#000" />
          </G>
        ))}

        <Rect x={20} y={20} width={width - 40} height={height - 40}
          rx={15} ry={15} fill="none" stroke="#d4af37" strokeWidth={1} opacity={0.3} />

        {[
          [30, 30], [width - 30, 30], [30, height - 30], [width - 30, height - 30]
        ].map(([cx, cy], i) => (
          <G key={i}>
            <Circle cx={cx} cy={cy} r={12} fill="none" stroke="#d4af37" strokeWidth={1} opacity={0.5} />
            <Circle cx={cx} cy={cy} r={4} fill="#d4af37" opacity={0.6} />
          </G>
        ))}

        <Rect width={width} height={height} fill="url(#bottom-vignette)" />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },
});
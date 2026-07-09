import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, Easing } from 'react-native-reanimated';
import Svg, { Rect, Circle, Path } from 'react-native-svg';

interface ConfettiPiece {
  id: number; x: number; y: number; rotation: number;
  rotationSpeed: number; velocityX: number; color: string;
  shape: 'square' | 'circle' | 'triangle'; size: number;
  opacity: number; delay: number; duration: number;
}

interface ConfettiProps {
  active: boolean;
  onComplete?: () => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const generatePieces = (count: number = 60): ConfettiPiece[] => {
  const colors = ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#ff9ff3'];
  const shapes: ConfettiPiece['shape'][] = ['square', 'circle', 'triangle'];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random(),
    y: -0.1 - Math.random() * 0.3,
    rotation: Math.random() * 360,
    rotationSpeed: -720 + Math.random() * 1440,
    velocityX: -0.3 + Math.random() * 0.6,
    color: colors[Math.floor(Math.random() * colors.length)],
    shape: shapes[Math.floor(Math.random() * shapes.length)],
    size: 8 + Math.random() * 8,
    opacity: 0.7 + Math.random() * 0.3,
    delay: Math.random() * 800,
    duration: 2500 + Math.random() * 2000,
  }));
};

const PieceView: React.FC<{ piece: ConfettiPiece }> = ({ piece }) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(SCREEN_HEIGHT * piece.y);
  const rotate = useSharedValue(piece.rotation);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const startX = SCREEN_WIDTH * piece.x;
    const endX = SCREEN_WIDTH * (piece.x + piece.velocityX);
    const endY = SCREEN_HEIGHT * 1.1;
    const endRotation = piece.rotation + piece.rotationSpeed;

    opacity.value = withDelay(piece.delay, withTiming(piece.opacity, { duration: 300 }));
    translateX.value = withDelay(piece.delay, withTiming(endX - startX, { duration: piece.duration }));
    translateY.value = withDelay(piece.delay, withTiming(endY, {
      duration: piece.duration, easing: Easing.bezier(0.55, 0.05, 0.85, 0.35),
    }));
    rotate.value = withDelay(piece.delay, withTiming(endRotation, {
      duration: piece.duration, easing: Easing.linear,
    }));
  }, [piece]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.piece, animatedStyle]}>
      <Svg width={piece.size} height={piece.size} viewBox="0 0 10 10">
        {piece.shape === 'square' && <Rect x={0} y={0} width={10} height={10} fill={piece.color} />}
        {piece.shape === 'circle' && <Circle cx={5} cy={5} r={5} fill={piece.color} />}
        {piece.shape === 'triangle' && <Path d="M5,0 L10,10 L0,10 Z" fill={piece.color} />}
      </Svg>
    </Animated.View>
  );
};

export const Confetti: React.FC<ConfettiProps> = ({ active, onComplete }) => {
  const pieces = useMemo(() => (active ? generatePieces() : []), [active]);

  useEffect(() => {
    if (active && pieces.length > 0) {
      const maxDuration = Math.max(...pieces.map(p => p.duration + p.delay));
      const timer = setTimeout(() => onComplete?.(), maxDuration + 200);
      return () => clearTimeout(timer);
    }
  }, [active, pieces, onComplete]);

  if (!active) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {pieces.map(piece => <PieceView key={piece.id} piece={piece} />)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFillObject, overflow: 'hidden', zIndex: 1000 },
  piece: { position: 'absolute' },
});
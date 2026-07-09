import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

interface ProgressBarProps {
  value: number;
  label?: string;
  color?: string;
  height?: number;
  showPercentage?: boolean;
  delay?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  color = '#d4af37',
  height = 10,
  showPercentage = true,
  delay = 0,
}) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    const targetValue = Math.min(100, Math.max(0, value));
    if (delay > 0) {
      progress.value = withDelay(
        delay,
        withTiming(targetValue, {
          duration: 1200,
          easing: Easing.out(Easing.cubic),
        })
      );
    } else {
      progress.value = withTiming(targetValue, {
        duration: 1200,
        easing: Easing.out(Easing.cubic),
      });
    }
  }, [value, delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%` as any,
  }));

  return (
    <View style={styles.container}>
      {(label || showPercentage) && (
        <View style={styles.header}>
          {label && <Text style={styles.label}>{label}</Text>}
          {showPercentage && (
            <Text style={[styles.percentage, { color }]}>{Math.round(value)}%</Text>
          )}
        </View>
      )}
      <View style={[styles.track, { height }]}>
        <Animated.View
          style={[
            styles.fill,
            { height, backgroundColor: color, borderRadius: height / 2 },
            animatedStyle,
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%', marginBottom: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  label: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '600' },
  percentage: { fontSize: 13, fontWeight: 'bold' },
  track: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 5, overflow: 'hidden' },
  fill: {},
});
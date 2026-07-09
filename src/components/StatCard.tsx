import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  color?: string;
  delay?: number;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  color = '#d4af37',
  delay = 0,
}) => {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    if (delay > 0) {
      scale.value = withDelay(
        delay,
        withTiming(1, {
          duration: 500,
          easing: Easing.bezier(0.34, 1.56, 0.64, 1),
        })
      );
      opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
      translateY.value = withDelay(
        delay,
        withTiming(0, {
          duration: 500,
          easing: Easing.out(Easing.cubic),
        })
      );
    } else {
      scale.value = withTiming(1, {
        duration: 500,
        easing: Easing.bezier(0.34, 1.56, 0.64, 1),
      });
      opacity.value = withTiming(1, { duration: 400 });
      translateY.value = withTiming(0, {
        duration: 500,
        easing: Easing.out(Easing.cubic),
      });
    }
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.container, { borderColor: color }, animatedStyle]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginHorizontal: 4,
    minWidth: 90,
  },
  icon: { fontSize: 24, marginBottom: 4 },
  value: { fontSize: 22, fontWeight: 'bold', marginBottom: 2 },
  label: { color: 'rgba(255,255,255,0.7)', fontSize: 11, textAlign: 'center' },
});
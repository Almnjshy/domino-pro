import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming,
  withRepeat, withSequence, Easing,
} from 'react-native-reanimated';

interface MedalBadgeProps {
  icon: string;
  name: string;
  color: string;
  level: number;
}

export const MedalBadge: React.FC<MedalBadgeProps> = ({ icon, name, color, level }) => {
  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0);
  const glow = useSharedValue(0.3);

  useEffect(() => {
    scale.value = withTiming(1, { duration: 700, easing: Easing.bezier(0.34, 1.56, 0.64, 1) });
    opacity.value = withTiming(1, { duration: 500 });
    glow.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1, true
    );
  }, []);

  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }], opacity: opacity.value,
  }));

  const glowStyle = useAnimatedStyle(() => ({ opacity: glow.value }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.glow, { backgroundColor: color }, glowStyle]} />
      <Animated.View style={[styles.badge, { borderColor: color }, badgeStyle]}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={[styles.level, { color }]}>Lv.{level}</Text>
      </Animated.View>
      <Text style={[styles.name, { color }]}>{name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginVertical: 20 },
  glow: { position: 'absolute', width: 180, height: 180, borderRadius: 90, opacity: 0.3 },
  badge: {
    width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(0,0,0,0.6)',
    borderWidth: 3, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5, shadowRadius: 8, elevation: 10,
  },
  icon: { fontSize: 48, marginBottom: 4 },
  level: { fontSize: 14, fontWeight: 'bold', letterSpacing: 1 },
  name: { fontSize: 20, fontWeight: 'bold', marginTop: 12, letterSpacing: 1 },
});
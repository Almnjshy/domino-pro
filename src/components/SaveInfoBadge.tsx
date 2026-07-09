import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay } from 'react-native-reanimated';

interface SaveInfoBadgeProps {
  visible: boolean;
  message?: string;
}

export const SaveInfoBadge: React.FC<SaveInfoBadgeProps> = ({ visible, message = '✓ تم الحفظ' }) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-20);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 300 });
      translateY.value = withTiming(0, { duration: 300 });
      opacity.value = withDelay(2000, withTiming(0, { duration: 300 }));
      translateY.value = withDelay(2000, withTiming(-20, { duration: 300 }));
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute', top: 70, alignSelf: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.95)', paddingHorizontal: 16,
    paddingVertical: 8, borderRadius: 20, zIndex: 100,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, shadowRadius: 4, elevation: 6,
  },
  text: { color: '#fff', fontSize: 14, fontWeight: '600' },
});
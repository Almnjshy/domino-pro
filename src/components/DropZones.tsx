import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { DropZone } from '../engines/DragEngine';

interface DropZonesProps {
  zones: DropZone[];
  visible: boolean;
}

export const DropZones: React.FC<DropZonesProps> = ({ zones, visible }) => {
  return (
    <>
      {zones.map(zone => (
        <DropZoneView key={zone.id} zone={zone} visible={visible} />
      ))}
    </>
  );
};

const DropZoneView: React.FC<{ zone: DropZone; visible: boolean }> = ({ zone, visible }) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (visible && zone.isActive) {
      opacity.value = withTiming(0.6, { duration: 300 });
      scale.value = withTiming(1, { duration: 300 });

      pulse.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 800 }),
          withTiming(1, { duration: 800 })
        ),
        -1,
        true
      );
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      scale.value = withTiming(0.8, { duration: 200 });
    }
  }, [visible, zone.isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value * pulse.value }],
  }));

  const color = zone.isActive ? '#4ecdc4' : '#ff6b6b';

  return (
    <Animated.View
      style={[
        styles.zone,
        {
          left: zone.rect.x,
          top: zone.rect.y,
          width: zone.rect.width,
          height: zone.rect.height,
          borderColor: color,
        },
        animatedStyle,
      ]}
    >
      <Animated.View style={[styles.innerGlow, { backgroundColor: color }]} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  zone: {
    position: 'absolute',
    borderRadius: 12,
    borderWidth: 3,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerGlow: {
    width: '60%',
    height: '60%',
    borderRadius: 8,
    opacity: 0.2,
  },
});
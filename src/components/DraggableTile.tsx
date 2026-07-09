import React from 'react';
import { StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { DominoTile } from './DominoTile';
import { DominoTile as DominoTileType } from '../core/types';
import { getDragEngine } from '../engines/DragEngine';

interface DraggableTileProps {
  tile: DominoTileType;
  width: number;
  height: number;
  disabled?: boolean;
  onDragStart?: () => void;
  onDragEnd?: (result: { success: boolean; side?: 'left' | 'right' }) => void;
}

export const DraggableTile: React.FC<DraggableTileProps> = ({
  tile, width, height, disabled, onDragStart, onDragEnd
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const zIndex = useSharedValue(1);

  const dragEngine = getDragEngine();
  const isDragging = useSharedValue(false);

  const selectedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
    zIndex: zIndex.value,
  }));

  const panGesture = Gesture.Pan()
    .enabled(!disabled)
    .onStart((event) => {
      'worklet';
      isDragging.value = true;
      scale.value = withSpring(1.15);
      opacity.value = withTiming(0.9);
      zIndex.value = 100;

      runOnJS(dragEngine.startDrag)(tile.id, {
        x: event.absoluteX,
        y: event.absoluteY,
      });
      if (onDragStart) runOnJS(onDragStart)();
    })
    .onUpdate((event) => {
      'worklet';
      translateX.value = event.translationX;
      translateY.value = event.translationY;

      runOnJS(dragEngine.updateDrag)({
        x: event.absoluteX,
        y: event.absoluteY,
      });
    })
    .onEnd(() => {
      'worklet';
      const result = dragEngine.endDrag();

      if (result.success) {
        opacity.value = withTiming(0, { duration: 200 });
        scale.value = withTiming(0.8, { duration: 200 });
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        scale.value = withSpring(1);
        opacity.value = withTiming(1);
        zIndex.value = 1;
      }

      isDragging.value = false;
      if (onDragEnd) {
        runOnJS(onDragEnd)({
          success: result.success,
          side: result.side,
        });
      }
    })
    .onFinalize(() => {
      'worklet';
      if (!isDragging.value) {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        scale.value = withSpring(1);
        opacity.value = withTiming(1);
        zIndex.value = 1;
      }
    });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.container, selectedStyle]}>
        <DominoTile left={tile.left} right={tile.right} width={width} height={height} />
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
});
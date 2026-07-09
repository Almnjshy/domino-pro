import { useEffect, useState, useCallback } from 'react';
import { getDragEngine, DragState, DropZone } from '../engines/DragEngine';
import { DropZoneCalculator } from '../engines/DropZoneCalculator';
import { BoardTile, TileValue, DominoTile } from '../core/types';

interface UseDragAndDropProps {
  board: BoardTile[];
  leftEnd: TileValue | null;
  rightEnd: TileValue | null;
  boardBounds: { x: number; y: number; width: number; height: number };
  tileWidth: number;
  tileHeight: number;
}

export const useDragAndDrop = ({
  board, leftEnd, rightEnd, boardBounds, tileWidth, tileHeight
}: UseDragAndDropProps) => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    tileId: null,
    startPosition: { x: 0, y: 0 },
    currentPosition: { x: 0, y: 0 },
    offsetX: 0,
    offsetY: 0,
  });

  const [dropZones, setDropZones] = useState<DropZone[]>([]);
  const dragEngine = getDragEngine();

  useEffect(() => {
    const zones = DropZoneCalculator.calculate(
      board, leftEnd, rightEnd, boardBounds, tileWidth, tileHeight
    );
    setDropZones(zones);
    dragEngine.setDropZones(zones);
  }, [board, leftEnd, rightEnd, boardBounds, tileWidth, tileHeight]);

  useEffect(() => {
    const unsubscribe = dragEngine.subscribe((state) => {
      setDragState({ ...state });
    });
    return unsubscribe;
  }, [dragEngine]);

  const updateZonesForTile = useCallback((tile: DominoTile) => {
    const updated = DropZoneCalculator.updateZoneActivation(dropZones, tile.left, tile.right);
    setDropZones(updated);
    dragEngine.setDropZones(updated);
  }, [dropZones, dragEngine]);

  return {
    dragState,
    dropZones,
    updateZonesForTile,
  };
};
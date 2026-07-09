import { Point, Rect, isPointInRect } from '../utils/geometry';
import { Side } from '../core/types';

export interface DragState {
  isDragging: boolean;
  tileId: string | null;
  startPosition: Point;
  currentPosition: Point;
  offsetX: number;
  offsetY: number;
}

export interface DropZone {
  id: string;
  side: Side;
  rect: Rect;
  tileValue: number | null;
  isActive: boolean;
}

export interface DragResult {
  success: boolean;
  tileId?: string;
  side?: Side;
  reason?: string;
}

export class DragEngine {
  private state: DragState = {
    isDragging: false,
    tileId: null,
    startPosition: { x: 0, y: 0 },
    currentPosition: { x: 0, y: 0 },
    offsetX: 0,
    offsetY: 0,
  };

  private dropZones: DropZone[] = [];
  private listeners: Array<(state: DragState) => void> = [];

  startDrag(tileId: string, position: Point): void {
    this.state = {
      isDragging: true,
      tileId,
      startPosition: position,
      currentPosition: position,
      offsetX: 0,
      offsetY: 0,
    };
    this.notify();
  }

  updateDrag(position: Point): void {
    if (!this.state.isDragging) return;
    this.state.currentPosition = position;
    this.state.offsetX = position.x - this.state.startPosition.x;
    this.state.offsetY = position.y - this.state.startPosition.y;
    this.notify();
  }

  endDrag(): DragResult {
    if (!this.state.isDragging || !this.state.tileId) {
      return { success: false, reason: 'no_drag' };
    }

    const dropZone = this.findActiveDropZone(this.state.currentPosition);

    if (dropZone) {
      const result = {
        success: true,
        tileId: this.state.tileId,
        side: dropZone.side,
      };
      this.reset();
      return result;
    }

    this.reset();
    return { success: false, reason: 'invalid_drop' };
  }

  cancelDrag(): void {
    this.reset();
  }

  setDropZones(zones: DropZone[]): void {
    this.dropZones = zones;
  }

  private findActiveDropZone(position: Point): DropZone | null {
    for (const zone of this.dropZones) {
      if (zone.isActive && isPointInRect(position, zone.rect)) {
        return zone;
      }
    }
    return null;
  }

  private reset(): void {
    this.state = {
      isDragging: false,
      tileId: null,
      startPosition: { x: 0, y: 0 },
      currentPosition: { x: 0, y: 0 },
      offsetX: 0,
      offsetY: 0,
    };
    this.notify();
  }

  getState(): DragState {
    return { ...this.state };
  }

  subscribe(listener: (state: DragState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(): void {
    for (const l of this.listeners) l(this.state);
  }
}

let dragEngineInstance: DragEngine | null = null;

export const getDragEngine = (): DragEngine => {
  if (!dragEngineInstance) {
    dragEngineInstance = new DragEngine();
  }
  return dragEngineInstance;
};
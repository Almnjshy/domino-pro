import { ObjectPool, Poolable } from './ObjectPool';
import { DominoTile } from '../core/types';

export interface PooledDomino extends Poolable {
  id: string;
  tileData: DominoTile | null;
  position: { x: number; y: number };
  rotation: number;
  scale: number;
  opacity: number;
  isActive: boolean;
  zIndex: number;
  reset(): void;
}

let dominoIdCounter = 0;

const createPooledDomino = (): PooledDomino => {
  return {
    id: `pooled-domino-${dominoIdCounter++}`,
    tileData: null,
    position: { x: 0, y: 0 },
    rotation: 0,
    scale: 1,
    opacity: 1,
    isActive: false,
    zIndex: 0,
    reset() {
      this.tileData = null;
      this.position = { x: 0, y: 0 };
      this.rotation = 0;
      this.scale = 1;
      this.opacity = 1;
      this.zIndex = 0;
    },
  };
};

export class DominoPool {
  private pool: ObjectPool<PooledDomino>;

  constructor(initialSize: number = 28, maxSize: number = 60) {
    this.pool = new ObjectPool<PooledDomino>(createPooledDomino, {
      initialSize,
      maxSize,
      autoExpand: true,
      expansionStep: 5,
    });
  }

  acquire(tile: DominoTile, position: { x: number; y: number }, rotation: number): PooledDomino | null {
    const pooled = this.pool.acquire();
    if (!pooled) return null;

    pooled.tileData = { ...tile };
    pooled.position = { ...position };
    pooled.rotation = rotation;
    pooled.scale = 1;
    pooled.opacity = 1;
    pooled.zIndex = 0;

    return pooled;
  }

  release(pooled: PooledDomino): void {
    this.pool.release(pooled);
  }

  releaseAll(): void {
    this.pool.releaseAll();
  }

  getActive(): PooledDomino[] {
    return this.pool.getActive();
  }

  getStats() {
    return this.pool.getStats();
  }

  dispose(): void {
    this.pool.dispose();
  }
}

let dominoPoolInstance: DominoPool | null = null;

export const getDominoPool = (): DominoPool => {
  if (!dominoPoolInstance) {
    dominoPoolInstance = new DominoPool();
  }
  return dominoPoolInstance;
};
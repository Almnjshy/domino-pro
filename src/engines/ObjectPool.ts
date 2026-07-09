export interface Poolable {
  id: string;
  isActive: boolean;
  reset(): void;
}

export interface PoolConfig {
  initialSize: number;
  maxSize: number;
  autoExpand: boolean;
  expansionStep: number;
}

export class ObjectPool<T extends Poolable> {
  private pool: T[] = [];
  private activeItems: Map<string, T> = new Map();
  private config: PoolConfig;
  private factory: () => T;
  private stats = {
    totalCreated: 0,
    totalReused: 0,
    peakActive: 0,
    currentActive: 0,
  };

  constructor(factory: () => T, config: Partial<PoolConfig> = {}) {
    this.factory = factory;
    this.config = {
      initialSize: config.initialSize || 10,
      maxSize: config.maxSize || 100,
      autoExpand: config.autoExpand !== false,
      expansionStep: config.expansionStep || 5,
    };
    this.initialize();
  }

  private initialize(): void {
    for (let i = 0; i < this.config.initialSize; i++) {
      const item = this.factory();
      item.isActive = false;
      this.pool.push(item);
      this.stats.totalCreated++;
    }
  }

  acquire(): T | null {
    let item = this.pool.find(p => !p.isActive);

    if (!item && this.config.autoExpand) {
      if (this.pool.length < this.config.maxSize) {
        const expandCount = Math.min(
          this.config.expansionStep,
          this.config.maxSize - this.pool.length
        );

        for (let i = 0; i < expandCount; i++) {
          const newItem = this.factory();
          newItem.isActive = false;
          this.pool.push(newItem);
          this.stats.totalCreated++;
        }

        item = this.pool.find(p => !p.isActive);
      }
    }

    if (!item) return null;

    item.isActive = true;
    this.activeItems.set(item.id, item);
    this.stats.totalReused++;
    this.stats.currentActive = this.activeItems.size;
    this.stats.peakActive = Math.max(this.stats.peakActive, this.stats.currentActive);

    return item;
  }

  release(item: T): void {
    if (!item.isActive) return;
    item.reset();
    item.isActive = false;
    this.activeItems.delete(item.id);
    this.stats.currentActive = this.activeItems.size;
  }

  releaseAll(): void {
    for (const item of this.activeItems.values()) {
      item.reset();
      item.isActive = false;
    }
    this.activeItems.clear();
    this.stats.currentActive = 0;
  }

  getActive(): T[] {
    return Array.from(this.activeItems.values());
  }

  getStats() {
    return {
      ...this.stats,
      poolSize: this.pool.length,
      available: this.pool.length - this.activeItems.size,
      reuseRate: this.stats.totalCreated > 0
        ? (this.stats.totalReused / this.stats.totalCreated * 100).toFixed(1)
        : '0',
    };
  }

  dispose(): void {
    this.releaseAll();
    this.pool = [];
  }
}
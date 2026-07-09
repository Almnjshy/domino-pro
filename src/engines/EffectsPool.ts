import { ObjectPool, Poolable } from './ObjectPool';

export type EffectType = 'confetti' | 'sparkle' | 'glow' | 'smoke';

export interface PooledEffect extends Poolable {
  id: string;
  type: EffectType;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  rotation: number;
  rotationSpeed: number;
  scale: number;
  opacity: number;
  color: string;
  lifetime: number;
  age: number;
  isActive: boolean;
  reset(): void;
}

let effectIdCounter = 0;

const createPooledEffect = (): PooledEffect => {
  return {
    id: `pooled-effect-${effectIdCounter++}`,
    type: 'confetti',
    position: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    rotation: 0,
    rotationSpeed: 0,
    scale: 1,
    opacity: 1,
    color: '#fff',
    lifetime: 3000,
    age: 0,
    isActive: false,
    reset() {
      this.type = 'confetti';
      this.position = { x: 0, y: 0 };
      this.velocity = { x: 0, y: 0 };
      this.rotation = 0;
      this.rotationSpeed = 0;
      this.scale = 1;
      this.opacity = 1;
      this.color = '#fff';
      this.lifetime = 3000;
      this.age = 0;
    },
  };
};

export class EffectsPool {
  private pool: ObjectPool<PooledEffect>;

  constructor(initialSize: number = 50, maxSize: number = 200) {
    this.pool = new ObjectPool<PooledEffect>(createPooledEffect, {
      initialSize,
      maxSize,
      autoExpand: true,
      expansionStep: 20,
    });
  }

  spawn(
    type: EffectType,
    position: { x: number; y: number },
    options: Partial<Pick<PooledEffect, 'velocity' | 'rotation' | 'rotationSpeed' | 'color' | 'lifetime'>> = {}
  ): PooledEffect | null {
    const effect = this.pool.acquire();
    if (!effect) return null;

    effect.type = type;
    effect.position = { ...position };
    effect.velocity = options.velocity || { x: 0, y: 0 };
    effect.rotation = options.rotation || 0;
    effect.rotationSpeed = options.rotationSpeed || 0;
    effect.scale = 1;
    effect.opacity = 1;
    effect.color = options.color || '#fff';
    effect.lifetime = options.lifetime || 3000;
    effect.age = 0;

    return effect;
  }

  update(deltaTime: number): void {
    const active = this.pool.getActive();
    const toRelease: PooledEffect[] = [];

    for (const effect of active) {
      effect.age += deltaTime;
      effect.position.x += effect.velocity.x * deltaTime;
      effect.position.y += effect.velocity.y * deltaTime;
      effect.rotation += effect.rotationSpeed * deltaTime;

      const lifeProgress = effect.age / effect.lifetime;
      effect.opacity = Math.max(0, 1 - lifeProgress);

      if (effect.age >= effect.lifetime) {
        toRelease.push(effect);
      }
    }

    for (const effect of toRelease) {
      this.pool.release(effect);
    }
  }

  getActive(): PooledEffect[] {
    return this.pool.getActive();
  }

  releaseAll(): void {
    this.pool.releaseAll();
  }

  getStats() {
    return this.pool.getStats();
  }

  dispose(): void {
    this.pool.dispose();
  }
}

let effectsPoolInstance: EffectsPool | null = null;

export const getEffectsPool = (): EffectsPool => {
  if (!effectsPoolInstance) {
    effectsPoolInstance = new EffectsPool();
  }
  return effectsPoolInstance;
};
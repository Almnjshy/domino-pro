import { useEffect, useState, useCallback } from 'react';
import { getDominoPool } from '../engines/DominoPool';
import { getEffectsPool } from '../engines/EffectsPool';
import { getPerformanceMonitor, PerformanceStats } from '../engines/PerformanceMonitor';
import { DominoTile } from '../core/types';

export const useDominoPool = () => {
  const pool = getDominoPool();

  const acquireTile = useCallback((
    tile: DominoTile,
    position: { x: number; y: number },
    rotation: number
  ) => {
    return pool.acquire(tile, position, rotation);
  }, [pool]);

  const releaseTile = useCallback((pooledId: string) => {
    const active = pool.getActive();
    const pooled = active.find(p => p.id === pooledId);
    if (pooled) pool.release(pooled);
  }, [pool]);

  const releaseAll = useCallback(() => { pool.releaseAll(); }, [pool]);
  const getActive = useCallback(() => pool.getActive(), [pool]);
  const getStats = useCallback(() => pool.getStats(), [pool]);

  return { acquireTile, releaseTile, releaseAll, getActive, getStats };
};

export const useEffectsPool = () => {
  const pool = getEffectsPool();

  const spawn = useCallback((
    type: 'confetti' | 'sparkle' | 'glow' | 'smoke',
    position: { x: number; y: number },
    options?: any
  ) => {
    return pool.spawn(type, position, options);
  }, [pool]);

  const update = useCallback((deltaTime: number) => { pool.update(deltaTime); }, [pool]);
  const getActive = useCallback(() => pool.getActive(), [pool]);
  const releaseAll = useCallback(() => pool.releaseAll(), [pool]);

  return { spawn, update, getActive, releaseAll };
};

export const usePerformanceMonitor = () => {
  const [stats, setStats] = useState<PerformanceStats | null>(null);
  const monitor = getPerformanceMonitor();

  useEffect(() => {
    monitor.start();
    const unsubscribe = monitor.subscribe((newStats) => {
      setStats({ ...newStats });
    });
    return () => {
      unsubscribe();
      monitor.stop();
    };
  }, [monitor]);

  return stats;
};
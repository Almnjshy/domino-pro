export interface PerformanceStats {
  fps: number;
  frameTime: number;
  memoryUsage: number;
}

export class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = Date.now();
  private fps = 60;
  private frameTime = 16.67;
  private listeners: Array<(stats: PerformanceStats) => void> = [];
  private isRunning = false;
  private intervalId: NodeJS.Timeout | null = null;

  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = Date.now();
    this.intervalId = setInterval(() => {
      const now = Date.now();
      this.frameCount++;

      if (now - this.lastTime >= 1000) {
        this.fps = this.frameCount;
        this.frameTime = 1000 / this.fps;
        this.frameCount = 0;
        this.lastTime = now;
        this.notify();
      }
    }, 16);
  }

  stop(): void {
    this.isRunning = false;
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  getStats(): PerformanceStats {
    return {
      fps: this.fps,
      frameTime: this.frameTime,
      memoryUsage: 0,
    };
  }

  subscribe(listener: (stats: PerformanceStats) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(): void {
    const stats = this.getStats();
    for (const l of this.listeners) l(stats);
  }

  dispose(): void {
    this.stop();
    this.listeners = [];
  }
}

let monitorInstance: PerformanceMonitor | null = null;

export const getPerformanceMonitor = (): PerformanceMonitor => {
  if (!monitorInstance) {
    monitorInstance = new PerformanceMonitor();
  }
  return monitorInstance;
};
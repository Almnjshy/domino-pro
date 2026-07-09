import { StatisticsEngine, GameStatistics, RoundResult, DEFAULT_STATISTICS } from '../engines/StatisticsEngine';
import { StatisticsStorage } from '../store/StatisticsStorage';

type StatsListener = (stats: GameStatistics) => void;

export class StatisticsManager {
  private static instance: StatisticsManager | null = null;
  private stats: GameStatistics = { ...DEFAULT_STATISTICS };
  private listeners: StatsListener[] = [];
  private isInitialized = false;
  private saveTimer: NodeJS.Timeout | null = null;

  private constructor() {}

  static getInstance(): StatisticsManager {
    if (!StatisticsManager.instance) StatisticsManager.instance = new StatisticsManager();
    return StatisticsManager.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    this.stats = await StatisticsStorage.load();
    this.isInitialized = true;
    this.notify();
  }

  async recordRoundResult(result: RoundResult): Promise<void> {
    this.stats = StatisticsEngine.updateAfterRound(this.stats, result);
    this.notify();
    this.debounceSave();
  }

  async recordGameStart(): Promise<void> {
    this.stats = StatisticsEngine.updateOnGameStart(this.stats);
    this.notify();
    this.debounceSave();
  }

  async reset(): Promise<void> {
    this.stats = StatisticsEngine.reset();
    await StatisticsStorage.clear();
    this.notify();
  }

  getStats(): GameStatistics { return { ...this.stats }; }
  getLevel() { return StatisticsEngine.calculateLevel(this.stats); }
  getRank() {
    const { level } = StatisticsEngine.calculateLevel(this.stats);
    return StatisticsEngine.calculateRank(level);
  }

  private debounceSave(): void {
    if (this.saveTimer) clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(async () => {
      await StatisticsStorage.save(this.stats);
    }, 1000);
  }

  subscribe(listener: StatsListener): () => void {
    this.listeners.push(listener);
    return () => { this.listeners = this.listeners.filter(l => l !== listener); };
  }

  private notify(): void { for (const l of this.listeners) l(this.stats); }

  dispose(): void {
    if (this.saveTimer) clearTimeout(this.saveTimer);
    this.listeners = [];
  }
}

export const statisticsManager = {
  init: () => StatisticsManager.getInstance().initialize(),
  recordRound: (result: RoundResult) => StatisticsManager.getInstance().recordRoundResult(result),
  recordGameStart: () => StatisticsManager.getInstance().recordGameStart(),
  reset: () => StatisticsManager.getInstance().reset(),
  getStats: () => StatisticsManager.getInstance().getStats(),
  getLevel: () => StatisticsManager.getInstance().getLevel(),
  getRank: () => StatisticsManager.getInstance().getRank(),
  subscribe: (l: StatsListener) => StatisticsManager.getInstance().subscribe(l),
  dispose: () => StatisticsManager.getInstance().dispose(),
};
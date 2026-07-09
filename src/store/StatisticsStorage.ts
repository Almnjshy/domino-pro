import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameStatistics, DEFAULT_STATISTICS } from '../engines/StatisticsEngine';

const STATS_KEY = '@domino_statistics';
const STATS_VERSION = 1;

export class StatisticsStorage {
  static async save(stats: GameStatistics): Promise<boolean> {
    try {
      await AsyncStorage.setItem(STATS_KEY, JSON.stringify({ version: STATS_VERSION, data: stats }));
      return true;
    } catch (error) {
      console.error('[StatisticsStorage] Save failed:', error);
      return false;
    }
  }

  static async load(): Promise<GameStatistics> {
    try {
      const json = await AsyncStorage.getItem(STATS_KEY);
      if (!json) return { ...DEFAULT_STATISTICS };
      const stored = JSON.parse(json);
      if (stored.version !== STATS_VERSION) return { ...DEFAULT_STATISTICS };
      return {
        ...DEFAULT_STATISTICS, ...stored.data,
        gamesByMode: { ...DEFAULT_STATISTICS.gamesByMode, ...stored.data.gamesByMode },
        winsByMode: { ...DEFAULT_STATISTICS.winsByMode, ...stored.data.winsByMode },
        records: { ...DEFAULT_STATISTICS.records, ...stored.data.records },
      };
    } catch (error) {
      console.error('[StatisticsStorage] Load failed:', error);
      return { ...DEFAULT_STATISTICS };
    }
  }

  static async clear(): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(STATS_KEY);
      return true;
    } catch (error) {
      console.error('[StatisticsStorage] Clear failed:', error);
      return false;
    }
  }
}
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SaveData } from '../engines/SaveEngine';

const SAVE_KEY = '@domino_current_save';
const AUTO_SAVE_KEY = '@domino_auto_save_enabled';
const LAST_SAVE_TIME_KEY = '@domino_last_save_time';

export class SaveStorage {
  static async save(saveData: SaveData): Promise<boolean> {
    try {
      await AsyncStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
      await AsyncStorage.setItem(LAST_SAVE_TIME_KEY, Date.now().toString());
      return true;
    } catch (error) {
      console.error('[SaveStorage] Save failed:', error);
      return false;
    }
  }

  static async load(): Promise<SaveData | null> {
    try {
      const json = await AsyncStorage.getItem(SAVE_KEY);
      if (!json) return null;
      return JSON.parse(json);
    } catch (error) {
      console.error('[SaveStorage] Load failed:', error);
      return null;
    }
  }

  static async clear(): Promise<boolean> {
    try {
      await AsyncStorage.multiRemove([SAVE_KEY, LAST_SAVE_TIME_KEY]);
      return true;
    } catch (error) {
      console.error('[SaveStorage] Clear failed:', error);
      return false;
    }
  }

  static async exists(): Promise<boolean> {
    try {
      const json = await AsyncStorage.getItem(SAVE_KEY);
      return json !== null;
    } catch { return false; }
  }

  static async getMetadata(): Promise<{
    timestamp: number;
    roundNumber: number;
    humanPlayerScore: number;
    humanTilesRemaining: number;
  } | null> {
    try {
      const json = await AsyncStorage.getItem(SAVE_KEY);
      if (!json) return null;
      const data = JSON.parse(json);
      return {
        timestamp: data.timestamp,
        roundNumber: data.metadata?.roundNumber || 1,
        humanPlayerScore: data.metadata?.humanPlayerScore || 0,
        humanTilesRemaining: data.metadata?.humanTilesRemaining || 0,
      };
    } catch { return null; }
  }

  static async isAutoSaveEnabled(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(AUTO_SAVE_KEY);
      return value !== 'false';
    } catch { return true; }
  }

  static async setAutoSaveEnabled(enabled: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(AUTO_SAVE_KEY, enabled.toString());
    } catch (error) {
      console.error('[SaveStorage] Set auto-save failed:', error);
    }
  }
}
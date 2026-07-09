import AsyncStorage from '@react-native-async-storage/async-storage';
import { audio, AudioSettings } from '../engines/AudioEngine';

const STORAGE_KEY = '@domino_audio_settings';

export const AudioStorage = {
  async save(settings: AudioSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('[AudioStorage] Save failed:', error);
    }
  },

  async load(): Promise<Partial<AudioSettings> | null> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (error) {
      console.error('[AudioStorage] Load failed:', error);
      return null;
    }
  },

  async initialize(): Promise<void> {
    const saved = await this.load();
    if (saved) await audio.updateSettings(saved);
    audio.subscribe((settings) => { this.save(settings); });
  },
};
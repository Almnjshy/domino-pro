import { Audio, Sound } from 'expo-av';
import { SOUNDS } from './SoundDefinitions';

export interface AudioSettings {
  masterVolume: number;
  sfxVolume: number;
  musicVolume: number;
  ambientVolume: number;
  isMuted: boolean;
  currentTrackId: string;
}

const DEFAULT_SETTINGS: AudioSettings = {
  masterVolume: 1.0,
  sfxVolume: 0.8,
  musicVolume: 0.5,
  ambientVolume: 0.4,
  isMuted: false,
  currentTrackId: 'bg_menu',
};

type SettingsListener = (settings: AudioSettings) => void;

export class AudioEngine {
  private static instance: AudioEngine | null = null;
  private settings: AudioSettings = { ...DEFAULT_SETTINGS };
  private loadedSounds: Map<string, Sound> = new Map();
  private activeInstances: Map<string, Sound[]> = new Map();
  private currentMusic: Sound | null = null;
  private currentMusicId: string | null = null;
  private listeners: SettingsListener[] = [];
  private isInitialized = false;

  private constructor() {}

  static getInstance(): AudioEngine {
    if (!AudioEngine.instance) {
      AudioEngine.instance = new AudioEngine();
    }
    return AudioEngine.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });
      this.isInitialized = true;
      console.log('[AudioEngine] Initialized');
    } catch (error) {
      console.error('[AudioEngine] Init failed:', error);
    }
  }

  async play(soundId: string, options?: { volume?: number }): Promise<void> {
    if (this.settings.isMuted) return;
    const def = SOUNDS[soundId];
    if (!def) return;

    const categoryVolume = this.getCategoryVolume(def.category);
    const finalVolume = (options?.volume ?? def.volume) * categoryVolume * this.settings.masterVolume;
    if (finalVolume <= 0) return;

    const active = this.activeInstances.get(soundId) || [];
    if (active.length >= def.maxInstances) {
      const oldest = active.shift();
      if (oldest) try { await oldest.stopAsync(); } catch {}
    }

    try {
      let sound = this.loadedSounds.get(soundId);
      if (!sound) {
        const { sound: newSound } = await Audio.Sound.createAsync(
          def.file, { shouldPlay: false, isLooping: false }, undefined, false
        );
        sound = newSound;
        this.loadedSounds.set(soundId, sound);
      }
      await sound.setPositionAsync(0);
      await sound.setVolumeAsync(finalVolume);
      await sound.playAsync();

      if (!this.activeInstances.has(soundId)) {
        this.activeInstances.set(soundId, []);
      }
      this.activeInstances.get(soundId)!.push(sound);
    } catch (error) {
      console.error(`[AudioEngine] Play ${soundId} failed:`, error);
    }
  }

  async playMusic(trackId: string): Promise<void> {
    if (trackId === 'none' || this.settings.isMuted) {
      await this.stopMusic();
      this.settings.currentTrackId = trackId;
      this.notifyListeners();
      return;
    }
    if (this.currentMusicId === trackId && this.currentMusic) return;
    await this.stopMusic();

    const def = SOUNDS[trackId];
    if (!def) return;

    try {
      const { sound } = await Audio.Sound.createAsync(
        def.file,
        { shouldPlay: true, isLooping: true,
          volume: this.settings.musicVolume * this.settings.masterVolume },
        undefined, false
      );
      this.currentMusic = sound;
      this.currentMusicId = trackId;
      this.settings.currentTrackId = trackId;
      this.notifyListeners();
    } catch (error) {
      console.error('[AudioEngine] Play music failed:', error);
    }
  }

  async stopMusic(): Promise<void> {
    if (this.currentMusic) {
      try {
        await this.currentMusic.stopAsync();
        await this.currentMusic.unloadAsync();
      } catch {}
      this.currentMusic = null;
      this.currentMusicId = null;
    }
  }

  getSettings(): AudioSettings { return { ...this.settings }; }

  async updateSettings(partial: Partial<AudioSettings>): Promise<void> {
    this.settings = { ...this.settings, ...partial };
    if (this.currentMusic && partial.musicVolume !== undefined) {
      const vol = this.settings.musicVolume * this.settings.masterVolume;
      try { await this.currentMusic.setVolumeAsync(this.settings.isMuted ? 0 : vol); } catch {}
    }
    this.notifyListeners();
  }

  async toggleMute(): Promise<void> {
    await this.updateSettings({ isMuted: !this.settings.isMuted });
  }

  private getCategoryVolume(category: string): number {
    switch (category) {
      case 'sfx': return this.settings.sfxVolume;
      case 'music': return this.settings.musicVolume;
      case 'ambient': return this.settings.ambientVolume;
      default: return 1;
    }
  }

  subscribe(listener: SettingsListener): () => void {
    this.listeners.push(listener);
    return () => { this.listeners = this.listeners.filter(l => l !== listener); };
  }

  private notifyListeners(): void {
    for (const l of this.listeners) l(this.settings);
  }

  async dispose(): Promise<void> {
    for (const [, sound] of this.loadedSounds) {
      try { await sound.unloadAsync(); } catch {}
    }
    this.loadedSounds.clear();
    this.isInitialized = false;
  }
}

export const audio = {
  init: () => AudioEngine.getInstance().initialize(),
  play: (id: string, opts?: any) => AudioEngine.getInstance().play(id, opts),
  playMusic: (id: string) => AudioEngine.getInstance().playMusic(id),
  stopMusic: () => AudioEngine.getInstance().stopMusic(),
  getSettings: () => AudioEngine.getInstance().getSettings(),
  updateSettings: (s: Partial<AudioSettings>) => AudioEngine.getInstance().updateSettings(s),
  toggleMute: () => AudioEngine.getInstance().toggleMute(),
  subscribe: (l: SettingsListener) => AudioEngine.getInstance().subscribe(l),
  dispose: () => AudioEngine.getInstance().dispose(),
};
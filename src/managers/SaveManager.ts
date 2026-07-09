import { GameState } from '../core/types';
import { SaveEngine, SaveData } from '../engines/SaveEngine';
import { SaveStorage } from '../store/SaveStorage';

export interface SaveConfig {
  playerCount: number;
  mode: 'classic' | 'draw' | 'block';
  themeId: string;
  targetScore: number;
}

export interface SaveManagerState {
  hasSave: boolean;
  isLoading: boolean;
  isSaving: boolean;
  lastSaveTime: number | null;
  autoSaveEnabled: boolean;
  metadata: {
    timestamp: number;
    roundNumber: number;
    humanPlayerScore: number;
    humanTilesRemaining: number;
  } | null;
}

type StateListener = (state: SaveManagerState) => void;

export class SaveManager {
  private static instance: SaveManager | null = null;
  private state: SaveManagerState = {
    hasSave: false, isLoading: false, isSaving: false,
    lastSaveTime: null, autoSaveEnabled: true, metadata: null,
  };
  private autoSaveTimer: NodeJS.Timeout | null = null;
  private listeners: StateListener[] = [];
  private isInitialized = false;

  private constructor() {}

  static getInstance(): SaveManager {
    if (!SaveManager.instance) SaveManager.instance = new SaveManager();
    return SaveManager.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    const exists = await SaveStorage.exists();
    const metadata = await SaveStorage.getMetadata();
    const autoSaveEnabled = await SaveStorage.isAutoSaveEnabled();
    this.state = { ...this.state, hasSave: exists && metadata !== null, autoSaveEnabled, metadata };
    this.isInitialized = true;
    this.notify();
  }

  async saveManually(state: GameState, config: SaveConfig): Promise<boolean> {
    if (this.state.isSaving) return false;
    this.state.isSaving = true;
    this.notify();

    try {
      const saveData = SaveEngine.serialize(state, config);
      const success = await SaveStorage.save(saveData);
      if (success) {
        this.state.hasSave = true;
        this.state.lastSaveTime = Date.now();
        this.state.metadata = {
          timestamp: saveData.timestamp,
          roundNumber: saveData.metadata.roundNumber,
          humanPlayerScore: saveData.metadata.humanPlayerScore,
          humanTilesRemaining: saveData.metadata.humanTilesRemaining,
        };
      }
      this.state.isSaving = false;
      this.notify();
      return success;
    } catch (error) {
      console.error('[SaveManager] Save failed:', error);
      this.state.isSaving = false;
      this.notify();
      return false;
    }
  }

  async resumeGame(): Promise<{ state: GameState; config: SaveConfig } | null> {
    if (this.state.isLoading) return null;
    this.state.isLoading = true;
    this.notify();

    try {
      const saveData = await SaveStorage.load();
      if (!saveData || !SaveEngine.isValid(saveData)) {
        this.state.isLoading = false;
        this.notify();
        return null;
      }
      const state = SaveEngine.deserialize(saveData);
      if (!state) {
        this.state.isLoading = false;
        this.notify();
        return null;
      }
      const config: SaveConfig = {
        playerCount: saveData.gameConfig.playerCount,
        mode: saveData.gameConfig.mode,
        themeId: saveData.gameConfig.themeId,
        targetScore: saveData.gameConfig.targetScore,
      };
      this.state.isLoading = false;
      this.notify();
      return { state, config };
    } catch (error) {
      console.error('[SaveManager] Resume failed:', error);
      this.state.isLoading = false;
      this.notify();
      return null;
    }
  }

  async deleteSave(): Promise<boolean> {
    const success = await SaveStorage.clear();
    if (success) {
      this.state.hasSave = false;
      this.state.lastSaveTime = null;
      this.state.metadata = null;
      this.stopAutoSave();
      this.notify();
    }
    return success;
  }

  startAutoSave(getState: () => GameState, getConfig: () => SaveConfig | null): void {
    this.stopAutoSave();
    if (!this.state.autoSaveEnabled) return;
    this.autoSaveTimer = setInterval(async () => {
      const state = getState();
      const config = getConfig();
      if (state && config && !state.isGameOver) {
        await this.saveManually(state, config);
      }
    }, 30000);
  }

  stopAutoSave(): void {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
  }

  getState(): SaveManagerState { return { ...this.state }; }

  subscribe(listener: StateListener): () => void {
    this.listeners.push(listener);
    return () => { this.listeners = this.listeners.filter(l => l !== listener); };
  }

  private notify(): void { for (const l of this.listeners) l(this.state); }

  dispose(): void {
    this.stopAutoSave();
    this.listeners = [];
  }
}

export const saveManager = {
  init: () => SaveManager.getInstance().initialize(),
  save: (state: GameState, config: SaveConfig) => SaveManager.getInstance().saveManually(state, config),
  resume: () => SaveManager.getInstance().resumeGame(),
  delete: () => SaveManager.getInstance().deleteSave(),
  startAutoSave: (getState: () => GameState, getConfig: () => SaveConfig | null) =>
    SaveManager.getInstance().startAutoSave(getState, getConfig),
  stopAutoSave: () => SaveManager.getInstance().stopAutoSave(),
  getState: () => SaveManager.getInstance().getState(),
  subscribe: (l: StateListener) => SaveManager.getInstance().subscribe(l),
  dispose: () => SaveManager.getInstance().dispose(),
};
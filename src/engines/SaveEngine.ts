import { GameState, DominoTile } from '../core/types';
import { computeChecksum, verifyChecksum } from '../utils/checksum';

export const SAVE_VERSION = 1;

export interface SaveData {
  version: number;
  timestamp: number;
  checksum: string;
  gameConfig: {
    playerCount: number;
    mode: 'classic' | 'draw' | 'block';
    themeId: string;
    targetScore: number;
  };
  state: any;
  metadata: {
    roundNumber: number;
    humanPlayerScore: number;
    humanTilesRemaining: number;
    turnCount: number;
    isGameOver: boolean;
  };
}

export class SaveEngine {
  static serialize(
    state: GameState,
    gameConfig: { playerCount: number; mode: string; themeId: string; targetScore: number }
  ): SaveData {
    const serializedState = JSON.parse(JSON.stringify(state));
    const humanPlayer = state.players.find(p => p.isHuman);

    const saveData: SaveData = {
      version: SAVE_VERSION,
      timestamp: Date.now(),
      checksum: '',
      gameConfig: {
        playerCount: gameConfig.playerCount,
        mode: gameConfig.mode as any,
        themeId: gameConfig.themeId,
        targetScore: gameConfig.targetScore,
      },
      state: serializedState,
      metadata: {
        roundNumber: state.roundNumber,
        humanPlayerScore: humanPlayer?.score || 0,
        humanTilesRemaining: humanPlayer?.hand.length || 0,
        turnCount: state.turnCount,
        isGameOver: state.isGameOver,
      },
    };

    const dataString = JSON.stringify({
      version: saveData.version,
      gameConfig: saveData.gameConfig,
      state: saveData.state,
      metadata: saveData.metadata,
    });
    saveData.checksum = computeChecksum(dataString);
    return saveData;
  }

  static deserialize(saveData: SaveData): GameState | null {
    if (saveData.version !== SAVE_VERSION) return null;

    const dataString = JSON.stringify({
      version: saveData.version,
      gameConfig: saveData.gameConfig,
      state: saveData.state,
      metadata: saveData.metadata,
    });

    if (!verifyChecksum(dataString, saveData.checksum)) {
      console.error('[SaveEngine] Checksum failed');
      return null;
    }

    try {
      return saveData.state as GameState;
    } catch (error) {
      console.error('[SaveEngine] Deserialize error:', error);
      return null;
    }
  }

  static isValid(saveData: any): saveData is SaveData {
    if (!saveData || typeof saveData !== 'object') return false;
    if (typeof saveData.version !== 'number') return false;
    if (typeof saveData.timestamp !== 'number') return false;
    if (typeof saveData.checksum !== 'string') return false;
    if (!saveData.gameConfig || !saveData.state || !saveData.metadata) return false;
    return true;
  }
}
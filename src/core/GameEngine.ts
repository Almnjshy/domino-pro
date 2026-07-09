import { GameState, Player, GameMode, Move, LayoutConfig } from './types';
import { RulesEngine } from './RulesEngine';
import { SnakeLayoutEngine } from './SnakeLayoutEngine';
import { AIEngine } from './AIEngine';

export class GameEngine {
  private state: GameState;
  private snakeEngine: SnakeLayoutEngine;
  private listeners: Array<(state: GameState) => void> = [];

  constructor(layoutConfig: LayoutConfig) {
    this.snakeEngine = new SnakeLayoutEngine(layoutConfig);
    this.state = this.createInitialState();
  }

  private createInitialState(): GameState {
    return {
      players: [], currentPlayerIndex: 0, board: [], boneyard: [],
      leftEnd: null, rightEnd: null, mode: 'classic',
      isGameOver: false, winnerId: null, roundNumber: 1,
      targetScore: 100, turnCount: 0, consecutivePasses: 0,
    };
  }

  setupMatch(playerCount: number, mode: GameMode, humanId: string): void {
    this.snakeEngine.reset();
    const allTiles = RulesEngine.shuffle(RulesEngine.createFullSet());
    const positions: Array<'bottom' | 'left' | 'top' | 'right'> =
      playerCount === 2 ? ['bottom', 'top'] :
      playerCount === 3 ? ['bottom', 'left', 'right'] :
      ['bottom', 'left', 'top', 'right'];

    const players: Player[] = [];
    for (let i = 0; i < playerCount; i++) {
      const isHuman = i === 0;
      players.push({
        id: isHuman ? humanId : `ai-${i}`,
        name: isHuman ? 'أنت' : `خصم ${i}`,
        isHuman, hand: allTiles.splice(0, 7), score: 0,
        position: positions[i],
        difficulty: isHuman ? undefined : (i === 1 ? 'hard' : 'medium'),
      });
    }

    let starter = 0;
    let highestDouble = -1;
    players.forEach((p, i) => {
      p.hand.forEach(tile => {
        if (tile.isDouble && tile.left > highestDouble) {
          highestDouble = tile.left; starter = i;
        }
      });
    });

    this.state = {
      ...this.state, players, boneyard: allTiles, board: [],
      leftEnd: null, rightEnd: null, mode,
      currentPlayerIndex: starter,
    };
    this.notify();
  }

  playHumanMove(tileId: string, side: 'left' | 'right'): boolean {
    const player = this.state.players[this.state.currentPlayerIndex];
    if (!player.isHuman) return false;
    const legalMoves = RulesEngine.getLegalMoves(this.state, player.id);
    if (!legalMoves.some(m => m.tileId === tileId && m.side === side)) return false;

    this.state = RulesEngine.applyMove(this.state, { playerId: player.id, tileId, side });
    this.updateBoardPosition(side);
    this.checkGameEnd();
    this.notify();
    return true;
  }

  playAIMove(): void {
    const player = this.state.players[this.state.currentPlayerIndex];
    if (player.isHuman || !player.difficulty) return;

    const decision = AIEngine.decide(this.state, player.id, player.difficulty);
    if (!decision) {
      this.handleNoMove(player.id);
      return;
    }

    this.state = RulesEngine.applyMove(this.state, {
      playerId: player.id, tileId: decision.tileId, side: decision.side,
    });
    this.updateBoardPosition(decision.side);
    this.checkGameEnd();
    this.notify();
  }

  private handleNoMove(playerId: string): void {
    if (this.state.mode === 'draw' && this.state.boneyard.length > 0) {
      this.state = RulesEngine.applyMove(this.state, {
        playerId, tileId: '', side: 'left', isDraw: true,
      });
    } else {
      this.state = RulesEngine.applyMove(this.state, {
        playerId, tileId: '', side: 'left', isPass: true,
      });
    }
    this.checkGameEnd();
    this.notify();
  }

  private updateBoardPosition(side: 'left' | 'right'): void {
    if (this.state.board.length === 0) return;
    const lastTile = this.state.board[this.state.board.length - 1];
    const placed = this.snakeEngine.placeTile(this.state.board, lastTile, side);
    this.state.board[this.state.board.length - 1] = placed;
  }

  private checkGameEnd(): void {
    const result = RulesEngine.checkGameOver(this.state);
    if (result.over) {
      this.state.isGameOver = true;
      this.state.winnerId = result.winnerId;
      if (result.winnerId) {
        const scores = RulesEngine.calculateRoundScore(this.state, result.winnerId);
        for (const player of this.state.players) {
          player.score += scores[player.id] || 0;
        }
      }
    }
  }

  startNewRound(): void {
    this.snakeEngine.reset();
    const allTiles = RulesEngine.shuffle(RulesEngine.createFullSet());
    const players: Player[] = this.state.players.map(p => ({
      ...p, hand: allTiles.splice(0, 7),
    }));

    let starter = 0;
    let highestDouble = -1;
    players.forEach((p, i) => {
      p.hand.forEach(tile => {
        if (tile.isDouble && tile.left > highestDouble) {
          highestDouble = tile.left; starter = i;
        }
      });
    });

    this.state = {
      ...this.state, players, boneyard: allTiles, board: [],
      leftEnd: null, rightEnd: null,
      isGameOver: false, winnerId: null,
      roundNumber: this.state.roundNumber + 1,
      currentPlayerIndex: starter,
      turnCount: 0, consecutivePasses: 0,
    };
    this.notify();
  }

  subscribe(listener: (state: GameState) => void): () => void {
    this.listeners.push(listener);
    return () => { this.listeners = this.listeners.filter(l => l !== listener); };
  }

  private notify(): void { for (const l of this.listeners) l(this.state); }
  getState(): GameState { return this.state; }
}
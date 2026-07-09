import { DominoTile, GameState, Move, TileValue } from './types';

export class RulesEngine {
  static createFullSet(): DominoTile[] {
    const tiles: DominoTile[] = [];
    let id = 0;
    for (let i = 0; i <= 6; i++) {
      for (let j = i; j <= 6; j++) {
        tiles.push({
          id: `tile-${id++}`,
          left: i as TileValue,
          right: j as TileValue,
          isDouble: i === j,
        });
      }
    }
    return tiles;
  }

  static shuffle<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  static canPlayTile(tile: DominoTile, leftEnd: TileValue | null, rightEnd: TileValue | null) {
    if (leftEnd === null || rightEnd === null) return { left: true, right: true };
    return {
      left: tile.left === leftEnd || tile.right === leftEnd,
      right: tile.left === rightEnd || tile.right === rightEnd,
    };
  }

  static getLegalMoves(state: GameState, playerId: string): Move[] {
    const player = state.players.find(p => p.id === playerId);
    if (!player) return [];
    const moves: Move[] = [];
    for (const tile of player.hand) {
      const { left, right } = this.canPlayTile(tile, state.leftEnd, state.rightEnd);
      if (left) moves.push({ playerId, tileId: tile.id, side: 'left' });
      if (right && state.board.length > 0) moves.push({ playerId, tileId: tile.id, side: 'right' });
    }
    return moves;
  }

  static hasLegalMove(state: GameState, playerId: string): boolean {
    return this.getLegalMoves(state, playerId).length > 0;
  }

  static applyMove(state: GameState, move: Move): GameState {
    const newState = JSON.parse(JSON.stringify(state)) as GameState;
    const player = newState.players.find(p => p.id === move.playerId);
    if (!player) return state;

    if (move.isDraw) {
      if (newState.boneyard.length > 0) player.hand.push(newState.boneyard.pop()!);
      return newState;
    }
    if (move.isPass) {
      newState.consecutivePasses++;
      newState.currentPlayerIndex = (newState.currentPlayerIndex + 1) % newState.players.length;
      newState.turnCount++;
      return newState;
    }

    const tileIndex = player.hand.findIndex(t => t.id === move.tileId);
    if (tileIndex === -1) return state;
    const tile = player.hand[tileIndex];
    player.hand.splice(tileIndex, 1);

    const boardTile = {
      ...tile, x: 0, y: 0, rotation: 0, placedAt: Date.now(),
      leftConnection: tile.left, rightConnection: tile.right,
    };

    if (newState.board.length === 0) {
      newState.leftEnd = tile.left;
      newState.rightEnd = tile.right;
    } else if (move.side === 'left') {
      if (tile.right === newState.leftEnd) {
        boardTile.leftConnection = tile.left;
        boardTile.rightConnection = tile.right;
      } else {
        boardTile.leftConnection = tile.right;
        boardTile.rightConnection = tile.left;
      }
      newState.leftEnd = boardTile.leftConnection;
    } else {
      if (tile.left === newState.rightEnd) {
        boardTile.leftConnection = tile.left;
        boardTile.rightConnection = tile.right;
      } else {
        boardTile.leftConnection = tile.right;
        boardTile.rightConnection = tile.left;
      }
      newState.rightEnd = boardTile.rightConnection;
    }

    newState.board.push(boardTile);
    newState.consecutivePasses = 0;
    newState.turnCount++;
    newState.currentPlayerIndex = (newState.currentPlayerIndex + 1) % newState.players.length;
    return newState;
  }

  static checkGameOver(state: GameState) {
    for (const player of state.players) {
      if (player.hand.length === 0) {
        return { over: true, winnerId: player.id, reason: 'empty_hand' };
      }
    }
    if (state.consecutivePasses >= state.players.length) {
      let minPoints = Infinity, winnerId: string | null = null;
      for (const player of state.players) {
        const points = player.hand.reduce((sum, t) => sum + t.left + t.right, 0);
        if (points < minPoints) { minPoints = points; winnerId = player.id; }
      }
      return { over: true, winnerId, reason: 'blocked' };
    }
    return { over: false, winnerId: null, reason: '' };
  }

  static calculateRoundScore(state: GameState, winnerId: string) {
    const scores: Record<string, number> = {};
    const total = state.players.filter(p => p.id !== winnerId)
      .reduce((sum, p) => sum + p.hand.reduce((s, t) => s + t.left + t.right, 0), 0);
    for (const player of state.players) {
      scores[player.id] = player.id === winnerId ? total : 0;
    }
    return scores;
  }
}
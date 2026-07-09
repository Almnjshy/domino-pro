import { GameState, DominoTile, Move } from './types';
import { RulesEngine } from './RulesEngine';

export class AIEngine {
  static decide(state: GameState, playerId: string, difficulty: 'easy' | 'medium' | 'hard') {
    const legalMoves = RulesEngine.getLegalMoves(state, playerId);
    if (legalMoves.length === 0) return null;

    switch (difficulty) {
      case 'easy': return this.easyDecision(legalMoves);
      case 'medium': return this.mediumDecision(state, playerId, legalMoves);
      case 'hard': return this.hardDecision(state, playerId, legalMoves);
    }
  }

  private static easyDecision(moves: Move[]) {
    const move = moves[Math.floor(Math.random() * moves.length)];
    return { tileId: move.tileId, side: move.side, score: 0 };
  }

  private static mediumDecision(state: GameState, playerId: string, moves: Move[]) {
    const player = state.players.find(p => p.id === playerId)!;
    let bestMove = moves[0];
    let bestScore = -Infinity;

    for (const move of moves) {
      const tile = player.hand.find(t => t.id === move.tileId)!;
      let score = (tile.left + tile.right) * 2;
      if (tile.isDouble) score += 10;
      if (score > bestScore) { bestScore = score; bestMove = move; }
    }
    return { tileId: bestMove.tileId, side: bestMove.side, score: bestScore };
  }

  private static hardDecision(state: GameState, playerId: string, moves: Move[]) {
    const player = state.players.find(p => p.id === playerId)!;
    let bestMove = moves[0];
    let bestScore = -Infinity;

    for (const move of moves) {
      const tile = player.hand.find(t => t.id === move.tileId)!;
      let score = (tile.left + tile.right) * 2;
      if (tile.isDouble) score += 15;
      const remainingHand = player.hand.filter(t => t.id !== move.tileId);
      score += (7 - remainingHand.length) * 5;
      if (score > bestScore) { bestScore = score; bestMove = move; }
    }
    return { tileId: bestMove.tileId, side: bestMove.side, score: bestScore };
  }
}
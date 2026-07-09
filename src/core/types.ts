export type TileValue = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface DominoTile {
  id: string;
  left: TileValue;
  right: TileValue;
  isDouble: boolean;
}

export interface BoardTile extends DominoTile {
  x: number;
  y: number;
  rotation: number;
  placedAt: number;
  leftConnection: TileValue;
  rightConnection: TileValue;
}

export type Side = 'left' | 'right';

export interface Player {
  id: string;
  name: string;
  isHuman: boolean;
  hand: DominoTile[];
  score: number;
  position: 'bottom' | 'left' | 'top' | 'right';
  difficulty?: 'easy' | 'medium' | 'hard';
}

export type GameMode = 'classic' | 'draw' | 'block';

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  board: BoardTile[];
  boneyard: DominoTile[];
  leftEnd: TileValue | null;
  rightEnd: TileValue | null;
  mode: GameMode;
  isGameOver: boolean;
  winnerId: string | null;
  roundNumber: number;
  targetScore: number;
  turnCount: number;
  consecutivePasses: number;
}

export interface Move {
  playerId: string;
  tileId: string;
  side: Side;
  isDraw?: boolean;
  isPass?: boolean;
}

export interface LayoutConfig {
  boardWidth: number;
  boardHeight: number;
  tileWidth: number;
  tileHeight: number;
  padding: number;
  spacing: number;
}
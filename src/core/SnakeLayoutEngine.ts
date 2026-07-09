import { BoardTile, LayoutConfig, Side } from './types';

export class SnakeLayoutEngine {
  private config: LayoutConfig;
  private startX: number;
  private startY: number;

  constructor(config: LayoutConfig) {
    this.config = config;
    this.startX = config.boardWidth / 2;
    this.startY = config.boardHeight / 2;
  }

  reset(): void {
    this.startX = this.config.boardWidth / 2;
    this.startY = this.config.boardHeight / 2;
  }

  getFirstTilePosition(): { x: number; y: number; rotation: number } {
    return { x: this.startX, y: this.startY, rotation: 0 };
  }

  getNextPosition(
    board: BoardTile[], side: Side, tileIsDouble: boolean
  ): { x: number; y: number; rotation: number } {
    if (board.length === 0) return this.getFirstTilePosition();

    const sorted = [...board].sort((a, b) => a.placedAt - b.placedAt);
    const anchor = side === 'left' ? sorted[0] : sorted[sorted.length - 1];
    if (!anchor) return { x: 0, y: 0, rotation: 0 };

    const isHorizontal = anchor.rotation === 0 || anchor.rotation === 180;
    let dx = 0, dy = 0, rotation = 0;

    if (side === 'right') {
      if (isHorizontal) { dx = 1; rotation = 0; }
      else { dy = 1; rotation = 90; }
    } else {
      if (isHorizontal) { dx = -1; rotation = 180; }
      else { dy = -1; rotation = 270; }
    }

    const longSide = Math.max(this.config.tileWidth, this.config.tileHeight);
    const shortSide = Math.min(this.config.tileWidth, this.config.tileHeight);
    const step = (anchor.isDouble ? longSide : shortSide / 2) +
                 (tileIsDouble ? longSide : shortSide / 2) + this.config.spacing;

    let x = anchor.x + dx * step;
    let y = anchor.y + dy * step;

    return this.adjustForBoundaries(x, y, rotation, board, tileIsDouble);
  }

  private adjustForBoundaries(
    x: number, y: number, rotation: number,
    board: BoardTile[], tileIsDouble: boolean
  ): { x: number; y: number; rotation: number } {
    const { boardWidth, boardHeight, padding } = this.config;
    const margin = Math.max(this.config.tileWidth, this.config.tileHeight);
    let newX = x, newY = y, newRotation = rotation;

    if (x > boardWidth - padding - margin) {
      newRotation = 90; newX = boardWidth - padding - margin / 2;
    } else if (x < padding + margin) {
      newRotation = 270; newX = padding + margin / 2;
    }
    if (newY > boardHeight - padding - margin) {
      newRotation = 180; newY = boardHeight - padding - margin / 2;
    } else if (newY < padding + margin) {
      newRotation = 0; newY = padding + margin / 2;
    }

    return { x: newX, y: newY, rotation: newRotation };
  }

  placeTile(board: BoardTile[], tile: BoardTile, side: Side): BoardTile {
    const pos = this.getNextPosition(board, side, tile.isDouble);
    return { ...tile, x: pos.x, y: pos.y, rotation: pos.rotation };
  }
}
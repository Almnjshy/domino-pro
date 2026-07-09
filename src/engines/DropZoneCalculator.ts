import { DropZone } from './DragEngine';
import { BoardTile, TileValue } from '../core/types';
import { Rect } from '../utils/geometry';

interface BoardBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class DropZoneCalculator {
  static calculate(
    board: BoardTile[],
    leftEnd: TileValue | null,
    rightEnd: TileValue | null,
    boardBounds: BoardBounds,
    tileWidth: number,
    tileHeight: number
  ): DropZone[] {
    const zones: DropZone[] = [];

    if (board.length === 0) {
      zones.push({
        id: 'center',
        side: 'left',
        rect: {
          x: boardBounds.x + boardBounds.width / 2 - tileWidth,
          y: boardBounds.y + boardBounds.height / 2 - tileHeight / 2,
          width: tileWidth * 2,
          height: tileHeight,
        },
        tileValue: null,
        isActive: true,
      });
      return zones;
    }

    const sorted = [...board].sort((a, b) => a.placedAt - b.placedAt);
    const firstTile = sorted[0];
    const lastTile = sorted[sorted.length - 1];

    if (leftEnd !== null) {
      const leftZone = this.calculateEndZone(firstTile, 'left', tileWidth, tileHeight, boardBounds);
      zones.push({
        id: 'left-end',
        side: 'left',
        rect: leftZone,
        tileValue: leftEnd,
        isActive: true,
      });
    }

    if (rightEnd !== null) {
      const rightZone = this.calculateEndZone(lastTile, 'right', tileWidth, tileHeight, boardBounds);
      zones.push({
        id: 'right-end',
        side: 'right',
        rect: rightZone,
        tileValue: rightEnd,
        isActive: true,
      });
    }

    return zones;
  }

  private static calculateEndZone(
    tile: BoardTile,
    side: 'left' | 'right',
    tileWidth: number,
    tileHeight: number,
    boardBounds: BoardBounds
  ): Rect {
    const padding = 20;
    const zoneSize = Math.max(tileWidth, tileHeight) + padding * 2;

    let x = tile.x;
    let y = tile.y;

    const isHorizontal = tile.rotation === 0 || tile.rotation === 180;

    if (side === 'left') {
      if (isHorizontal) {
        x = tile.x - tileWidth - padding;
      } else {
        x = tile.x - padding;
        y = tile.y - tileHeight - padding;
      }
    } else {
      if (isHorizontal) {
        x = tile.x + tileWidth + padding;
      } else {
        x = tile.x - padding;
        y = tile.y + tileHeight + padding;
      }
    }

    return {
      x: x - zoneSize / 2,
      y: y - zoneSize / 2,
      width: zoneSize,
      height: zoneSize,
    };
  }

  static updateZoneActivation(
    zones: DropZone[],
    tileLeft: TileValue,
    tileRight: TileValue
  ): DropZone[] {
    return zones.map(zone => {
      if (zone.tileValue === null) {
        return { ...zone, isActive: true };
      }
      const canConnect = tileLeft === zone.tileValue || tileRight === zone.tileValue;
      return { ...zone, isActive: canConnect };
    });
  }
}
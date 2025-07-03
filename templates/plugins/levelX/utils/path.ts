import { DIRECTIONS_DIAGONAL, DIRECTIONS_NORMAL } from "./constants";

import type { Vec2 } from "kaplay";
import type { LevelXObj } from "../components/levelx";
import type { TileXObj } from "../components/tilex";
import type { Direction } from "./types";

export function forEachNeighbor(
  level: LevelXObj,
  tile: TileXObj,
  directions: Direction[],
  cb: (neighbor: TileXObj, direction: Direction) => void
) {
  for (const direction of directions) {
    const neighbor = level.tileFromTilePos(
      tile.tilePos.add(direction.dx, direction.dy)
    );

    if (neighbor) {
      cb(neighbor, direction);
    }
  }
}

function heuristic(a: Vec2, b: Vec2, allowDiagonals: boolean): number {
  if (allowDiagonals) {
    return Math.hypot(b.x - a.x, b.y - a.y);
  }

  return Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
}

interface AStarNode {
  tile: TileXObj;
  g: number;
  h: number;
  f: number;
  parent: AStarNode | null;
}

function reconstructPath(node: AStarNode): TileXObj[] {
  const path: TileXObj[] = [];

  let current: AStarNode | null = node;

  while (current) {
    path.push(current.tile);

    current = current.parent;
  }

  return path.reverse();
}

export function aStar(
  level: LevelXObj,
  start: TileXObj,
  end: TileXObj,
  objsAsObstacles: boolean,
  allowDiagonals: boolean
): TileXObj[] | null {
  const directions = allowDiagonals ? DIRECTIONS_DIAGONAL : DIRECTIONS_NORMAL;
  const openList: AStarNode[] = [];
  const closeSet = new Set<TileXObj>();

  const startCost = heuristic(start.tilePos, end.tilePos, allowDiagonals);

  openList.push({
    tile: start,
    g: 0,
    h: startCost,
    f: startCost,
    parent: null,
  });

  while (openList.length > 0) {
    openList.sort((a, b) => a.f - b.f);

    const currentNode = openList.shift()!;

    if (currentNode.tile.id === end.id) {
      return reconstructPath(currentNode);
    }

    closeSet.add(currentNode.tile);

    forEachNeighbor(
      level,
      currentNode.tile,
      directions,
      (neighbor, direction) => {
        if (
          !neighbor ||
          neighbor.isObstacle ||
          (objsAsObstacles && neighbor.hasAny()) ||
          closeSet.has(neighbor)
        ) {
          return;
        }

        const g =
          currentNode.g +
          (direction.dx !== 0 && direction.dy !== 0 ? Math.SQRT2 : 1);
        const h = heuristic(neighbor.tilePos, end.tilePos, allowDiagonals);
        const existing = openList.find((node) => node.tile.id === neighbor.id);

        if (!existing || g < existing.g) {
          openList.push({
            tile: neighbor,
            g,
            h,
            f: g + h,
            parent: currentNode,
          });
        }
      }
    );

    forEachNeighbor(
      level,
      currentNode.tile,
      directions,
      (neighbor, direction) => {
        if (
          neighbor.isObstacle ||
          (objsAsObstacles && neighbor.hasAny()) ||
          closeSet.has(neighbor)
        ) {
          return;
        }

        const g =
          currentNode.g +
          (direction.dx !== 0 && direction.dy !== 0 ? Math.SQRT2 : 1);
        const h = heuristic(neighbor.tilePos, end.tilePos, allowDiagonals);
        const existing = openList.find((node) => node.tile.id === neighbor.id);

        if (!existing || g < existing.g) {
          openList.push({
            tile: neighbor,
            g,
            h,
            f: g + h,
            parent: currentNode,
          });
        }
      }
    );
  }

  return null;
}

export function tilesInRange(
  level: LevelXObj,
  tile: TileXObj,
  range: number,
  objsAsObstacles: boolean,
  allowDiagonals: boolean
): TileXObj[] | null {
  const tilesInRange: TileXObj[] = [];
  const queue: [TileXObj, number][] = [[tile, range]];
  const visited = new Set<TileXObj>();
  const directions = allowDiagonals ? DIRECTIONS_DIAGONAL : DIRECTIONS_NORMAL;

  visited.add(tile);

  while (queue.length > 0) {
    const [currentTile, currentRange] = queue.shift()!;

    if (currentRange === 0) continue;

    forEachNeighbor(level, currentTile, directions, (neighbor) => {
      if (
        neighbor.isObstacle ||
        (objsAsObstacles && neighbor.hasAny()) ||
        visited.has(neighbor)
      ) {
        return;
      }

      tilesInRange.push(neighbor);
      queue.push([neighbor, currentRange - 1]);
      visited.add(neighbor);
    });
  }

  if (tilesInRange.length === 0) return null;

  return tilesInRange;
}

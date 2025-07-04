import type { Comp, CompList, GameObj, KAPLAYCtx, PosComp, Vec2 } from "kaplay";
import { aStar, tilesInRange } from "../utils/path";
import { generatePolygonsFromLevelX } from "../utils/shapes";
import { type TileXComp, type TileXObj, tileX } from "./tileX";

export type LevelXTileFunc = (
  localPos: Vec2,
  tilePos: Vec2,
  worldPos: Vec2
) => CompList<Comp | TileXComp | PosComp>;
export type LevelTilesDef = Record<string, LevelXTileFunc>;

/**
 * Options for the `LevelX` component. These options define how the level is generated and what features it should have.
 *
 * @export
 * @interface LevelXOpt
 */
export interface LevelXOpt {
  /**
   * The width of each tile in the level.
   *
   * @type {number}
   * @memberof LevelXOpt
   */
  tileWidth: number;
  /**
   * The height of each tile in the level.
   *
   * @type {number}
   * @memberof LevelXOpt
   */
  tileHeight: number;
  /**
   * Record of functions that define how each tile in the level should be generated.
   *
   * @type {LevelTilesDef}
   * @memberof LevelXOpt
   */
  tiles: LevelTilesDef;
  /**
   * Whether to merge adjacent tiles into a single polygon for collision detection.
   *
   * @type {boolean}
   * @memberof LevelXOpt
   */
  mergeObstacles?: boolean;
  /**
   * Tags to merge polygons by.
   * If `undefined`, all obstacles will be merged.
   *
   * @type {string[]}
   * @memberof LevelXOpt
   */
  mergeByTag?: string[];
  /**
   * Tags to be added to merged polygons.
   *
   * @type {string[]}
   * @default ["obstacles"]
   * @memberof LevelXOpt
   */
  mergeTags?: string[];
  /**
   * Pauses tiles not in view. Useful for large levels.
   *
   * Note: I suggest trying out `offscreen` first, especially for platformers.
   *
   * @type {boolean}
   * @memberof LevelXOpt
   */
  pauseOffScreenTiles?: boolean;
}

export interface PathingOpts {
  /**
   * Whether to treat game objects added to tiles as obstacles for pathfinding.
   *
   * @type {boolean}
   * @memberof PathingOpts
   */
  objsAsObstacles?: boolean;
  /**
   * Whether to allow diagonal movement for pathfinding.
   *
   * @type {boolean}
   * @memberof PathingOpts
   */
  allowDiagonals?: boolean;
}

export interface LevelXComp extends Comp {
  tileWidth(): number;
  tileHeight(): number;
  numCols(): number;
  numRows(): number;
  width(): number;
  height(): number;
  tiles(): (TileXObj | null)[];
  tilePos2LocalPos(pos: Vec2): Vec2;
  localPos2TilePos(pos: Vec2): Vec2;
  tilePos2WorldPos(pos: Vec2): Vec2;
  worldPos2TilePos(pos: Vec2): Vec2;
  isTilePosValid(pos: Vec2): boolean;
  isLocalPosValid(pos: Vec2): boolean;
  isWorldPosValid(pos: Vec2): boolean;
  tileFromTilePos(pos: Vec2): TileXObj | null;
  tileFromLocalPos(pos: Vec2): TileXObj | null;
  tileFromWorldPos(pos: Vec2): TileXObj | null;
  pathFromTile(
    tile: TileXObj,
    end: TileXObj,
    pathingOpts?: PathingOpts
  ): TileXObj[] | null;
  pathFromTilePos(
    start: Vec2,
    end: Vec2,
    pathingOpts?: PathingOpts
  ): TileXObj[] | null;
  pathFromLocalPos(
    start: Vec2,
    end: Vec2,
    pathingOpts?: PathingOpts
  ): TileXObj[] | null;
  pathFromWorldPos(
    start: Vec2,
    end: Vec2,
    pathingOpts?: PathingOpts
  ): TileXObj[] | null;
  tilesInRangeOfTile(
    tile: TileXObj,
    range: number,
    pathingOpts?: PathingOpts
  ): TileXObj[] | null;
  tilesInRangeOfTilePos(
    pos: Vec2,
    range: number,
    pathingOpts?: PathingOpts
  ): TileXObj[] | null;
  tilesInRangeOfLocalPos(
    pos: Vec2,
    range: number,
    pathingOpts?: PathingOpts
  ): TileXObj[] | null;
  tilesInRangeOfWorldPos(
    pos: Vec2,
    range: number,
    pathingOpts?: PathingOpts
  ): TileXObj[] | null;
}

export type LevelXObj = GameObj<LevelXComp | PosComp>;

export function levelX(
  k: KAPLAYCtx,
  map: string[],
  opt: LevelXOpt
): LevelXComp {
  const tiles: (TileXObj | null)[] = [];
  const lastVisibleTileArea = {
    minX: -1,
    minY: -1,
    maxX: -1,
    maxY: -1,
  };

  return {
    id: "levelX",
    require: ["pos"],

    add(this: LevelXObj) {
      for (let row = 0; row < map.length; row++) {
        const rowStr = map[row];

        for (let col = 0; col < rowStr.length; col++) {
          const char = rowStr[col];
          const tile = opt.tiles[char];
          const localPos = k.vec2(col * opt.tileWidth, row * opt.tileHeight);
          const tilePos = k.vec2(col, row);
          const worldPos = this.pos.add(localPos);

          let tileComps: CompList<Comp | TileXComp | PosComp> = [];

          if (tile) {
            tileComps = tile(localPos, tilePos, worldPos);
          }

          if (tileComps.length === 0) {
            tiles.push(null);

            continue;
          }

          let hasPosComp = false;
          let hasTileXComp = false;

          for (const comp of tileComps) {
            if (typeof comp === "string") continue;

            if (comp.id === "pos") {
              hasPosComp = true;
            }

            if (comp.id === "tileX") {
              hasTileXComp = true;
            }
          }

          if (!hasPosComp) tileComps.push(k.pos(localPos));
          if (!hasTileXComp) tileComps.push(tileX(k));

          const tileObj = this.add(tileComps);

          if (hasPosComp) {
            tileObj.pos = tileObj.pos.add(localPos);
          }

          tileObj.tilePos = tilePos;

          tileObj.onAdded();

          tiles.push(tileObj);

          if (opt.pauseOffScreenTiles) {
            tileObj.paused = true;
            tileObj.hidden = true;
          }
        }
      }

      if (opt.pauseOffScreenTiles) {
        updatePausedTiles(k, this, lastVisibleTileArea);
      }

      if (opt.mergeObstacles) {
        const mergers = generatePolygonsFromLevelX(k, this, opt.mergeByTag);
        const tags = opt.mergeTags
          ? opt.mergeTags
          : opt.mergeByTag
          ? []
          : ["obstacle"];

        for (const [tag, merger] of mergers) {
          const convexes = merger.getConvexes();

          for (const convex of convexes) {
            this.add([
              k.pos(),
              k.area({
                shape: new k.Polygon(convex),
              }),
              k.body({ isStatic: true }),
              tag,
              ...tags,
            ]);
          }
        }
      }
    },
    update(this: LevelXObj) {
      if (opt.pauseOffScreenTiles) {
        updatePausedTiles(k, this, lastVisibleTileArea);
      }
    },

    tileWidth() {
      return opt.tileWidth;
    },
    tileHeight() {
      return opt.tileHeight;
    },
    numCols() {
      return map[0].length;
    },
    numRows() {
      return map.length;
    },
    width() {
      return this.numCols() * opt.tileWidth;
    },
    height() {
      return this.numRows() * opt.tileHeight;
    },
    tiles() {
      return tiles;
    },
    tilePos2LocalPos(pos: Vec2) {
      return pos.scale(opt.tileWidth, opt.tileHeight);
    },
    localPos2TilePos(pos: Vec2) {
      return k.vec2(
        Math.floor(pos.x / opt.tileWidth),
        Math.floor(pos.y / opt.tileHeight)
      );
    },
    tilePos2WorldPos(this: LevelXObj, pos: Vec2) {
      return this.tilePos2LocalPos(pos).add(this.pos);
    },
    worldPos2TilePos(this: LevelXObj, pos: Vec2) {
      return this.localPos2TilePos(pos.sub(this.pos));
    },
    isTilePosValid(pos: Vec2) {
      return (
        pos.x >= 0 &&
        pos.x < this.numCols() &&
        pos.y >= 0 &&
        pos.y < this.numRows()
      );
    },
    isLocalPosValid(pos: Vec2) {
      return this.isTilePosValid(this.localPos2TilePos(pos));
    },
    isWorldPosValid(pos: Vec2) {
      return this.isTilePosValid(this.worldPos2TilePos(pos));
    },
    tileFromTilePos(pos: Vec2) {
      if (!this.isTilePosValid(pos)) return null;

      return tiles[pos.x + pos.y * this.numCols()];
    },
    tileFromLocalPos(pos: Vec2) {
      return this.tileFromTilePos(this.localPos2TilePos(pos));
    },
    tileFromWorldPos(pos: Vec2) {
      return this.tileFromTilePos(this.worldPos2TilePos(pos));
    },
    pathFromTile(
      this: LevelXObj,
      start: TileXObj,
      end: TileXObj,
      pathingOpts = {}
    ) {
      const { objsAsObstacles = false, allowDiagonals = false } = pathingOpts;

      return aStar(this, start, end, objsAsObstacles, allowDiagonals);
    },
    pathFromTilePos(start: Vec2, end: Vec2, pathingOpts = {}) {
      const startTile = this.tileFromTilePos(start);
      const endTile = this.tileFromTilePos(end);

      if (!startTile || !endTile) {
        return [];
      }

      return this.pathFromTile(startTile, endTile, pathingOpts);
    },
    pathFromLocalPos(start: Vec2, end: Vec2, pathingOpts = {}) {
      return this.pathFromTilePos(
        this.localPos2TilePos(start),
        this.localPos2TilePos(end),
        pathingOpts
      );
    },
    pathFromWorldPos(start: Vec2, end: Vec2, pathingOpts = {}) {
      return this.pathFromTilePos(
        this.worldPos2TilePos(start),
        this.worldPos2TilePos(end),
        pathingOpts
      );
    },
    tilesInRangeOfTile(
      this: LevelXObj,
      tile: TileXObj,
      range: number,
      pathingOpts = {}
    ) {
      const { objsAsObstacles = false, allowDiagonals = false } = pathingOpts;

      return tilesInRange(this, tile, range, objsAsObstacles, allowDiagonals);
    },
    tilesInRangeOfTilePos(pos: Vec2, range: number, pathingOpts = {}) {
      const tile = this.tileFromTilePos(pos);

      if (!tile) return [];

      return this.tilesInRangeOfTile(tile, range, pathingOpts);
    },
    tilesInRangeOfLocalPos(pos: Vec2, range: number, pathingOpts = {}) {
      return this.tilesInRangeOfTilePos(
        this.localPos2TilePos(pos),
        range,
        pathingOpts
      );
    },
    tilesInRangeOfWorldPos(pos: Vec2, range: number, pathingOpts = {}) {
      return this.tilesInRangeOfTilePos(
        this.worldPos2TilePos(pos),
        range,
        pathingOpts
      );
    },
  };
}

interface lastVisibleTileArea {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

function updatePausedTiles(
  k: KAPLAYCtx,
  levelXObj: LevelXObj,
  lastVisibleTileArea: lastVisibleTileArea
): void {
  const camPos = k.getCamPos();
  const screenLeft = camPos.x - k.width() / 2;
  const screenTop = camPos.y - k.height() / 2;
  const screenRight = screenLeft + k.width();
  const screenBottom = screenTop + k.height();

  const tileW = levelXObj.tileWidth();
  const tileH = levelXObj.tileHeight();

  const minX = Math.max(0, Math.floor((screenLeft - levelXObj.pos.x) / tileW));
  const maxX = Math.min(
    levelXObj.numCols() - 1,
    Math.ceil((screenRight - levelXObj.pos.x) / tileW)
  );
  const minY = Math.max(0, Math.floor((screenTop - levelXObj.pos.y) / tileH));
  const maxY = Math.min(
    levelXObj.numRows() - 1,
    Math.ceil((screenBottom - levelXObj.pos.y) / tileH)
  );

  if (
    minX === lastVisibleTileArea.minX &&
    maxX === lastVisibleTileArea.maxX &&
    minY === lastVisibleTileArea.minY &&
    maxY === lastVisibleTileArea.maxY
  ) {
    return;
  }

  const startX = Math.min(minX, lastVisibleTileArea.minX);
  const startY = Math.min(minY, lastVisibleTileArea.minY);
  const endX = Math.max(maxX, lastVisibleTileArea.maxX);
  const endY = Math.max(maxY, lastVisibleTileArea.maxY);

  for (let x = startX; x <= endX; x++) {
    for (let y = startY; y <= endY; y++) {
      const tile = levelXObj.tileFromTilePos(k.vec2(x, y));

      if (!tile) continue;

      const isVisible = x >= minX && x <= maxX && y >= minY && y <= maxY;

      tile.paused = !isVisible;
      tile.hidden = !isVisible;
    }
  }

  lastVisibleTileArea.minX = minX;
  lastVisibleTileArea.minY = minY;
  lastVisibleTileArea.maxX = maxX;
  lastVisibleTileArea.maxY = maxY;
}

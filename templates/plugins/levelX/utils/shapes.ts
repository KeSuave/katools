import type { Anchor, GameObj, KAPLAYCtx, Vec2 } from "kaplay";

import { type LevelXObj } from "../components/levelx";
import type { TileXObj } from "../components/tilex";
import MergePolygons from "./polyMerger";

export function getOffset(
  k: KAPLAYCtx,
  level: LevelXObj,
  tile: TileXObj
): Vec2 {
  if (!tile.has("anchor")) {
    return k.vec2();
  }

  const anchorProp = (tile as GameObj).anchor as Anchor | Vec2;

  let anchor = k.vec2();

  switch (anchorProp) {
    case "topleft":
      anchor = k.vec2(-1, -1);
      break;
    case "top":
      anchor = k.vec2(0, -1);
      break;
    case "topright":
      anchor = k.vec2(1, -1);
      break;
    case "left":
      anchor = k.vec2(-1, 0);
      break;
    case "center":
      anchor = k.vec2();
      break;
    case "right":
      anchor = k.vec2(1, 0);
      break;
    case "botleft":
      anchor = k.vec2(-1, 1);
      break;
    case "bot":
      anchor = k.vec2(0, 1);
      break;
    case "botright":
      anchor = k.vec2(1, 1);
      break;
    default:
      anchor = anchorProp;
      break;
  }

  let width = level.tileWidth();
  let height = level.tileHeight();

  if ("width" in tile) {
    width = tile.width as number;
  }
  if ("height" in tile) {
    height = tile.height as number;
  }

  return anchor.add(1, 1).scale(k.vec2(width, height).scale(-0.5));
}

export function generatePolygonsFromLevelX(
  k: KAPLAYCtx,
  level: LevelXObj,
  mergeByTag: string[] = []
): Map<string, MergePolygons> {
  const mergers = new Map<string, MergePolygons>();

  mergeByTag.forEach((tag) => mergers.set(tag, new MergePolygons()));

  mergers.set("obstacle", new MergePolygons());

  level.tiles().forEach((tile) => {
    if (!tile) return;
    if (!tile.isObstacle) return;

    let merger: MergePolygons = mergers.get("obstacle")!;

    for (const tag of mergeByTag) {
      if (tile.tags.includes(tag)) {
        merger = mergers.get(tag)!;

        break;
      }
    }

    const offset: Vec2 = getOffset(k, level, tile);

    merger.addPolygon(
      ...tile.obstacleArea.map((v) => v.add(tile.pos).add(offset))
    );
  });

  return mergers;
}

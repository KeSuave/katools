import { LevelXPlugin } from "./levelX";

export default LevelXPlugin;

export type {
  LevelTilesDef,
  LevelXComp,
  LevelXObj,
  LevelXOpt,
  LevelXTileFunc,
  PathingOpts
} from "./components/levelx";
export type { TileXComp, TileXObj, TileXOpt } from "./components/tilex";

export {
  convexPartition,
  removeHoles,
  triangulate
} from "./utils/polyPartitions";


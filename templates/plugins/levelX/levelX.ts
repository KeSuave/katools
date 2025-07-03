import type { KAPLAYCtx } from "kaplay";
import { levelX, type LevelXComp, type LevelXOpt } from "./components/levelx";
import { tileX, type TileXComp, type TileXOpt } from "./components/tilex";

export interface LevelXPluginCtx {
  /**
   * The level component alternative.
   *
   * @param {string[]} map
   * @param {LevelXOpt} opt
   * @return {*}  {LevelXComp}
   * @memberof LevelXPluginCtx
   */
  levelX(map: string[], opt: LevelXOpt): LevelXComp;
  /**
   * The tile component alternative.
   *
   * @param {TileXOpt} [opt]
   * @return {*}  {TileXComp}
   * @memberof LevelXPluginCtx
   */
  tileX(opt?: TileXOpt): TileXComp;
}

export function LevelXPlugin(k: KAPLAYCtx): LevelXPluginCtx {
  return {
    levelX(map: string[], opt: LevelXOpt) {
      return levelX(k, map, opt);
    },
    tileX(opt?: TileXOpt) {
      return tileX(k, opt);
    },
  };
}

import type { GameObj } from "kaplay";
import type { LevelXObj } from "../components/levelx";

export function hasLevelX(obj: GameObj): obj is LevelXObj {
  return obj.has("levelX");
}

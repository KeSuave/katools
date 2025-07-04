import type { GameObj } from "kaplay";
import type { LevelXObj } from "../components/levelX";

export function hasLevelX(obj: GameObj): obj is LevelXObj {
  return obj.has("levelX");
}

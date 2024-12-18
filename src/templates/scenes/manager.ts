export default `import type { KAPLAYCtx } from "kaplay";
import { bootScene } from "./boot";
import { gameOverScene } from "./gameOver";
import { gameScene } from "./game";
import { menuScene } from "./menu";

export default function addScenes(k: KAPLAYCtx): void {
  k.scene("boot", bootScene);
  k.scene("menu", menuScene);
  k.scene("game", gameScene);
  k.scene("gameOver", gameOverScene);
}
`

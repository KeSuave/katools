import { k } from "../context";
import { bootScene } from "./boot";
import { gameScene } from "./game";
import { gameOverScene } from "./gameOver";
import { menuScene } from "./menu";

export default function addScenes(): void {
  k.scene("boot", bootScene);
  k.scene("menu", menuScene);
  k.scene("game", gameScene);
  k.scene("gameOver", gameOverScene);
}

export default `import { k } from "../context";

export function gameOverScene(): void {
  const scene = k.add([]);

  scene.add([
    k.text("Game Over", {
      size: 100,
    }),
    k.pos(k.center().sub(0, 50)),
    k.anchor("center"),
  ]);

  scene.add([
    k.text("Thanks for playing"),
    k.pos(k.center().add(0, 40)),
    k.anchor("center"),
  ]);

  const play = scene.add([
    k.text("Play Again"),
    k.color(k.WHITE),
    k.pos(k.center().add(0, 140)),
    k.anchor("center"),
    k.area(),
  ]);

  play.onHover(() => {
    play.color = k.GREEN;
  });

  play.onHoverEnd(() => {
    play.color = k.WHITE;
  });

  play.onClick(() => {
    k.go("game", k);
  });
}
`

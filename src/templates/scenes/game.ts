export default `import { k } from "../context";

export function gameScene(): void {
  const scene = k.add([]);

  scene.add([
    k.text("Press space to lose!"),
    k.pos(k.center()),
    k.anchor("center"),
  ]);

  scene.onKeyPress("space", () => {
    k.go("gameOver");
  });
}
`

export default `import type { KAPLAYCtx } from "kaplay";

export function gameScene(k: KAPLAYCtx): void {
  const scene = k.add([]);

  scene.add([
    k.text("Press space to lose!"),
    k.pos(k.center()),
    k.anchor("center"),
  ]);

  scene.onKeyPress("space", () => {
    k.go("gameOver", k);
  });
}
`

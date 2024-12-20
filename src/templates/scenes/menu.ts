export default `import type { KAPLAYCtx } from "kaplay";

export function menuScene(k: KAPLAYCtx): void {
  const scene = k.add([]);

  scene.add([
    k.text("<%gameName%>", {
      size: 200,
    }),
    k.pos(k.center().sub(0, 100)),
    k.anchor("center"),
  ]);

  const play = scene.add([
    k.text("Play"),
    k.color(k.WHITE),
    k.pos(k.center().add(0, 100)),
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

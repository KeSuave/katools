import type { KAPLAYCtx } from "kaplay";

export interface FPSPluginCtx {
  /**
   * Shows fps meter on top left corner.
   *
   * @memberof FPSPluginCtx
   */
  showFPS(): void;
}

export function fpsPlugin(k: KAPLAYCtx): FPSPluginCtx {
  return {
    showFPS() {
      if (!k._k.globalOpt.debug) return;

      k.add([k.pos(4, 4), k.rect(40, 20), k.color(k.BLACK), k.fixed()]);

      const fps = k.add([
        k.pos(24, 14),
        k.text("0", {
          size: 16,
          width: 40,
          align: "center",
        }),
        k.anchor("center"),
        k.fixed(),
      ]);

      fps.onUpdate(() => {
        fps.text = k.debug.fps().toString();
      });
    },
  };
}

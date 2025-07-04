import { k } from "../context";

export function bootScene(): void {
  const scene = k.add([]);

  let currentProgress = 0;

  k.loadRoot("./");

  // load assets here

  k.onLoading((progress) => (currentProgress = progress));
  k.onLoad(() => k.go("menu"));

  const progressBarWidth = Math.min(800, k.width() - 40);
  const progressBarHeight = 40;

  scene.onDraw(() => {
    k.drawRect({
      width: progressBarWidth,
      height: progressBarHeight,
      pos: k.center().sub(progressBarWidth / 2, progressBarHeight / 2),
      // change color here
      color: k.rgb(40, 40, 40),
    });

    k.drawRect({
      width: progressBarWidth * currentProgress,
      height: progressBarHeight,
      pos: k.center().sub(progressBarWidth / 2, progressBarHeight / 2),
      // change color here
      color: k.rgb(100, 100, 100),
    });
  });
}

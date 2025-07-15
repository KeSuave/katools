import type { Comp, GameObj, Vec2 } from "kaplay";

import { k } from "../context";

export const ParallaxDirection = {
  Positive: 1,
  Negative: -1,
} as const;

export type ParallaxDirection =
  (typeof ParallaxDirection)[keyof typeof ParallaxDirection];

export function makeParallax(
  parent: GameObj,
  pos: Vec2,
  sprite: string,
  speed: number,
  direction: ParallaxDirection = ParallaxDirection.Negative,
  horizontal = true,
  components: Comp[] = []
): void {
  const spriteAsset = k._k.assets.sprites.get(sprite);

  if (!spriteAsset) {
    throw new Error(`Sprite asset not found: ${sprite}`);
  }

  const spriteData = spriteAsset.data;

  if (!spriteData) {
    throw new Error(`Sprite data not found for sprite asset: ${sprite}`);
  }

  const parallaxOne = parent.add([k.pos(pos), k.sprite(sprite), "parallax"]);
  const parallaxTwo = parent.add([
    k.pos(
      horizontal ? pos.x + spriteData.width * direction * -1 : pos.x,
      horizontal ? pos.y : pos.y + spriteData.height * direction * -1
    ),
    k.sprite(sprite),
    "parallax",
  ]);

  components.forEach((component) => {
    parallaxOne.use(component);
    parallaxTwo.use(component);
  });

  parent.onUpdate(() => {
    if (horizontal) {
      parallaxOne.moveTo(
        parallaxOne.pos.add(parallaxOne.width * direction, 0),
        speed
      );
      parallaxTwo.moveTo(pos, speed);

      if (parallaxTwo.pos.dist(pos) <= 0.1) {
        parallaxOne.pos.x = pos.x;
        parallaxTwo.pos.x = pos.x + spriteData.width * direction * -1;
      }

      return;
    }

    parallaxOne.moveTo(
      parallaxOne.pos.add(0, parallaxOne.height * direction),
      speed
    );
    parallaxTwo.moveTo(pos, speed);

    if (parallaxTwo.pos.dist(pos) <= 0.1) {
      parallaxOne.pos.y = pos.y;
      parallaxTwo.pos.y = pos.y + spriteData.height * direction * -1;
    }
  });
}

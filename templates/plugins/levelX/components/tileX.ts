import type { Comp, GameObj, KAPLAYCtx, PosComp, Vec2 } from "kaplay";

import { assert } from "../utils/general";
import { hasLevelX } from "../utils/shared";

export interface TileXComp extends Comp {
  isObstacle: boolean;
  tilePos: Vec2;
  obstacleArea: Vec2[];

  onAdded(): void;

  addObj(obj: GameObj): void;
  hasObj(obj: GameObj): boolean;
  removeObj(obj: GameObj): void;
  clearObjs(): void;
  objs(): Map<number, GameObj>;
  hasAny(): boolean;
  center(): Vec2;
}

export type TileXObj = GameObj<TileXComp | PosComp>;

export interface TileXOpt {
  isObstacle?: boolean;
  obstacleArea?: Vec2[];
}

export function tileX(
  k: KAPLAYCtx,
  { isObstacle = false, obstacleArea = [] }: TileXOpt = {}
): TileXComp {
  const objs: Map<number, GameObj> = new Map();

  return {
    id: "tileX",
    require: ["pos"],
    isObstacle,
    tilePos: k.vec2(),
    obstacleArea,

    onAdded(this: TileXObj) {
      if (this.obstacleArea.length === 0) {
        assert(this.parent);
        assert(hasLevelX(this.parent));

        let width = this.parent.tileWidth();
        let height = this.parent.tileHeight();

        if ((this as GameObj).width) {
          width = (this as GameObj).width;
        }

        if ((this as GameObj).height) {
          height = (this as GameObj).height;
        }

        this.obstacleArea = [
          k.vec2(),
          k.vec2(width, 0),
          k.vec2(width, height),
          k.vec2(0, height),
        ];
      }
    },

    addObj(obj: GameObj) {
      assert(obj.id);

      objs.set(obj.id, obj);
    },
    hasObj(obj: GameObj) {
      assert(obj.id);

      return objs.has(obj.id);
    },
    removeObj(obj: GameObj) {
      assert(obj.id);

      objs.delete(obj.id);
    },
    clearObjs() {
      objs.clear();
    },
    objs() {
      return objs;
    },
    hasAny() {
      return objs.size > 0;
    },
    center(this: TileXObj) {
      assert(this.parent);
      assert(hasLevelX(this.parent));

      return this.pos.add(
        this.parent.tileWidth() / 2,
        this.parent.tileHeight() / 2
      );
    },
  };
}

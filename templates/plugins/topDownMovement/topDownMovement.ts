import type { Comp, GameObj, KAPLAYCtx, Key, PosComp } from "kaplay";

export type TopDownMovementDirection = "up" | "down" | "left" | "right";

export interface TopDownMovementCompOpt {
  /**
   * The speed at which the movement is applied to the game object when not running.
   *
   * @type {number}
   * @default 100
   * @memberof TopDownMovementCompOpt
   */
  walkingSpeed?: number;
  /**
   * The speed at which the movement is applied to the game object when running.
   *
   * @type {number}
   * @default 200
   * @memberof TopDownMovementCompOpt
   */
  runningSpeed?: number;
  /**
   * Flag to determine whether or not movement is active.
   *
   * @type {boolean}
   * @default false
   * @memberof TopDownMovementCompOpt
   */
  allowMovement?: boolean;
  /**
   * Flag to determine whether or not running movement is active.
   *
   * @type {boolean}
   * @memberof TopDownMovementCompOpt
   */
  allowRunning?: boolean;
  /**
   * The key or keys that trigger up movement.
   *
   * @type {(Key | Key[])}
   * @default "up"
   * @memberof TopDownMovementCompOpt
   */
  upKey?: Key | Key[];
  /**
   * The key or keys that trigger down movement.
   *
   * @type {(Key | Key[])}
   * @default "down"
   * @memberof TopDownMovementCompOpt
   */
  downKey?: Key | Key[];
  /**
   * The key or keys that trigger left movement.
   *
   * @type {(Key | Key[])}
   * @default "left"
   * @memberof TopDownMovementCompOpt
   */
  leftKey?: Key | Key[];
  /**
   * The key or keys that trigger right movement.
   *
   * @type {(Key | Key[])}
   * @default "right"
   * @memberof TopDownMovementCompOpt
   */
  rightKey?: Key | Key[];
  /**
   * The key to toggle running mode.
   *
   * @type {(Key | Key[])}
   * @default "shift"
   * @memberof TopDownMovementCompOpt
   */
  runningKey?: Key | Key[];
}

export interface TopDownMovementComp extends Comp {
  /**
   * The speed at which the movement is applied to the game object when not running.
   *
   * @type {number}
   * @memberof TopDownMovementComp
   */
  walkingSpeed: number;
  /**
   * The speed at which the movement is applied to the game object when running.
   *
   * @type {number}
   * @memberof TopDownMovementComp
   */
  runningSpeed: number;
  /**
   * Flag to determine whether or not movement is active.
   *
   * @type {boolean}
   * @memberof TopDownMovementComp
   */
  allowMovement: boolean;
  /**
   * Flag to determine whether or not running movement is active.
   *
   * @type {boolean}
   * @memberof TopDownMovementComp
   */
  allowRunning: boolean;
  /**
   * Returns `true` if no movement is happening, `false` otherwise.
   *
   * @type {boolean}
   * @memberof TopDownMovementComp
   */
  isIdling: boolean;
  /**
   * Returns `true` if movement without running is happening, `false` otherwise.
   *
   * @type {boolean}
   * @memberof TopDownMovementComp
   */
  isWalking: boolean;
  /**
   * Returns `true` if movement with running is happening, `false` otherwise.
   *
   * @type {boolean}
   * @memberof TopDownMovementComp
   */
  isRunning: boolean;
  /**
   * Returns `true` if movement is happening, `false` otherwise.
   *
   * @type {boolean}
   * @memberof TopDownMovementComp
   */
  isMoving: boolean;
  /**
   * The key or keys that trigger up movement.
   *
   * @type {(Key | Key[])}
   * @memberof TopDownMovementComp
   */
  upKey: Key | Key[];
  /**
   * The key or keys that trigger down movement.
   *
   * @type {(Key | Key[])}
   * @memberof TopDownMovementComp
   */
  downKey: Key | Key[];
  /**
   * The key or keys that trigger left movement.
   *
   * @type {(Key | Key[])}
   * @memberof TopDownMovementComp
   */
  leftKey: Key | Key[];
  /**
   * The key or keys that trigger right movement.
   *
   * @type {(Key | Key[])}
   * @memberof TopDownMovementComp
   */
  rightKey: Key | Key[];
  /**
   * The key or keys to toggle running mode.
   *
   * @type {(Key | Key[])}
   * @memberof TopDownMovementComp
   */
  runningKey: Key | Key[];

  /**
   * Event triggered when no movement is happening.
   *
   * @param {() => void} action
   * @memberof TopDownMovementComp
   */
  onIdling(action: () => void): void;
  /**
   * Event triggered when movement without running is happening.
   *
   * @param {() => void} action
   * @memberof TopDownMovementComp
   */
  onWalking(action: () => void): void;
  /**
   * Event triggered when movement with running is happening.
   *
   * @param {() => void} action
   * @memberof TopDownMovementComp
   */
  onRunning(action: () => void): void;
  /**
   * Event triggered when a direction in movement changes.
   *
   * @param {(direction: TopDownMovementDirection) => void} action
   * @memberof TopDownMovementComp
   */
  onChangeDirection(
    action: (direction: TopDownMovementDirection) => void
  ): void;
}

type TopDownMovementCompThis = GameObj<TopDownMovementComp | PosComp>;

export interface TopDownMovementPluginCtx {
  topDownMovement(opt?: TopDownMovementCompOpt): TopDownMovementComp;
}

export function topDownMovementPlugin(k: KAPLAYCtx): TopDownMovementPluginCtx {
  return {
    topDownMovement(opt: TopDownMovementCompOpt = {}): TopDownMovementComp {
      const lastUpdateKeys: Record<
        TopDownMovementDirection | "running",
        boolean
      > = {
        up: false,
        down: false,
        left: false,
        right: false,
        running: false,
      };

      let isIdling = true;
      let isWalking = false;
      let isRunning = false;

      return {
        id: "fourWayMovement",
        require: ["pos"],
        walkingSpeed: opt.walkingSpeed ?? 100,
        runningSpeed: opt.runningSpeed ?? 200,
        allowMovement: opt.allowMovement ?? true,
        allowRunning: opt.allowRunning ?? false,
        upKey: opt.upKey ?? "up",
        downKey: opt.downKey ?? "down",
        leftKey: opt.leftKey ?? "left",
        rightKey: opt.rightKey ?? "right",
        runningKey: opt.runningKey ?? "shift",

        get isIdling() {
          return isIdling;
        },
        get isWalking() {
          return isWalking;
        },
        get isRunning() {
          return isRunning;
        },
        get isMoving() {
          return this.isWalking || this.isRunning;
        },

        add(this: TopDownMovementCompThis) {
          k.wait(0.1, () => {
            this.trigger("tdMovementIdling");
          });
        },
        update(this: TopDownMovementCompThis) {
          if (!this.allowMovement) return;

          const vel = k.vec2();

          if (k.isKeyDown(this.upKey)) {
            vel.y -= 1;

            if (!lastUpdateKeys.up) {
              lastUpdateKeys.up = true;

              this.trigger("tdMovementChangedDirection", "up");
            }
          } else {
            lastUpdateKeys.up = false;
          }

          if (k.isKeyDown(this.downKey)) {
            vel.y += 1;

            if (!lastUpdateKeys.down) {
              lastUpdateKeys.down = true;

              this.trigger("tdMovementChangedDirection", "down");
            }
          } else {
            lastUpdateKeys.down = false;
          }

          if (k.isKeyDown(this.leftKey)) {
            vel.x -= 1;

            if (!lastUpdateKeys.left) {
              lastUpdateKeys.left = true;

              this.trigger("tdMovementChangedDirection", "left");
            }
          } else {
            lastUpdateKeys.left = false;
          }

          if (k.isKeyDown(this.rightKey)) {
            vel.x += 1;

            if (!lastUpdateKeys.right) {
              lastUpdateKeys.right = true;

              this.trigger("tdMovementChangedDirection", "right");
            }
          } else {
            lastUpdateKeys.right = false;
          }

          if (!vel.eq(k.vec2())) {
            if (this.allowRunning && k.isKeyDown(opt.runningKey ?? "shift")) {
              isWalking = false;
              isIdling = false;

              if (!isRunning) {
                this.trigger("tdMovementRunning");
              }

              isRunning = true;
            } else {
              isRunning = false;
              isIdling = false;

              if (!isWalking) {
                this.trigger("tdMovementWalking");
              }

              isWalking = true;
            }

            let speed = this.walkingSpeed;

            if (isRunning) {
              speed = this.runningSpeed;
            }

            this.move(vel.unit().scale(speed));

            return;
          }

          isRunning = false;
          isWalking = false;

          if (!isIdling) {
            this.trigger("tdMovementIdling");
          }

          isIdling = true;
        },

        onIdling(this: TopDownMovementCompThis, action: () => void) {
          this.on("tdMovementIdling", action);
        },
        onWalking(this: TopDownMovementCompThis, action: () => void) {
          this.on("tdMovementWalking", action);
        },
        onRunning(this: TopDownMovementCompThis, action: () => void) {
          this.on("tdMovementRunning", action);
        },
        onChangeDirection(
          this: TopDownMovementCompThis,
          action: (direction: TopDownMovementDirection) => void
        ) {
          this.on("tdMovementChangedDirection", action);
        },
      };
    },
  };
}

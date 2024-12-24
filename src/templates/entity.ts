export default `import type { GameObj } from "kaplay";

import type { GameCtx } from "../context";

export function make<%pascalCaseName%>(k: GameCtx): GameObj {
  return k.make(["<%name%>"]);
}
`

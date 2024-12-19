export default `import type { GameObj, KAPLAYCtx } from "kaplay";

export function make<%pascalCaseName%>(k: KAPLAYCtx): GameObj {
  return k.make(["<%name%>"]);
}
`

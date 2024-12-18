export default `import type { GameObj, KAPLAYCtx } from "kaplay";

export function <%name%>(k: KAPLAYCtx): GameObj {
  return k.make(["<%name%>"]);
}
`

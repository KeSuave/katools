export default `import type { KAPLAYCtx } from "kaplay";

export function <%name%>(k: KAPLAYCtx): void {
  return k.make(["<%name%>"]);
}
`

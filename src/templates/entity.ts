export default `import type { KAPLAYCtx } from "kaplay";

export function {{entity}}(k: KAPLAYCtx): void {
  return k.make(["{{entity}}"]);
}
`

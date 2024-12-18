export default `import type { Comp, KAPLAYCtx } from "kaplay";

export interface {{component}}Component extends Comp {

}

type {{component}}This = GameObj<{{component}}>;

export function {{component}}(k: KAPLAYCtx): void {
  return {
    id: "{{component}}",
  }
}
`

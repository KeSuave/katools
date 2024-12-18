export default `import type { Comp, KAPLAYCtx } from "kaplay";

export interface <%name%>Component extends Comp {

}

type <%name%>This = GameObj<<%name%>>;

export function <%name%>(k: KAPLAYCtx): void {
  return {
    id: "<%name%>",
  }
}
`

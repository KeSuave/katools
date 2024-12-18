export default `import type { Comp, GameObj, KAPLAYCtx } from "kaplay";

export interface <%name%>Component extends Comp {

}

type <%name%>This = GameObj<<%name%>Component>;

export function <%name%>(k: KAPLAYCtx): <%name%>Component {
  return {
    id: "<%name%>",
  }
}
`

export default `import type { Comp, GameObj, KAPLAYCtx } from "kaplay";

export interface <%pascalCaseName%>Component extends Comp {

}

type <%name%>This = GameObj<<%pascalCaseName%>Component>;

export function <%name%>(k: KAPLAYCtx): <%pascalCaseName%>Component {
  return {
    id: "<%name%>",
  }
}
`

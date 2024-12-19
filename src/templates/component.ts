export default `import type { Comp, GameObj, KAPLAYCtx } from "kaplay";

export interface <%pascalCaseName%>Comp extends Comp {

}

type <%pascalCaseName%>This = GameObj<<%pascalCaseName%>Comp>;

export function <%name%>(k: KAPLAYCtx): <%pascalCaseName%>Comp {
  return {
    id: "<%name%>",
  }
}
`

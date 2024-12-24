export default `import type { Comp, GameObj } from "kaplay";

import type { GameCtx } from "../context";

export interface <%pascalCaseName%>Comp extends Comp {

}

type <%pascalCaseName%>This = GameObj<<%pascalCaseName%>Comp>;

export function <%name%>(k: GameCtx): <%pascalCaseName%>Comp {
  return {
    id: "<%name%>",
  }
}
`

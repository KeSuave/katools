export default `import type { Comp, GameObj } from "kaplay";

export interface <%pascalCaseName%>Comp extends Comp {

}

type <%pascalCaseName%>This = GameObj<<%pascalCaseName%>Comp>;

export function <%name%>(): <%pascalCaseName%>Comp {
  return {
    id: "<%name%>",
  }
}
`

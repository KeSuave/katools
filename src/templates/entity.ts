export default `import type { GameObj, PosComp, Vec2 } from "kaplay";

import { k } from "../context";

export type <%pascalCaseName%>EntityComps = PosComp;
export type <%pascalCaseName%>Entity = GameObj<<%pascalCaseName%>Comps>;

export function make<%pascalCaseName%>(
  parent: GameObj,
  pos: Vec2
): <%pascalCaseName%>Entity {
  const <%camelCaseName%> = parent.add([
    k.pos(pos),
    "<%name%>"
  ]);

  return <%camelCaseName%>
}
`

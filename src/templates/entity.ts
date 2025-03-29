export default `import type { GameObj, PosComp, Vec2 } from "kaplay";

import { k } from "../context";

export type <%pascalCaseName%>Comps = PosComp;

export function make<%pascalCaseName%>(
  parent: GameObj,
  pos: Vec2
): GameObj<<%pascalCaseName%>Comps> {
  return parent.add([
    k.pos(pos),
    "<%name%>"
  ]);
}
`

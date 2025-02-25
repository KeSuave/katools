export default `import type { GameObj, PosComp, Vec2 } from "kaplay";

import { k } from "../context";

export type <%pascalCaseName%>Comps = PosComp;

export function make<%pascalCaseName%>(pos: Vec2): GameObj<<%pascalCaseName%>Comps> {
  return k.make([
    k.pos(pos),
    "<%name%>"
  ]);
}
`

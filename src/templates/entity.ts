export default `import type { GameObj } from "kaplay";

import { k } from "../context";

export function make<%pascalCaseName%>(): GameObj {
  return k.make(["<%name%>"]);
}
`

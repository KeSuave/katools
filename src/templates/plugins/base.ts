export default `import type { KAPLAYCtx } from "kaplay";

export interface <%pascalCaseName%>PluginCtx {
  foo(): void;
}

export function <%name%>Plugin(k: KAPLAYCtx): <%pascalCaseName%>PluginCtx {
  return {
    foo() {
      k.debug.log("Hello, world!");
    },
  };
}
`

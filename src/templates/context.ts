export default `import kaplay from "kaplay";
import addScenes from "./scenes";

export const k = kaplay({
  global: false,
  width: <%width%>,
  height: <%height%>,
  stretch: <%stretch%>,
  letterbox: <%letterbox%>,
  debugKey: "<%debugKey%>",
  debug: true, // TODO: set this to false in production
  background: [20, 20, 20],
  plugins: [],
});

addScenes(k);

export type GameCtx = typeof k;
`

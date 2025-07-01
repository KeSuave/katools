import kaplay from "kaplay";
import plugins from "./plugins";
import addScenes from "./scenes";

export const k = kaplay({
  global: false,
  width: <%width%>,
  height: <%height%>,
  letterbox: <%letterbox%>,
  debugKey: "<%debugKey%>",
  debug: true, // TODO: set this to false in production
  background: [20, 20, 20],
  plugins: [
    ...plugins,
    // Add other plugins here
  ],
});

addScenes();

export type GameCtx = typeof k;

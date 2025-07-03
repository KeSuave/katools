import type { Color, GameObj, PosComp, TextCompOpt, Vec2 } from "kaplay";

import { k } from "../context";

export interface MenuItemOpt {
  labelOpt?: TextCompOpt;
  hoverColor?: Color;
  normalColor?: Color;
}

export type MenuItemEntityComps = PosComp;
export type MenuItemEntity = GameObj<MenuItemEntityComps>;

export function makeMenuItem(
  parent: GameObj,
  pos: Vec2,
  label: string,
  onClick: () => void,
  opt: MenuItemOpt = {}
): MenuItemEntity {
  const menuItem = parent.add([
    k.pos(pos),
    k.text(label, opt.labelOpt),
    k.color(opt.normalColor || k.WHITE),
    k.anchor("center"),
    k.area(),
    "menuItem",
  ]);

  menuItem.onHover(() => {
    menuItem.color = opt.hoverColor ?? k.GREEN;
  });

  menuItem.onHoverEnd(() => {
    menuItem.color = opt.normalColor ?? k.WHITE;
  });

  menuItem.onClick(() => {
    onClick();
  });

  return menuItem;
}

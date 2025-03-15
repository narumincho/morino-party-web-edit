import { Item } from "../type.ts";

export const players = [
  "Falp06",
  "yuzuki0061600",
  "sabineko_427",
  "rokuharatandai3",
  "keybooo865",
  "coddlfish",
  "Uboot_Samon",
  "PandaDash334",
  "_hunisuke_monkey",
] as const;

export const items: ReadonlyArray<Item<typeof players[number]>> = [{
  type: "oniChange",
  from: undefined,
  to: "_hunisuke_monkey",
  time: "0:0",
}, {
  type: "oniChange",
  from: undefined,
  to: "PandaDash334",
  time: "0:0",
}];

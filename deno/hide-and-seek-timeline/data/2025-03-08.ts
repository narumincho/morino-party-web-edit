import { ResultInput, touchAndOniChange } from "../type.ts";

const players = [
  "_hunisuke_monkey",
  "Falp06",
  "yuzuki0061600",
  "rokuharatandai3",
  "coddlfish",
  "keybooo865",
  "Uboot_Samon",
  "PandaDash334",
  "sabineko_427",
] as const;

type Player = typeof players[number];

export const result: ResultInput<Player> = {
  offset: "0:22",
  endTime: "20:00",
  players,
  items: [
    ...touchAndOniChange<Player>({
      from: undefined,
      to: "_hunisuke_monkey",
      time: "0:22",
    }),
    ...touchAndOniChange<Player>({
      from: "_hunisuke_monkey",
      to: "yuzuki0061600",
      time: "2:54",
    }),
    ...touchAndOniChange<Player>({
      from: "yuzuki0061600",
      to: "coddlfish",
      time: "3:41",
    }),
    ...touchAndOniChange<Player>({
      from: "coddlfish",
      to: "keybooo865",
      time: "4:42",
    }),
    {
      type: "touch",
      from: "keybooo865",
      to: "PandaDash334",
      time: "5:07",
    },
    {
      type: "oniChange",
      from: "keybooo865",
      to: "PandaDash334",
      time: "5:32",
    },
    ...touchAndOniChange<Player>({
      from: "PandaDash334",
      to: "_hunisuke_monkey",
      time: "6:26",
    }),
    ...touchAndOniChange<Player>({
      from: "_hunisuke_monkey",
      to: "PandaDash334",
      time: "8:28",
    }),
    {
      type: "touch",
      from: "PandaDash334",
      to: "yuzuki0061600",
      time: "9:52",
    },
    {
      type: "oniChange",
      from: "PandaDash334",
      to: "yuzuki0061600",
      time: "10:10",
    },
    ...touchAndOniChange<Player>({
      from: "yuzuki0061600",
      to: "coddlfish",
      time: "10:58",
    }),
    ...touchAndOniChange<Player>({
      from: "coddlfish",
      to: "Falp06",
      time: "11:50",
    }),
    ...touchAndOniChange<Player>({
      from: "Falp06",
      to: "_hunisuke_monkey",
      time: "12:21",
    }),
    ...touchAndOniChange<Player>({
      from: "_hunisuke_monkey",
      to: "keybooo865",
      time: "13:52",
    }),
    {
      type: "touch",
      from: "keybooo865",
      to: "Uboot_Samon",
      time: "14:07",
    },
    {
      type: "oniChange",
      from: "keybooo865",
      to: "Uboot_Samon",
      time: "14:33",
    },
    ...touchAndOniChange<Player>({
      from: "Uboot_Samon",
      to: "_hunisuke_monkey",
      time: "15:10",
    }),
    ...touchAndOniChange<Player>({
      from: "_hunisuke_monkey",
      to: "Uboot_Samon",
      time: "16:02",
    }),
    ...touchAndOniChange<Player>({
      from: "Uboot_Samon",
      to: "coddlfish",
      time: "17:15",
    }),
    ...touchAndOniChange<Player>({
      from: "coddlfish",
      to: "Uboot_Samon",
      time: "18:00",
    }),
    ...touchAndOniChange<Player>({
      from: undefined,
      to: "PandaDash334",
      time: "0:22",
    }),
    {
      type: "touch",
      from: "PandaDash334",
      to: "keybooo865",
      time: "3:44",
    },
    ...touchAndOniChange<Player>({
      from: "PandaDash334",
      to: "Uboot_Samon",
      time: "4:58",
    }),
    ...touchAndOniChange<Player>({
      from: "Uboot_Samon",
      to: "yuzuki0061600",
      time: "6:44",
    }),
    ...touchAndOniChange<Player>({
      from: "yuzuki0061600",
      to: "Falp06",
      time: "8:01",
    }),
    ...touchAndOniChange<Player>({
      from: "Falp06",
      to: "_hunisuke_monkey",
      time: "8:55",
    }),
    ...touchAndOniChange<Player>({
      from: "_hunisuke_monkey",
      to: "Uboot_Samon",
      time: "9:44",
    }),
    ...touchAndOniChange<Player>({
      from: "Uboot_Samon",
      to: "coddlfish",
      time: "13:48",
    }),
    ...touchAndOniChange<Player>({
      from: "coddlfish",
      to: "PandaDash334",
      time: "15:08",
    }),
    ...touchAndOniChange<Player>({
      from: "PandaDash334",
      to: "rokuharatandai3",
      time: "17:38",
    }),
    ...touchAndOniChange<Player>({
      from: "rokuharatandai3",
      to: "coddlfish",
      time: "19:10",
    }),
    {
      type: "exit",
      player: "PandaDash334",
      time: "10:50",
    },
    {
      type: "enter",
      player: "PandaDash334",
      time: "12:37",
    },
    {
      type: "exit",
      player: "coddlfish",
      time: "6:17",
    },
    {
      type: "enter",
      player: "coddlfish",
      time: "6:36",
    },
  ],
};

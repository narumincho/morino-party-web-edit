import { ResultInput, touchAndOniChange } from "../type.ts";

const players = [
  "narumincho", // ok
  "MG42_", // ok
  "yuzuki0061600", // ok
  "Falp06", // ok
  "Uboot_Samon", // ok
  "_hunisuke_monkey", // ok
] as const;

type Player = typeof players[number];

export const result: ResultInput<Player> = {
  title: "2025-05-03",
  offset: "0:40",
  endTime: "15:00",
  players,
  colors: ["#afb594", "#ebf3c7"],
  items: [
    // Falp06
    ...touchAndOniChange<Player>({
      from: undefined,
      to: "Falp06",
      time: "0:40",
    }),
    ...touchAndOniChange<Player>({
      from: "Falp06",
      to: "Uboot_Samon",
      time: "1:27",
    }),
    ...touchAndOniChange<Player>({
      from: "Uboot_Samon",
      to: "Falp06",
      time: "2:53",
    }),
    ...touchAndOniChange<Player>({
      from: "Falp06",
      to: "MG42_",
      time: "4:41",
    }),
    ...touchAndOniChange<Player>({
      from: "MG42_",
      to: "Falp06",
      time: "6:25",
    }),
    ...touchAndOniChange<Player>({
      from: "Falp06",
      to: "narumincho",
      time: "8:38",
    }),
    ...touchAndOniChange<Player>({
      from: "narumincho",
      to: "Uboot_Samon",
      time: "12:57",
    }),
    ...touchAndOniChange<Player>({
      from: "Uboot_Samon",
      to: "narumincho",
      time: "14:21",
    }),
    // MG42?
    ...touchAndOniChange<Player>({
      from: undefined,
      to: "MG42_",
      time: "0:40",
    }),
    ...touchAndOniChange<Player>({
      from: "MG42_",
      to: "yuzuki0061600",
      time: "2:11",
    }),
    ...touchAndOniChange<Player>({
      from: "yuzuki0061600",
      to: "_hunisuke_monkey",
      time: "5:05",
    }),
    ...touchAndOniChange<Player>({
      from: "_hunisuke_monkey",
      to: "narumincho",
      time: "5:41",
    }),
    ...touchAndOniChange<Player>({
      from: "narumincho",
      to: "Uboot_Samon",
      time: "7:45",
    }),
    ...touchAndOniChange<Player>({
      from: "Uboot_Samon",
      to: "yuzuki0061600",
      time: "11:42",
    }),
    ...touchAndOniChange<Player>({
      from: "yuzuki0061600",
      to: "Falp06",
      time: "12:28",
    }),
    ...touchAndOniChange<Player>({
      from: "Falp06",
      to: "yuzuki0061600",
      time: "13:26",
    }),
  ],
  tasks: {
    narumincho: undefined,
    MG42_: { start: "4:27", end: "4:40" },
    yuzuki0061600: { start: "0:46", end: "0:59" },
    Falp06: { start: "2:11", end: "2:26" },
    Uboot_Samon: { start: "0:45", end: "1:03" },
    _hunisuke_monkey: { start: "5:59", end: "6:14" },
  },
};

import { ResultInput, touchAndOniChange } from "../type.ts";

const players = [
  "narumincho", // check
  "MG42_", //
  "yuzuki0061600",
  "Falp06",
  "Uboot_Samon",
  "_hunisuke_monkey",
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
};

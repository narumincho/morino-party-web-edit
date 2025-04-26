import { ResultInput, touchAndOniChange } from "../type.ts";

const players = [
  "narumincho", // ok
  "PandaDash334", // ok
  "MG42_", // ok
  "yuzuki0061600", // ok
  "Uboot_Samon", // ok
  "akito67", // ok
  "tacosuke1205", // ok
  "Falp06", // ok
  "shsw00", // ok
  "sabineko_427", // ok
] as const;

type Player = typeof players[number];

export const result: ResultInput<Player> = {
  title: "2025-04-12",
  offset: "0:05",
  endTime: "15:00",
  players,
  colors: ["#ace38f", "#00e851", "#cae8ba"],
  items: [
    // MG42_
    ...touchAndOniChange<Player>({
      from: undefined,
      to: "MG42_",
      time: "0:05",
    }),
    ...touchAndOniChange<Player>({
      from: "MG42_",
      to: "yuzuki0061600",
      time: "1:36",
    }),
    ...touchAndOniChange<Player>({
      from: "yuzuki0061600",
      to: "Uboot_Samon",
      time: "2:44",
    }),
    ...touchAndOniChange<Player>({
      from: "Uboot_Samon",
      to: "akito67",
      time: "4:29",
    }),
    ...touchAndOniChange<Player>({
      from: "akito67",
      to: "yuzuki0061600",
      time: "5:05",
    }),
    ...touchAndOniChange<Player>({
      from: "yuzuki0061600",
      to: "tacosuke1205",
      time: "5:50",
    }),
    ...touchAndOniChange<Player>({
      from: "tacosuke1205",
      to: "narumincho",
      time: "6:59",
    }),
    ...touchAndOniChange<Player>({
      from: "narumincho",
      to: "MG42_",
      time: "8:05",
    }),
    ...touchAndOniChange<Player>({
      from: "MG42_",
      to: "Falp06",
      time: "9:43",
    }),
    ...touchAndOniChange<Player>({
      from: "Falp06",
      to: "akito67",
      time: "10:37",
    }),
    ...touchAndOniChange<Player>({
      from: "akito67",
      to: "yuzuki0061600",
      time: "11:39",
    }),
    // Falp06
    ...touchAndOniChange<Player>({
      from: undefined,
      to: "Falp06",
      time: "0:05",
    }),
    ...touchAndOniChange<Player>({
      from: "Falp06",
      to: "shsw00",
      time: "0:20",
    }),
    ...touchAndOniChange<Player>({
      from: "shsw00",
      to: "tacosuke1205",
      time: "12:30",
    }),
    ...touchAndOniChange<Player>({
      from: "tacosuke1205",
      to: "MG42_",
      time: "14:32",
    }),
  ],
};

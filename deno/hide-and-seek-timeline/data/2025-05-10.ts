import { ResultInput, touchAndOniChange } from "../type.ts";

const players = [
  "narumincho", // ok
  "MG42_", // ok
  "yuzuki0061600", // ok
  "Falp06", // ok
  "Kafiristan", // ok
  "kasuku33", // ok
] as const;

type Player = typeof players[number];

export const result: ResultInput<Player> = {
  title: "2025-05-10",
  offset: "0:0",
  endTime: "15:00",
  players,
  colors: ["#4d4d5d", "#6b6b7d"],
  textColors: ["white"],
  items: [
    // MG42_
    ...touchAndOniChange<Player>({
      from: undefined,
      to: "MG42_",
      time: "0:00",
    }),
    ...touchAndOniChange<Player>({
      from: "MG42_",
      to: "narumincho",
      time: "1:38",
    }),
    ...touchAndOniChange<Player>({
      from: "narumincho",
      to: "kasuku33",
      time: "2:7",
    }),
    ...touchAndOniChange<Player>({
      from: "kasuku33",
      to: "MG42_",
      time: "4:4",
    }),
    ...touchAndOniChange<Player>({
      from: "MG42_",
      to: "yuzuki0061600",
      time: "4:25",
    }),
    ...touchAndOniChange<Player>({
      from: "yuzuki0061600",
      to: "Falp06",
      time: "5:9",
    }),
    ...touchAndOniChange<Player>({
      from: "Falp06",
      to: "narumincho",
      time: "6:50",
    }),
    ...touchAndOniChange<Player>({
      from: "narumincho",
      to: "yuzuki0061600",
      time: "7:39",
    }),
    ...touchAndOniChange<Player>({
      from: "yuzuki0061600",
      to: "MG42_",
      time: "9:15",
    }),
    ...touchAndOniChange<Player>({
      from: "MG42_",
      to: "kasuku33",
      time: "11:08",
    }),
    ...touchAndOniChange<Player>({
      from: "kasuku33",
      to: "narumincho",
      time: "12:32",
    }),
    ...touchAndOniChange<Player>({
      from: "narumincho",
      to: "Kafiristan",
      time: "12:57",
    }),
    // Falp06
    ...touchAndOniChange<Player>({
      from: undefined,
      to: "Falp06",
      time: "0:0",
    }),
    ...touchAndOniChange<Player>({
      from: "Falp06",
      to: "Kafiristan",
      time: "0:55",
    }),
    ...touchAndOniChange<Player>({
      from: "Kafiristan",
      to: "narumincho",
      time: "2:31",
    }),
    ...touchAndOniChange<Player>({
      from: "narumincho",
      to: "kasuku33",
      time: "3:40",
    }),
    ...touchAndOniChange<Player>({
      from: undefined,
      to: "kasuku33",
      time: "4:4",
    }),
    ...touchAndOniChange<Player>({
      from: "kasuku33",
      to: "Falp06",
      time: "8:26",
    }),
    ...touchAndOniChange<Player>({
      from: "Falp06",
      to: "kasuku33",
      time: "9:24",
    }),
  ],
};

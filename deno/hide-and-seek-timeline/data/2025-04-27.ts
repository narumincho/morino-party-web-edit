import { ResultInput, touchAndOniChange } from "../type.ts";

const players = [
  "narumincho", // ok
  "MG42_", // ok
  "yuzuki0061600", // ok
  "akito67", // ok
  "Falp06", // ok
  "sirasukundayo", // ok
  "omochintyo", // ok
] as const;

type Player = typeof players[number];

export const result: ResultInput<Player> = {
  title: "2025-04-27",
  offset: "0:30",
  endTime: "15:00",
  players,
  colors: ["#B49D59", "#B7B6B0", "#866235"],
  items: [
    // akito67
    ...touchAndOniChange<Player>({
      from: undefined,
      to: "akito67",
      time: "0:30",
    }),
    ...touchAndOniChange<Player>({
      from: "akito67",
      to: "Falp06",
      time: "1:27",
    }),
    ...touchAndOniChange<Player>({
      from: "Falp06",
      to: "narumincho",
      time: "2:41",
    }),
    ...touchAndOniChange<Player>({
      from: "narumincho",
      to: "akito67",
      time: "3:20",
    }),
    ...touchAndOniChange<Player>({
      from: "akito67",
      to: "sirasukundayo",
      time: "6:20",
    }),
    ...touchAndOniChange<Player>({
      from: "sirasukundayo",
      to: "narumincho",
      time: "7:15",
    }),
    ...touchAndOniChange<Player>({
      from: "narumincho",
      to: "akito67",
      time: "9:14",
    }),
    ...touchAndOniChange<Player>({
      from: "akito67",
      to: "narumincho",
      time: "11:29",
    }),
    ...touchAndOniChange<Player>({
      from: "narumincho",
      to: "akito67",
      time: "12:50",
    }),
    ...touchAndOniChange<Player>({
      from: "akito67",
      to: "MG42_",
      time: "13:57",
    }),
    ...touchAndOniChange<Player>({
      from: "MG42_",
      to: "sirasukundayo",
      time: "14:20",
    }),
    // sirasukundayo
    ...touchAndOniChange<Player>({
      from: undefined,
      to: "sirasukundayo",
      time: "0:30",
    }),
    ...touchAndOniChange<Player>({
      from: "sirasukundayo",
      to: "yuzuki0061600",
      time: "1:28",
    }),
    ...touchAndOniChange<Player>({
      from: "yuzuki0061600",
      to: "MG42_",
      time: "3:43",
    }),
    ...touchAndOniChange<Player>({
      from: "MG42_",
      to: "omochintyo",
      time: "5:27",
    }),
    ...touchAndOniChange<Player>({
      from: "omochintyo",
      to: "akito67",
      time: "7:47",
    }),
    ...touchAndOniChange<Player>({
      from: "akito67",
      to: "yuzuki0061600",
      time: "8:46",
    }),
    ...touchAndOniChange<Player>({
      from: "yuzuki0061600",
      to: "sirasukundayo",
      time: "10:00",
    }),
    ...touchAndOniChange<Player>({
      from: "sirasukundayo",
      to: "yuzuki0061600",
      time: "14:02",
    }),
  ],
};

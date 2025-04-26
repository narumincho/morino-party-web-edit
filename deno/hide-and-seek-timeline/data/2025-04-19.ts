import { ResultInput, touchAndOniChange } from "../type.ts";

const players = [
  "narumincho", // ok
  "PandaDash334", // ok
  "MG42_", // ok
  "yuzuki0061600", // ok
  "Uboot_Samon", // ok
  "akito67", // ok
  "Falp06", // ok
  "sabineko_427", // ok
  "sirasukundayo", // ok
  "rokuharatandai3", // ok
] as const;

type Player = typeof players[number];

export const result: ResultInput<Player> = {
  title: "2025-04-19",
  offset: "1:10",
  endTime: "15:00",
  players,
  colors: ["#3ccfcf", "#8bc5cb", "#8ff0e7"],
  items: [
    // sabineko_427
    ...touchAndOniChange<Player>({
      from: undefined,
      to: "sabineko_427",
      time: "1:10",
    }),
    ...touchAndOniChange<Player>({
      from: "sabineko_427",
      to: "sirasukundayo",
      time: "1:30",
    }),
    ...touchAndOniChange<Player>({
      from: "sirasukundayo",
      to: "Falp06",
      time: "3:36",
    }),
    ...touchAndOniChange<Player>({
      from: "Falp06",
      to: "narumincho",
      time: "6:47",
    }),
    ...touchAndOniChange<Player>({
      from: "narumincho",
      to: "Falp06",
      time: "8:07",
    }),
    ...touchAndOniChange<Player>({
      from: "Falp06",
      to: "PandaDash334",
      time: "8:39",
    }),
    ...touchAndOniChange<Player>({
      from: "PandaDash334",
      to: "yuzuki0061600",
      time: "9:46",
    }),
    ...touchAndOniChange<Player>({
      from: "yuzuki0061600",
      to: "narumincho",
      time: "12:45",
    }),
    ...touchAndOniChange<Player>({
      from: "narumincho",
      to: "rokuharatandai3",
      time: "13:58",
    }),
    // PandaDash334
    ...touchAndOniChange<Player>({
      from: undefined,
      to: "PandaDash334",
      time: "1:10",
    }),
    ...touchAndOniChange<Player>({
      from: "PandaDash334",
      to: "yuzuki0061600",
      time: "1:31",
    }),
    ...touchAndOniChange<Player>({
      from: "yuzuki0061600",
      to: "PandaDash334",
      time: "2:13",
    }),
    ...touchAndOniChange<Player>({
      from: "PandaDash334",
      to: "yuzuki0061600",
      time: "2:41",
    }),
    {
      type: "touch",
      from: "yuzuki0061600",
      to: "rokuharatandai3",
      time: "3:40",
    },
    {
      type: "oniChange",
      from: "yuzuki0061600",
      to: "rokuharatandai3",
      time: "3:50",
    },
    ...touchAndOniChange<Player>({
      from: "rokuharatandai3",
      to: "narumincho",
      time: "4:44",
    }),
    {
      type: "touch",
      from: "narumincho",
      to: "yuzuki0061600",
      time: "5:25",
    },
    {
      type: "oniChange",
      from: "narumincho",
      to: "yuzuki0061600",
      time: "6:20",
    },
    ...touchAndOniChange<Player>({
      from: "yuzuki0061600",
      to: "rokuharatandai3",
      time: "8:51",
    }),
    ...touchAndOniChange<Player>({
      from: "rokuharatandai3",
      to: "MG42_",
      time: "10:57",
    }),
    ...touchAndOniChange<Player>({
      from: "MG42_",
      to: "PandaDash334",
      time: "13:37",
    }),
  ],
};

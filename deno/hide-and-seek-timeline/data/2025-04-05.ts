import { ResultInput, touchAndOniChange } from "../type.ts";

const players = [
  "narumincho", // ok
  "PandaDash334", // ok
  "rokuharatandai3", // ok
  "Uboot_Samon", // ok
  "akito67", // ok
  "Umisango0408", // ok
  "sabineko_427", // ok
  "MG42_", // ok
  "Falp06", // ok
] as const;

type Player = typeof players[number];

export const result: ResultInput<Player> = {
  title: "2025-04-05",
  offset: "0:05",
  endTime: "15:00",
  players,
  colors: ["#ace38f", "#00e851", "#cae8ba"],
  items: [
    // narumincho
    ...touchAndOniChange<Player>({
      from: undefined,
      to: "narumincho",
      time: "0:05",
    }),
    ...touchAndOniChange<Player>({
      from: "narumincho",
      to: "PandaDash334",
      time: "1:25",
    }),
    ...touchAndOniChange<Player>({
      from: "PandaDash334",
      to: "narumincho",
      time: "4:50",
    }),
    ...touchAndOniChange<Player>({
      from: "narumincho",
      to: "Uboot_Samon",
      time: "5:57",
    }),
    ...touchAndOniChange<Player>({
      from: "Uboot_Samon",
      to: "akito67",
      time: "8:40",
    }),
    ...touchAndOniChange<Player>({
      from: "akito67",
      to: "PandaDash334",
      time: "9:48",
    }),
    ...touchAndOniChange<Player>({
      from: "PandaDash334",
      to: "Umisango0408",
      time: "12:15",
    }),
    ...touchAndOniChange<Player>({
      from: "Umisango0408",
      to: "Uboot_Samon",
      time: "12:46",
    }),
    ...touchAndOniChange<Player>({
      from: "Uboot_Samon",
      to: "Umisango0408",
      time: "13:48",
    }),
    {
      type: "exit",
      player: "Umisango0408",
      time: "14:30",
    },
    // Uboot_Samon
    ...touchAndOniChange<Player>({
      from: undefined,
      to: "Uboot_Samon",
      time: "0:05",
    }),
    ...touchAndOniChange<Player>({
      from: "Uboot_Samon",
      to: "akito67",
      time: "3:26",
    }),
    ...touchAndOniChange<Player>({
      from: "akito67",
      to: "sabineko_427",
      time: "4:27",
    }),
    ...touchAndOniChange<Player>({
      from: "sabineko_427",
      to: "rokuharatandai3",
      time: "5:12",
    }),
    ...touchAndOniChange<Player>({
      from: "rokuharatandai3",
      to: "PandaDash334",
      time: "5:45",
    }),
    ...touchAndOniChange<Player>({
      from: "PandaDash334",
      to: "sabineko_427",
      time: "7:37",
    }),
    ...touchAndOniChange<Player>({
      from: "sabineko_427",
      to: "Uboot_Samon",
      time: "9:22",
    }),
    ...touchAndOniChange<Player>({
      from: "Uboot_Samon",
      to: "sabineko_427",
      time: "11:09",
    }),
    ...touchAndOniChange<Player>({
      from: "sabineko_427",
      to: "akito67",
      time: "11:52",
    }),
    ...touchAndOniChange<Player>({
      from: "akito67",
      to: "sabineko_427",
      time: "12:54",
    }),
    // Umisango
    {
      type: "exit",
      player: "Umisango0408",
      time: "0:05",
    },
    {
      type: "enter",
      player: "Umisango0408",
      time: "10:25",
    },
  ],
};

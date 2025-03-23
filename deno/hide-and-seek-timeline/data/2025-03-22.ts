import { ResultInput, touchAndOniChange } from "../type.ts";

const players = [
  "narumincho",
  "takoyaki_ooo",
  "PandaDash334",
  "rokuharatandai3",
] as const;

type Player = typeof players[number];

export const result: ResultInput<Player> = {
  title: "2025-03-22",
  offset: "0:00",
  endTime: "15:00",
  players,
  items: [
    ...touchAndOniChange<Player>({
      from: undefined,
      to: "narumincho",
      time: "0:00",
    }),
    ...touchAndOniChange<Player>({
      from: "narumincho",
      to: "PandaDash334",
      time: "1:25",
    }),
    ...touchAndOniChange<Player>({
      from: "PandaDash334",
      to: "narumincho",
      time: "2:08",
    }),
    ...touchAndOniChange<Player>({
      from: "narumincho",
      to: "PandaDash334",
      time: "3:19",
    }),
    ...touchAndOniChange<Player>({
      from: "PandaDash334",
      to: "narumincho",
      time: "4:29",
    }),
    ...touchAndOniChange<Player>({
      from: "narumincho",
      to: "rokuharatandai3",
      time: "6:01",
    }),
    ...touchAndOniChange<Player>({
      from: "rokuharatandai3",
      to: "PandaDash334",
      time: "6:52",
    }),
    ...touchAndOniChange<Player>({
      from: "PandaDash334",
      to: "rokuharatandai3",
      time: "10:55",
    }),
    {
      type: "touch",
      from: "rokuharatandai3",
      to: "takoyaki_ooo",
      time: "11:37",
    },
    {
      type: "oniChange",
      from: "rokuharatandai3",
      to: "takoyaki_ooo",
      time: "12:22",
    },
    {
      type: "touch",
      from: "takoyaki_ooo",
      to: "PandaDash334",
      time: "12:54",
    },
    {
      type: "oniChange",
      from: "takoyaki_ooo",
      to: "PandaDash334",
      time: "13:18",
    },
    {
      type: "touch",
      from: "PandaDash334",
      to: "takoyaki_ooo",
      time: "14:20",
    },
    {
      type: "touch",
      from: "PandaDash334",
      to: "rokuharatandai3",
      time: "14:30",
    },
    {
      type: "touch",
      from: "takoyaki_ooo",
      to: undefined,
      time: "14:30",
    },
  ],
};

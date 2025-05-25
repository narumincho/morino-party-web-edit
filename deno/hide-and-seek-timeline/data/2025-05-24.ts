import { ResultInput, touchAndOniChange } from "../type.ts";

// 仮のデータです

const players = [
  "narumincho",
  "macaronipenguin_",
  "yugo240",
  "Falp06",
  "keybooo865",
  "MonnTotto",
  "ARAchang",
  "osyaberisyounen",
  "yuzuki0061600",
] as const;

type Player = typeof players[number];

export const result: ResultInput<Player> = {
  title: "2025-05-24",
  bonus: true,
  offset: "-0:20",
  endTime: "15:00",
  players,
  textColors: ["white"],
  colors: ["rgb(140 77 60)", "rgb(123 68 53)", "rgb(98 54 42)"],
  items: [
    // narumincho
    ...touchAndOniChange<Player>({
      from: undefined,
      to: "narumincho",
      time: "-0:20",
    }),
    ...touchAndOniChange<Player>({
      from: "narumincho",
      to: "MonnTotto",
      time: "0:17",
    }),
    ...touchAndOniChange<Player>({
      from: "MonnTotto",
      to: "ARAchang",
      time: "3:38",
    }),
    ...touchAndOniChange<Player>({
      from: "ARAchang",
      to: "keybooo865",
      time: "4:27",
    }),
    ...touchAndOniChange<Player>({
      from: "keybooo865",
      to: "MonnTotto",
      time: "5:44",
    }),
    ...touchAndOniChange<Player>({
      from: "MonnTotto",
      to: "narumincho",
      time: "7:51",
    }),
    ...touchAndOniChange<Player>({
      from: "narumincho",
      to: "ARAchang",
      time: "8:34",
    }),
    ...touchAndOniChange<Player>({
      from: "ARAchang",
      to: "yugo240",
      time: "10:20",
    }),
    ...touchAndOniChange<Player>({
      from: "yugo240",
      to: "macaronipenguin_",
      time: "13:03",
    }),
    // Falp06
    ...touchAndOniChange<Player>({
      from: undefined,
      to: "Falp06",
      time: "-0:20",
    }),
    ...touchAndOniChange<Player>({
      from: "Falp06",
      to: "keybooo865",
      time: "-0:05", // 録画し忘れのため予想
    }),
    ...touchAndOniChange<Player>({
      from: "keybooo865",
      to: "yugo240",
      time: "0:25",
    }),
    ...touchAndOniChange<Player>({
      from: "yugo240",
      to: "ARAchang",
      time: "2:06",
    }),
    ...touchAndOniChange<Player>({
      from: "ARAchang",
      to: "yugo240",
      time: "2:32",
    }),
    ...touchAndOniChange<Player>({
      from: "yugo240",
      to: "macaronipenguin_",
      time: "6:34",
    }),
    ...touchAndOniChange<Player>({
      from: "macaronipenguin_",
      to: "yugo240",
      time: "7:21",
    }),
    ...touchAndOniChange<Player>({
      from: "yugo240",
      to: "macaronipenguin_",
      time: "9:43",
    }),
    ...touchAndOniChange<Player>({
      from: "macaronipenguin_",
      to: "narumincho",
      time: "11:14",
    }),
    ...touchAndOniChange<Player>({
      from: "narumincho",
      to: "osyaberisyounen",
      time: "12:12",
    }),
    ...touchAndOniChange<Player>({
      from: "osyaberisyounen",
      to: "yuzuki0061600",
      time: "13:17",
    }),
  ],
};

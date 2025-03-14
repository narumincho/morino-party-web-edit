// @ts-types="npm:@types/react"
import React from "npm:react";
// @ts-types="npm:react-dom/server"
import { renderToString } from "npm:react-dom/server";
import { ensureDir } from "jsr:@std/fs";

const players = [
  "Falp06",
  "yuzuki0061600",
  "sabineko_427",
  "rokuharatandai3",
  "keybooo865",
  "coddlfish",
  "Uboot_Samon",
  "PandaDash334",
  "_hunisuke_monkey",
] as const;

type Player = typeof players[number];

type Item = {
  readonly type: "startOni";
  readonly player: Player;
  readonly time: `${number}:${number}`;
};

const items: ReadonlyArray<Item> = [{
  type: "startOni",
  player: "_hunisuke_monkey",
  time: "0:0",
}, {
  type: "startOni",
  player: "PandaDash334",
  time: "0:0",
}];

/**
 * 開催時間
 */
const endTime = 20 * 60;

const nameWidth = 160;

const playerRowHeight = 32;

await ensureDir(new URL(import.meta.resolve("./out")));
await Deno.writeTextFile(
  new URL(import.meta.resolve("./out/2025-03-08.svg")),
  renderToString(
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${nameWidth + endTime} ${players.length * playerRowHeight}`}
    >
      {players.map((player, index) => (
        <g key={player}>
          <rect
            x={0}
            y={playerRowHeight * index}
            width={nameWidth + endTime}
            height={playerRowHeight}
            fill={index % 2 === 0 ? "#fff" : "#00e851"}
          />
          <text
            x={0}
            y={playerRowHeight * (index + 0.5)}
            dominantBaseline="middle"
          >
            {player}
          </text>
        </g>
      ))}
      {Array.from(
        { length: endTime / 60 },
        (_, i) => (
          <line
            key={i}
            x1={nameWidth + i * 60}
            y1={0}
            x2={nameWidth + i * 60}
            y2={players.length * playerRowHeight}
            stroke="gray"
          />
        ),
      )}
    </svg>,
  ),
);

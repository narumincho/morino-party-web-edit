// @ts-types="npm:@types/react"
import React from "npm:react";
// @ts-types="npm:react-dom/server"
import { renderToString } from "npm:react-dom/server";
import { ensureDir } from "jsr:@std/fs";
import { join } from "jsr:@std/path";
import { getSkinImage, usernameToUuid } from "../skin.ts";
import { decodePNG } from "jsr:@img/png";
import { Result, resultInputToResult } from "./type.ts";
import { result } from "./data/2025-03-08.ts";

const outPath = "./deno/hide-and-seek-timeline/out";

async function main<Player extends string>(
  { players, items, endTime }: Result<Player>,
) {
  const nameWidth = 190;

  const moneyWidth = 48;

  const rowHeight = 32;

  const imageWidth = nameWidth + endTime + moneyWidth + 8;

  await ensureDir(outPath);

  const playerAndSkinImages = await getPlayersSkin(players);

  const svg = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${imageWidth} ${rowHeight + players.length * rowHeight}`}
    >
      <g>
        <rect
          x={0}
          y={0}
          width={imageWidth}
          height={rowHeight}
          fill="#fff"
        />
        {Array.from(
          { length: endTime / 60 },
          (_, i) => (
            <text
              key={i}
              x={nameWidth + i * 60}
              y={rowHeight * 0.5}
              dominantBaseline="middle"
            >
              {i}:00
            </text>
          ),
        )}
      </g>
      <text
        x={nameWidth + endTime + moneyWidth}
        y={rowHeight * 0.5}
        dominantBaseline="middle"
        textAnchor="end"
      >
        賞金
      </text>
      {playerAndSkinImages.map(({ username, skinImage }, index) => (
        <g key={username}>
          <rect
            x={0}
            y={rowHeight + rowHeight * index}
            width={imageWidth}
            height={rowHeight + 1}
            fill={["#ace38f", "#00e851", "#cae8ba"][index % 3]}
          />
          <g
            transform={`translate(0, ${rowHeight + rowHeight * (index + 0.5)})`}
          >
            <UserLabel username={username} skinImage={skinImage} />
          </g>
          <text
            x={nameWidth + endTime + moneyWidth}
            y={rowHeight + rowHeight * (index + 0.5)}
            dominantBaseline="middle"
            textAnchor="end"
          >
            {calcMoney({ items, endTime }, username)}
          </text>
        </g>
      ))}
      <g>
        {Array.from(
          { length: endTime / 60 + 1 },
          (_, i) => (
            <line
              key={i}
              x1={nameWidth + i * 60}
              y1={rowHeight - 8}
              x2={nameWidth + i * 60}
              y2={rowHeight + players.length * rowHeight}
              stroke="gray"
            />
          ),
        )}
      </g>
      <g>
        {items.map((item, index) => {
          switch (item.type) {
            case "oniChange": {
              const nextChange = items.slice(index).find((e) =>
                e.type === "oniChange" && e.from === item.to
              );
              const strokeWidth = 10;
              return (
                <g key={index}>
                  {item.to && item.from
                    ? (
                      <line
                        x1={nameWidth + item.time}
                        y1={rowHeight + players.indexOf(item.from) * rowHeight +
                          rowHeight * 0.5 - strokeWidth * 0.5}
                        x2={nameWidth + item.time}
                        y2={rowHeight + players.indexOf(item.to) * rowHeight +
                          rowHeight * 0.5 - strokeWidth * 0.5}
                        stroke="red"
                        strokeDasharray="5,5"
                      />
                    )
                    : undefined}
                  {item.to
                    ? (
                      <rect
                        x={nameWidth + item.time}
                        y={rowHeight + players.indexOf(item.to) * rowHeight +
                          rowHeight * 0.5 - strokeWidth * 0.5}
                        height={strokeWidth}
                        width={(nextChange ? nextChange.time : endTime) -
                          (item.time)}
                        fill="red"
                      />
                    )
                    : undefined}
                </g>
              );
            }
            case "touch": {
              const nextChange = items.slice(index).find((e) =>
                e.type === "touch" && e.from === item.to
              );
              const strokeWidth = 30;
              return (
                <g key={index}>
                  {item.to && item.from
                    ? (
                      <line
                        x1={nameWidth + item.time}
                        y1={rowHeight + players.indexOf(item.from) * rowHeight +
                          rowHeight * 0.5 - strokeWidth * 0.5}
                        x2={nameWidth + item.time}
                        y2={rowHeight + players.indexOf(item.to) * rowHeight +
                          rowHeight * 0.5 - strokeWidth * 0.5}
                        stroke="orange"
                        strokeDasharray="5,5"
                      />
                    )
                    : undefined}
                  {item.to
                    ? (
                      <rect
                        x={nameWidth + item.time}
                        y={rowHeight + players.indexOf(item.to) * rowHeight +
                          rowHeight * 0.5 - strokeWidth * 0.5}
                        height={strokeWidth}
                        width={(nextChange ? nextChange.time : endTime) -
                          (item.time)}
                        fill="orange"
                      />
                    )
                    : undefined}
                </g>
              );
            }
            case "exit":
              return <g></g>;
            case "enter":
              return <g></g>;
          }
        })}
      </g>
    </svg>
  );

  await Deno.writeTextFile(
    join(outPath, "./2025-03-08.svg"),
    renderToString(svg),
  );
}

const UserLabel = (
  { username, skinImage }: { username: string; skinImage: Image },
) => {
  return (
    <>
      <title>{`userLabel(${username})`}</title>
      <g transform="translate(18,0) scale(0.4)">
        <g transform="scale(8) translate(-4,-4)">
          {createArray(8).map(
            (x) =>
              createArray(8).map((y) => {
                const { r, g, b, a } = getPixelAt(
                  skinImage,
                  8 + x,
                  8 + y,
                );
                return (
                  <rect
                    key={`${x},${y}`}
                    x={x - 0.01}
                    y={y - 0.01}
                    width={1.01}
                    height={1.01}
                    stroke="none"
                    fill={`rgba(${r}, ${g}, ${b}, ${a})`}
                  />
                );
              }),
          )}
        </g>
        <g transform="scale(9) translate(-4,-4)">
          {createArray(8).map(
            (x) =>
              createArray(8).map((y) => {
                const { r, g, b, a } = getPixelAt(
                  skinImage,
                  40 + x,
                  8 + y,
                );
                return (
                  <rect
                    key={`${x},${y}`}
                    x={x - 0.01}
                    y={y - 0.01}
                    width={1.01}
                    height={1.01}
                    stroke="none"
                    fill={`rgba(${r}, ${g}, ${b}, ${a})`}
                  />
                );
              }),
          )}
        </g>
      </g>
      <text
        x={36}
        y={0}
        dominantBaseline="middle"
      >
        {username}
      </text>
    </>
  );
};

type Image = Readonly<Awaited<ReturnType<typeof decodePNG>>>;

async function getPlayersSkin(
  players: ReadonlyArray<string>,
): Promise<ReadonlyArray<{ username: string; skinImage: Image }>> {
  const result: { username: string; skinImage: Image }[] = [];
  for (const username of players) {
    const cachePath = join(outPath, `./skin/${username}.png`);
    try {
      result.push({
        username,
        skinImage: await decodePNG(await Deno.readFile(cachePath)),
      });
    } catch (_) {
      const skinImage = await getSkinImage(await usernameToUuid(username));

      await ensureDir(join(outPath, "./skin"));
      await Deno.writeFile(cachePath, skinImage);

      result.push({
        username,
        skinImage: await decodePNG(skinImage),
      });
    }
  }
  return result;
}

await main(resultInputToResult(result));
console.log("done");

function getPixelAt(
  { body, header }: Image,
  x: number,
  y: number,
): { r: number; g: number; b: number; a: number } {
  const offset = (y * header.width + x) * 4;
  return {
    r: body[offset]!,
    g: body[offset + 1]!,
    b: body[offset + 2]!,
    a: body[offset + 3]!,
  };
}

function createArray(length: number): ReadonlyArray<number> {
  return Array.from({ length }, (_, i) => i);
}

function calcMoney<Player extends string>(
  { items, endTime }: Pick<Result<Player>, "items" | "endTime">,
  player: Player,
): number {
  let money = 0;
  /**
   * 前回の捕まっていない状態時刻
   * null は前回鬼もしくは退出状態だったということ
   */
  let prevState: number | "oni" | "escaped" | "escapedOni" = 0;
  for (const item of items) {
    switch (item.type) {
      case "touch":
        if (item.to === player) {
          if (typeof prevState === "number") {
            money += item.time - prevState;
          }
          prevState = "oni";
        }
        if (item.from === player) {
          prevState = item.time;
        }
        break;
      case "oniChange":
        break;
      case "exit":
        if (typeof prevState === "number") {
          money += item.time - prevState;
          prevState = "escaped";
        } else {
          prevState = "escapedOni";
        }
        break;
      case "enter":
        if (prevState === "escaped") {
          prevState = item.time;
        }
        if (prevState === "escapedOni") {
          prevState = "oni";
        }
    }
  }
  if (typeof prevState === "number") {
    return money + endTime - prevState;
  }
  return money;
}

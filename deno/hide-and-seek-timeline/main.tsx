// @ts-types="npm:@types/react"
import React from "npm:react";
// @ts-types="npm:react-dom/server"
import { renderToString } from "npm:react-dom/server";
import { ensureDir } from "jsr:@std/fs";
import { join } from "jsr:@std/path";
import { getSkinImage, usernameToUuid } from "../skin.ts";
import { decodePNG } from "jsr:@img/png";
import { Item, parseTime } from "./type.ts";
import { items, players } from "./data/2025-03-08.ts";

const outPath = "./deno/hide-and-seek-timeline/out";

async function main<Player extends string>(
  { players, items }: {
    readonly players: ReadonlyArray<Player>;
    readonly items: ReadonlyArray<Item<Player>>;
  },
) {
  const sortedItems = items.toSorted((a, b) =>
    parseTime(a.time) - parseTime(b.time)
  );
  /**
   * 開催時間
   */
  const endTime = 20 * 60;

  const nameWidth = 190;

  const moneyWidth = 200;

  const rowHeight = 32;

  await ensureDir(outPath);

  const playerAndSkinImages = await getPlayersSkin(players);

  const svg = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${nameWidth + endTime + moneyWidth} ${
        rowHeight + players.length * rowHeight
      }`}
    >
      <g>
        <rect
          x={0}
          y={0}
          width={nameWidth + endTime + moneyWidth}
          height={rowHeight}
          fill="#fff"
        />
        {Array.from(
          { length: endTime / 60 + 1 },
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
      {playerAndSkinImages.map(({ username, skinImage }, index) => (
        <g key={username}>
          <rect
            x={0}
            y={rowHeight + rowHeight * index}
            width={nameWidth + endTime + moneyWidth}
            height={rowHeight}
            fill={["#ace38f", "#00e851", "#cae8ba"][index % 3]}
          />
          <g
            transform={`translate(0, ${rowHeight + rowHeight * (index + 0.5)})`}
          >
            <UserLabel username={username} skinImage={skinImage} />
          </g>
        </g>
      ))}
      {Array.from(
        { length: endTime / 60 + 1 },
        (_, i) => (
          <line
            key={i}
            x1={nameWidth + i * 60}
            y1={0}
            x2={nameWidth + i * 60}
            y2={rowHeight + players.length * rowHeight}
            stroke="gray"
          />
        ),
      )}
      {sortedItems.map((item, index) => {
        switch (item.type) {
          case "oniChange": {
            const nextChange = sortedItems.slice(index).find((e) =>
              e.type === "oniChange" && e.from === item.to
            );
            const strokeWidth = 20;
            return (
              <g key={index}>
                {item.to
                  ? (
                    <rect
                      x={nameWidth + parseTime(item.time)}
                      y={rowHeight + players.indexOf(item.to) * rowHeight +
                        rowHeight * 0.5 - strokeWidth * 0.5}
                      height={strokeWidth}
                      width={(nextChange
                        ? parseTime(nextChange.time)
                        : endTime) - parseTime(item.time)}
                      fill="red"
                    />
                  )
                  : undefined}
              </g>
            );
          }
          case "touch":
            return <g></g>;
          case "exit":
            return <g></g>;
          case "enter":
            return <g></g>;
        }
      })}
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

await main({
  items,
  players,
});
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

// @ts-types="npm:@types/react"
import React from "npm:react";
// @ts-types="npm:react-dom/server"
import { renderToString } from "npm:react-dom/server";
import { ensureDir } from "jsr:@std/fs";
import { join } from "jsr:@std/path";
import { getSkinImage, usernameToUuid } from "../skin.ts";
import { decodePNG } from "jsr:@img/png";
import { Result, resultInputToResult } from "./type.ts";
import { result } from "./data/2025-05-17.ts";
import { calcMoney } from "./calcMoney.ts";
import { format } from "npm:prettier";

const outPath = "./deno/hide-and-seek-timeline/out";

async function main<Player extends string>(
  { title, players, items, endTime, colors, tasks, eggs }: Result<Player>,
) {
  const nameWidth = 190;

  const moneyWidth = 48;

  const rowHeight = 32;

  const imageWidth = nameWidth + endTime + moneyWidth + 8;

  await ensureDir(outPath);

  const playerAndSkinImages = await getPlayersSkin(players);

  const playerMoneys = players.map((player) => ({
    player,
    money: calcMoney({ items, endTime, tasks, eggs }, player),
  }));

  await Deno.writeTextFile(
    join(outPath, `./${title}.txt`),
    [
      ...playerMoneys.map(({ player, money }) =>
        `/pay ${player} ${money}
`
      ),
      `# sum: ${playerMoneys.reduce((v, { money: a }) => a + v, 0)}
`,
    ].join(""),
  );

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
            fill={colors[index % colors.length]}
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
            {calcMoney({ items, endTime, tasks, eggs }, username)}
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
            case "exit": {
              const strokeWidth = rowHeight;
              const nextEnter = items.slice(index).find((e) =>
                e.type === "enter" && e.player === item.player
              );
              return (
                <g key={index}>
                  <rect
                    x={nameWidth + item.time}
                    y={rowHeight + players.indexOf(item.player) * rowHeight +
                      rowHeight * 0.5 - strokeWidth * 0.5}
                    height={strokeWidth}
                    width={(nextEnter ? nextEnter.time : endTime) -
                      (item.time)}
                    fill="gray"
                  />
                </g>
              );
            }
            case "enter":
              return undefined;
          }
        })}
      </g>
      <defs>
        <linearGradient
          id="task-gradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor="skyblue" />
          <stop offset="100%" stopColor="blue" />
        </linearGradient>
      </defs>

      <g>
        {tasks?.map((task) => (
          <g key={`task-${task.player}`}>
            {task.time
              ? (
                <rect
                  x={nameWidth + task.time.start}
                  y={rowHeight + players.indexOf(task.player) * rowHeight +
                    rowHeight * 0.7}
                  height={rowHeight * 0.2}
                  width={task.time.end - task.time.start}
                  fill="url(#task-gradient)"
                  stroke="black"
                />
              )
              : undefined}
          </g>
        ))}
      </g>

      <g>
        {eggs?.map(({ egg, player, time }) => (
          <g
            key={`egg-${player}-${egg}`}
            transform={`translate(${nameWidth + time}, ${
              rowHeight + players.indexOf(player) * rowHeight
            })`}
          >
            <rect
              height={rowHeight * 0.2}
              width={1}
              stroke="none"
              fill="#02be63"
            />
            <text
              y={rowHeight * 0.5}
              textAnchor="middle"
              fontSize={12}
            >
              {egg}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );

  const svgPath = join(outPath, `./${title}.svg`);

  await Deno.writeTextFile(
    svgPath,
    await format(renderToString(svg), { parser: "html" }),
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
                    x={x}
                    y={y}
                    width={1}
                    height={1}
                    stroke={`rgba(${r}, ${g}, ${b}, ${a})`}
                    strokeWidth={0.03}
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
                    x={x}
                    y={y}
                    width={1}
                    height={1}
                    stroke={`rgba(${r}, ${g}, ${b}, ${a})`}
                    strokeWidth={0.03}
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
      // throw new Error("get new Image");
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

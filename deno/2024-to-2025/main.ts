import { decode, Image } from "https://deno.land/x/imagescript@1.3.0/mod.ts";
import {
  closestColor,
  fromImageMagicColor,
  getColorById,
  toImageMagicColor,
} from "./color.ts";

const readImageFromFile = async (url: URL): Promise<Image> => {
  const image = await decode(await (await fetch(url)).arrayBuffer());
  if (image instanceof Image) {
    return image;
  } else {
    throw new Error("Image is not an Image in " + url);
  }
};

const discretizeImageColors = (input: Image): Image => {
  const result = new Image(input.width, input.height);
  for (let y = 1; y < input.height + 1; y++) {
    for (let x = 1; x < input.width + 1; x++) {
      const pixel = fromImageMagicColor(input.getPixelAt(x, y));
      const colorId = closestColor(pixel);
      result.setPixelAt(
        x,
        y,
        toImageMagicColor(
          getColorById(
            colorId,
          ),
        ),
      );
    }
  }
  return result;
};

const createLeafImage = (input: Image): Image => {
  const result = new Image(input.width, input.height);
  for (let y = 1; y < input.height + 1; y++) {
    for (let x = 1; x < input.width + 1; x++) {
      const pixel = fromImageMagicColor(input.getPixelAt(x, y));
      const colorId = closestColor(pixel);
      result.setPixelAt(
        x,
        y,
        toImageMagicColor(getColorById(
          // colorId,
          colorId === "white" ? "white" : "lime",
        )),
      );
    }
  }
  return result;
};

type Position = { readonly x: number; readonly z: number };

type Direction = typeof directions[number];

const directions = ["north", "south", "west", "east"] as const;

/**
 * ランダムな方向
 */
const randomDirection = (): Direction => {
  const table = ["north", "north", "north", "south", "west", "east"] as const;
  return table[Math.floor(Math.random() * table.length)]!;
};

const moveDirection = (
  position: Position,
  direction: Direction,
): Position => {
  switch (direction) {
    case "north":
      return { x: position.x, z: position.z - 1 };
    case "south":
      return { x: position.x, z: position.z + 1 };
    case "west":
      return { x: position.x - 1, z: position.z };
    case "east":
      return { x: position.x + 1, z: position.z };
  }
};

/** 反対の方向 */
const oppositeDirection = (direction: Direction): Direction => {
  switch (direction) {
    case "north":
      return "south";
    case "south":
      return "north";
    case "west":
      return "east";
    case "east":
      return "west";
  }
};

const createCommands = (lower: Image, upper: Image): string => {
  const size = 16 * 8;
  const commands: string[] = [];
  /** コンクリートパウダーのY座標を格納するテーブル */
  const heightTable: (number | undefined)[][] = Array.from(
    { length: size },
    (_) => Array.from({ length: size }, (_) => undefined),
  );
  /** まだ埋めていない座標 */
  const blankPositions: Array<Position> = Array.from(
    { length: size },
  ).flatMap((_, x) => Array.from({ length: size }, (_, z) => ({ x, z })));

  const setHeight = (
    position: Position,
    height: number,
    direction: Direction,
  ): void => {
    const light = (position.x % 8) === 0 && (position.z % 8) === 0;
    if (!light) {
      heightTable[position.x]![position.z] = height;
    }
    blankPositions.splice(
      blankPositions.findIndex((p) => p.x === position.x && p.z === position.z),
      1,
    );

    const lowerColorId = closestColor(
      fromImageMagicColor(
        lower.getPixelAt(1 + position.x, 1 + position.z),
      ),
    );
    const upperColorId = closestColor(
      fromImageMagicColor(
        upper.getPixelAt(1 + position.x, 1 + position.z),
      ),
    );

    if (light) {
      if (lowerColorId === "sand" || upperColorId === "sand") {
        throw new Error("sand is not allowed in light");
      }
      commands.push(
        `setblock ~${position.x} ~${startY} ~${position.z} ${lowerColorId}_stained_glass`,
      );
      commands.push(
        `setblock ~${position.x} ~${
          startY - 1
        } ~${position.z} verdant_froglight`,
      );
      if (lowerColorId === upperColorId) {
        return;
      }
      commands.push(
        `setblock ~${position.x} ~${
          height - 1
        } ~${position.z} wall_torch[facing=${oppositeDirection(direction)}]`,
      );
      commands.push(
        `setblock ~${position.x} ~${height} ~${position.z} ${upperColorId}_carpet`,
      );
    } else {
      commands.push(
        `setblock ~${position.x} ~${
          height - 1
        } ~${position.z} wall_torch[facing=${oppositeDirection(direction)}]`,
      );
      commands.push(
        `setblock ~${position.x} ~${height} ~${position.z} ${
          lowerColorId === "sand" ? `sand` : `${lowerColorId}_concrete_powder`
        }`,
      );

      if (lowerColorId === upperColorId) {
        return;
      }
      commands.push(
        `setblock ~${position.x} ~${height + 1} ~${position.z} ${
          upperColorId === "sand" ? `sand` : `${upperColorId}_carpet`
        }`,
      );
    }
  };

  const startPosition = { x: Math.floor(size / 2), z: size - 1 };
  const startY = 1;
  // const startY = 64;
  commands.push(
    `setblock ~${startPosition.x} ~${startY} ~${startPosition.z + 1} stone`,
  );
  setHeight({ x: Math.floor(size / 2), z: size - 1 }, startY + 1, "south");

  while (true) {
    if (blankPositions.length === 0) {
      return commands.join("\n");
    }
    const targetPosition =
      blankPositions[Math.floor(Math.random() * blankPositions.length)]!;
    const direction = randomDirection();
    const basePosition = moveDirection(targetPosition, direction);
    const baseHeight = heightTable[basePosition.x]?.[basePosition.z];
    if (baseHeight === undefined || baseHeight > 318) {
      console.log("skip", blankPositions.length);
      continue;
    }
    setHeight(targetPosition, baseHeight + 1, direction);
  }
};

await Deno.writeFile(
  new URL(import.meta.resolve("./img/leaf-out.png")),
  await (createLeafImage(
    await readImageFromFile(
      new URL(import.meta.resolve("./img/leaf.png")),
    ),
  ).encode()),
);

const carpetImage = discretizeImageColors(
  await readImageFromFile(
    new URL(import.meta.resolve("./img/2024.png")),
  ),
);

await Deno.writeFile(
  new URL(import.meta.resolve("./img/2024-out.png")),
  await carpetImage.encode(),
);

const concretePowderImage = discretizeImageColors(
  await readImageFromFile(
    new URL(import.meta.resolve("./img/2025.png")),
  ),
);

await Deno.writeFile(
  new URL(import.meta.resolve("./img/2025-out.png")),
  await concretePowderImage.encode(),
);

const functionPath = (name: string): URL =>
  new URL(import.meta.resolve(`./art/data/art/function/${name}.mcfunction`));

// await Deno.writeTextFile(
//   functionPath("m"),
//   createCommands(
//     concretePowderImage,
//     carpetImage,
//   ),
// );

await Deno.writeTextFile(
  functionPath("c"),
  Array.from(
    { length: 320 },
    (_, i) => `fill ~ ~${i} ~ ~128 ~${i} ~128 air`,
  ).join("\n"),
);

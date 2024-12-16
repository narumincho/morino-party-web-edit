import { decode, Image } from "https://deno.land/x/imagescript@1.3.0/mod.ts";
import {
  closestColor,
  ColorId,
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

const create2024Image = (input: Image): Image => {
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

const create2025Image = (input: Image): Image => {
  const result = new Image(input.width, input.height);
  for (let y = 1; y < input.height + 1; y++) {
    for (let x = 1; x < input.width + 1; x++) {
      const pixel = fromImageMagicColor(input.getPixelAt(x, y));
      result.setPixelAt(
        x,
        y,
        toImageMagicColor(getColorById(closestColor(pixel))),
      );
    }
  }
  return result;
};

type Position = { readonly x: number; readonly z: number };

type Direction = typeof directions[number];

const directions = ["north", "south", "west", "east"] as const;

const randomDirection = (): Direction => {
  return directions[Math.floor(Math.random() * directions.length)]!;
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

  const setHeight = (position: Position, height: number): void => {
    heightTable[position.x]![position.z] = height;
    blankPositions.splice(
      blankPositions.findIndex((p) => p.x === position.x && p.z === position.z),
      1,
    );
  };

  const getLowerImageColorId = (position: Position): ColorId => {
    return closestColor(
      fromImageMagicColor(
        lower.getPixelAt(1 + position.x, 1 + position.z),
      ),
    );
  };

  const startPosition = { x: Math.floor(size / 2), z: size - 1 };
  setHeight(startPosition, 65);
  const startColorId = getLowerImageColorId(startPosition);
  commands.push(
    `setblock ~${startPosition.x} ~64 ~${startPosition.z + 1} stone`,
  );
  commands.push(
    `setblock ~${startPosition.x} ~64 ~${startPosition.z} wall_torch[facing=north]`,
  );
  commands.push(
    `setblock ~${startPosition.x} ~65 ~${startPosition.z} ${
      startColorId === "sand" ? `sand` : `${startColorId}_concrete_powder`
    }`,
  );

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
    setHeight(targetPosition, baseHeight + 1);
    const colorId = getLowerImageColorId(targetPosition);
    commands.push(
      `setblock ~${targetPosition.x} ~${baseHeight} ~${targetPosition.z} wall_torch[facing=${
        oppositeDirection(direction)
      }]`,
    );
    commands.push(
      `setblock ~${targetPosition.x} ~${baseHeight + 1} ~${targetPosition.z} ${
        colorId === "sand" ? `sand` : `${colorId}_concrete_powder`
      }`,
    );
  }
};

const carpetImage = create2024Image(
  await readImageFromFile(
    new URL(import.meta.resolve("./img/2024.png")),
  ),
);

await Deno.writeFile(
  new URL(import.meta.resolve("./img/2024-out.png")),
  await carpetImage.encode(),
);

const concretePowderImage = create2025Image(
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

await Deno.writeTextFile(
  functionPath("m"),
  createCommands(
    concretePowderImage,
    carpetImage,
  ),
);

await Deno.writeTextFile(
  functionPath("c"),
  Array.from(
    { length: 320 },
    (_, i) => `fill ~ ~${i} ~ ~128 ~${i} ~128 air`,
  ).join("\n"),
);

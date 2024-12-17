import { decode, Image } from "https://deno.land/x/imagescript@1.3.0/mod.ts";
import {
  ColorId,
  colorIdFromImageMagicColor,
  colorIdToImageMagicColor,
} from "./color.ts";

const size = 16 * 8;

// const startY = -60;
const startY = 62;

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
      result.setPixelAt(
        x,
        y,
        colorIdToImageMagicColor(
          colorIdFromImageMagicColor(input.getPixelAt(x, y)),
        ),
      );
    }
  }
  return result;
};

const createMaskTemplateImage = (a: Image, b: Image): Image => {
  const result = new Image(size, size);
  for (let y = 1; y < size + 1; y++) {
    for (let x = 1; x < size + 1; x++) {
      const isLight = ((x + 4) % 8) === 0 && ((y + 4) % 8) === 0;
      const aColorId = colorIdFromImageMagicColor(a.getPixelAt(x, y));
      const bColorId = colorIdFromImageMagicColor(b.getPixelAt(x, y));
      if (aColorId === bColorId) {
        result.setPixelAt(
          x,
          y,
          colorIdToImageMagicColor(isLight ? "yellow" : "orange"),
        );
      } else {
        result.setPixelAt(
          x,
          y,
          colorIdToImageMagicColor(isLight ? "gray" : "black"),
        );
      }
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
  const table = ["north", "north", "south", "west", "east"] as const;
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

type CellType = {
  readonly type: "singleFallen";
  readonly colorId: ColorId;
} | {
  readonly type: "singleNormal";
  readonly colorId: ColorId;
  readonly height: number;
  readonly direction: Direction;
} | {
  readonly type: "singleLight";
  readonly colorId: ColorId;
} | {
  readonly type: "dualFallen";
  readonly lowerColorId: ColorId;
  readonly upperColorId: ColorId;
  readonly height: number;
  readonly direction: Direction;
} | {
  readonly type: "dualNormal";
  readonly lowerColorId: ColorId;
  readonly upperColorId: ColorId;
  readonly height: number;
  readonly direction: Direction;
} | {
  readonly type: "dualLight";
  readonly lowerColorId: ColorId;
  readonly upperColorId: ColorId;
  readonly height: number;
  readonly direction: Direction;
};

const setBlock = (position: Position, y: number, block: string): string => {
  return `setblock ~${position.x} ${y} ~${position.z} ${block}`;
};

const maskColorIdToCellTypeTag = (colorId: ColorId): CellType["type"] => {
  switch (colorId) {
    case "orange":
      return "singleFallen";
    case "red":
      return "singleNormal";
    case "yellow":
      return "singleLight";
    case "green":
      return "dualFallen";
    case "black":
      return "dualNormal";
    case "gray":
      return "dualLight";
  }
  throw new Error(`Unexpected colorId for mask: ${colorId}`);
};

const createCellCommand = (
  position: Position,
  cellType: CellType,
) => {
  return `# ${position.x},${position.z}
${createCellCommandRaw(position, cellType)}
`;
};

const createCellCommandRaw = (
  position: Position,
  cellType: CellType,
) => {
  switch (cellType.type) {
    case "singleFallen":
      return setBlock(position, startY, `${cellType.colorId}_wool`);
    case "singleNormal":
      return `${
        setBlock(
          position,
          cellType.height - 1,
          `wall_torch[facing=${oppositeDirection(cellType.direction)}]`,
        )
      }
${setBlock(position, cellType.height, `${cellType.colorId}_concrete_powder`)}`;
    case "singleLight":
      return `${setBlock(position, startY - 1, "verdant_froglight")}
${setBlock(position, startY, `${cellType.colorId}_stained_glass`)}`;
    case "dualFallen":
      return `${
        setBlock(
          position,
          startY,
          `${cellType.lowerColorId}_wool`,
        )
      }
${
        setBlock(
          position,
          cellType.height - 1,
          `wall_torch[facing=${oppositeDirection(cellType.direction)}]`,
        )
      }
${setBlock(position, cellType.height, `${cellType.upperColorId}_carpet`)}`;
    case "dualNormal":
      return `${
        setBlock(
          position,
          cellType.height - 1,
          `wall_torch[facing=${oppositeDirection(cellType.direction)}]`,
        )
      }
${
        setBlock(
          position,
          cellType.height,
          `${cellType.lowerColorId}_concrete_powder`,
        )
      }
${setBlock(position, cellType.height + 1, `${cellType.upperColorId}_carpet`)}`;
    case "dualLight":
      return `${setBlock(position, startY - 1, "verdant_froglight")}
${
        setBlock(
          position,
          startY,
          `${cellType.lowerColorId}_stained_glass`,
        )
      }
${
        setBlock(
          position,
          cellType.height - 1,
          `wall_torch[facing=${oppositeDirection(cellType.direction)}]`,
        )
      }
${setBlock(position, cellType.height, `${cellType.upperColorId}_carpet`)}`;
  }
};

const getImageColorId = (image: Image, position: Position): ColorId => {
  return colorIdFromImageMagicColor(
    image.getPixelAt(1 + position.x, 1 + position.z),
  );
};

const createCommands = (
  { mask, lower, upper }: {
    readonly mask: Image;
    readonly lower: Image;
    readonly upper: Image;
  },
): string => {
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

  const setCell = (
    position: Position,
    height: number | undefined,
  ): void => {
    if (typeof height === "number") {
      heightTable[position.x]![position.z] = height;
    }
    blankPositions.splice(
      blankPositions.findIndex((p) => p.x === position.x && p.z === position.z),
      1,
    );
  };

  const startPosition: Position = { x: 37, z: 55 };

  commands.push(
    `setblock ~${startPosition.x - 1} ${startY + 1} ~${startPosition.z} stone`,
  );
  commands.push(
    createCellCommand(startPosition, {
      type: "dualNormal",
      lowerColorId: getImageColorId(lower, startPosition),
      upperColorId: getImageColorId(upper, startPosition),
      direction: "west",
      height: startY + 2,
    }),
  );
  setCell(startPosition, startY + 2);

  commands.push("# ===== singleFallen singleLight");
  for (let x = 0; x < size; x++) {
    for (let z = 0; z < size; z++) {
      const cellTypeTag = maskColorIdToCellTypeTag(
        getImageColorId(mask, { x, z }),
      );
      if (cellTypeTag === "singleFallen" || cellTypeTag === "singleLight") {
        commands.push(
          createCellCommand(
            { x, z },
            {
              type: cellTypeTag,
              colorId: getImageColorId(lower, { x, z }),
            },
          ),
        );
        setCell({ x, z }, undefined);
      }
    }
  }

  commands.push(`# ===== main ${blankPositions.length}`);

  let skipCount = 0;
  while (true) {
    if (blankPositions.length === 0) {
      return commands.join("\n");
    }
    const targetPosition =
      blankPositions[Math.floor(Math.random() * blankPositions.length)]!;
    const direction = randomDirection();
    const basePosition = moveDirection(targetPosition, direction);
    const baseHeight = heightTable[basePosition.x]?.[basePosition.z];
    if (baseHeight === undefined) {
      skipCount++;
      if (skipCount > 100000) {
        console.log("Too many skip");
        console.log(blankPositions);
        return commands.join("\n");
      }
      console.log("skip", blankPositions.length);
      continue;
    }
    if (baseHeight > 318) {
      console.log("skip too height", blankPositions.length);
      continue;
    }
    skipCount = 0;
    const cellTypeTag = maskColorIdToCellTypeTag(
      getImageColorId(mask, targetPosition),
    );
    switch (cellTypeTag) {
      case "singleFallen":
        throw new Error("Unexpected singleFallen");
      case "singleNormal":
        commands.push(
          createCellCommand(
            targetPosition,
            {
              type: "singleNormal",
              colorId: getImageColorId(lower, targetPosition),
              height: baseHeight + 1,
              direction,
            },
          ),
        );
        setCell(targetPosition, baseHeight + 1);
        break;
      case "singleLight":
        throw new Error("Unexpected singleLight");
      case "dualFallen":
        commands.push(
          createCellCommand(
            targetPosition,
            {
              type: "dualFallen",
              lowerColorId: getImageColorId(lower, targetPosition),
              upperColorId: getImageColorId(upper, targetPosition),
              height: baseHeight + 1,
              direction,
            },
          ),
        );
        setCell(targetPosition, undefined);
        break;
      case "dualNormal":
        commands.push(
          createCellCommand(
            targetPosition,
            {
              type: "dualNormal",
              lowerColorId: getImageColorId(lower, targetPosition),
              upperColorId: getImageColorId(upper, targetPosition),
              height: baseHeight + 1,
              direction,
            },
          ),
        );
        setCell(targetPosition, baseHeight + 1);
        break;
      case "dualLight":
        commands.push(
          createCellCommand(
            targetPosition,
            {
              type: "dualLight",
              lowerColorId: getImageColorId(lower, targetPosition),
              upperColorId: getImageColorId(upper, targetPosition),
              height: baseHeight + 1,
              direction,
            },
          ),
        );
        setCell(targetPosition, undefined);
        break;
    }
  }
};

const img2024 = discretizeImageColors(
  await readImageFromFile(
    new URL(import.meta.resolve("./img/2024.png")),
  ),
);

await Deno.writeFile(
  new URL(import.meta.resolve("./img/2024-out.png")),
  await img2024.encode(),
);

const img2025 = discretizeImageColors(
  await readImageFromFile(
    new URL(import.meta.resolve("./img/2025.png")),
  ),
);

await Deno.writeFile(
  new URL(import.meta.resolve("./img/2025-out.png")),
  await img2025.encode(),
);

const imageMaskTemplate = createMaskTemplateImage(img2024, img2025);

await Deno.writeFile(
  new URL(import.meta.resolve("./img/maskTemplate.png")),
  await imageMaskTemplate.encode(),
);

const mask = discretizeImageColors(
  await readImageFromFile(
    new URL(import.meta.resolve("./img/mask.png")),
  ),
);

await Deno.writeFile(
  new URL(import.meta.resolve("./img/mask-out.png")),
  await mask.encode(),
);

const functionPath = (name: string): URL =>
  new URL(import.meta.resolve(`./art/data/art/function/${name}.mcfunction`));

await Deno.writeTextFile(
  functionPath("m"),
  createCommands({
    mask,
    lower: img2025,
    upper: img2024,
  }),
);

await Deno.writeTextFile(
  functionPath("c"),
  `kill @e[type=!minecraft:player]
` +
    Array.from(
      { length: 63 },
      (_, i) => `fill ~-2 ${i} ~-2 ~130 ${i} ~130 water`,
    ).join("\n") + "\n" + Array.from(
      { length: 10 },
      (_, i) => `fill ~-2 ${63 + i} ~-2 ~130 ${63 + i} ~130 air`,
    ).join("\n"),
);

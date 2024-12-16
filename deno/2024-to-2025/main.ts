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

const createCommands = (concretePowder: Image, carpet: Image): string => {
  const result: string[] = [];
  for (let y = 1; y < concretePowder.height + 1; y++) {
    for (let x = 1; x < concretePowder.width + 1; x++) {
      const colorId = closestColor(
        fromImageMagicColor(concretePowder.getPixelAt(x, y)),
      );
      result.push(
        `setblock ~${x} ~ ~${y} ${
          colorId === "sand" ? `sand` : `${colorId}_concrete_powder`
        }`,
      );
    }
  }
  return result.join("\n");
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

await Deno.writeTextFile(
  new URL(import.meta.resolve("./art/data/art/functions/m.mcfunction")),
  createCommands(
    concretePowderImage,
    carpetImage,
  ),
);

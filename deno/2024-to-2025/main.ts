import { decode, Image } from "https://deno.land/x/imagescript@1.3.0/mod.ts";
import {
  closestColor,
  fromImageMagicColor,
  getColorById,
  randomColor,
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
      const colorId = closestColor(pixel, "grayScale");
      result.setPixelAt(
        x,
        y,
        toImageMagicColor(
          getColorById(
            colorId === "white" ? randomColor(["blue"]) : colorId,
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
        toImageMagicColor(getColorById(closestColor(pixel, "grayScale"))),
      );
    }
  }
  return result;
};

const createTileImage = (input: Image): Image => {
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

await Deno.writeFile(
  new URL(import.meta.resolve("./img/tile-out.png")),
  await createTileImage(
    await readImageFromFile(
      new URL(import.meta.resolve("./img/tile.png")),
    ),
  ).encode(),
);

await Deno.writeFile(
  new URL(import.meta.resolve("./img/2024-out.png")),
  await create2024Image(
    await readImageFromFile(
      new URL(import.meta.resolve("./img/2024.png")),
    ),
  ).encode(),
);

await Deno.writeFile(
  new URL(import.meta.resolve("./img/2025-out.png")),
  await create2025Image(
    await readImageFromFile(
      new URL(import.meta.resolve("./img/2025.png")),
    ),
  ).encode(),
);

// await Deno.writeFile(
//   new URL(import.meta.resolve("./img/2025-out.png")),
//   await create2025Image(
//     await readImageFromFile(
//       import.meta.resolve("./img/2025.png"),
//     ),
//   ).encode(),
// );

import { decode, Image } from "https://deno.land/x/imagescript@1.3.0/mod.ts";

const pngFile = await (await fetch(import.meta.resolve("./ra.png")))
  .arrayBuffer();
const pngParsed = await decode(pngFile);
const target = new Image(pngParsed.width, pngParsed.height);
if (!(pngParsed instanceof Image)) {
  throw new Error("expect png");
}
for (let y = 0; y < pngParsed.height; y++) {
  for (let x = 0; x < pngParsed.width; x++) {
    const [r, g, b, a] = Image.colorToRGBA(pngParsed.getPixelAt(1 + x, 1 + y));
    if (0 < a) {
      target.setPixelAt(
        1 + x,
        1 + y,
        Image.rgbaToColor(r, g, b, Math.random() * 255),
      );
    }
  }
}
await Deno.writeFile("./output.png", await target.encode());

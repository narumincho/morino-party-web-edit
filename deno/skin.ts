import { getProfile } from "./profile.ts";
import { decodeBase64 } from "jsr:@std/encoding/base64";
import { delay } from "jsr:@std/async";
import { decode, Image } from "https://deno.land/x/imagescript@1.3.0/mod.ts";

/**
 * Minecraft ユーザーのUUIDからスキンの顔の画像を生成するAPI
 */
export const handleSkin = async (
  searchParams: URLSearchParams,
): Promise<Response> => {
  const uuid = searchParams.get("uuid");
  if (!uuid) {
    return new Response("UUID is required", { status: 400 });
  }

  const skinImage = await getSkinImage(uuid);
  const skinImageParsed = await decode(skinImage);
  if (!(skinImageParsed instanceof Image)) {
    throw new Error("Failed to decode skin image");
  }

  const canvas = new Image(8, 8);
  // 顔
  drawImage({
    source: skinImageParsed,
    target: canvas,
    targetX: 0,
    targetY: 0,
    sourceX: 8,
    sourceY: 8,
    width: 8,
    height: 8,
  });
  drawImage({
    source: skinImageParsed,
    target: canvas,
    targetX: 0,
    targetY: 0,
    sourceX: 40,
    sourceY: 8,
    width: 8,
    height: 8,
  });

  return new Response(await canvas.encode(), {
    headers: {
      "content-type": "image/png",
    },
  });
};

export async function usernameToUuid(username: string): Promise<string> {
  for (let i = 0; i < 3; i++) {
    const response: { readonly id: string } = await (await fetch(
      `https://api.mojang.com/users/profiles/minecraft/${username}`,
    )).json();
    if (response.id) {
      return response.id;
    }
    await delay(1000);
  }
  throw new Error("取得エラー");
}

export async function getSkinImage(
  uuid: string,
): Promise<Uint8Array<ArrayBuffer>> {
  const profile = await getProfile(uuid);
  const textureProperty = profile.properties.find((property) =>
    property.name === "textures"
  );
  if (!textureProperty) {
    throw new Error("No skin property found");
  }
  const texture: {
    readonly textures: {
      readonly SKIN: {
        readonly url: string;
        readonly metadata?: {
          readonly model: "slim";
        };
      };
    };
  } = JSON.parse(
    new TextDecoder().decode(decodeBase64(textureProperty.value)),
  );
  const skinUrl = texture.textures.SKIN.url;
  if (!skinUrl) {
    throw new Error("No skin url found");
  }
  return new Uint8Array(await (await fetch(skinUrl)).arrayBuffer());
}

const drawImage = (
  { source, target, targetX, targetY, sourceX, sourceY, width, height }: {
    readonly source: Image;
    readonly target: Image;
    readonly targetX: number;
    readonly targetY: number;
    readonly sourceX: number;
    readonly sourceY: number;
    readonly width: number;
    readonly height: number;
  },
) => {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const [sR, sG, sB, sA] = Image.colorToRGBA(
        source.getPixelAt(1 + sourceX + x, 1 + sourceY + y),
      ) as [number, number, number, number];
      const [tR, tG, tB, _tA] = Image.colorToRGBA(
        source.getPixelAt(1 + sourceX + x, 1 + sourceY + y),
      ) as [number, number, number, number];
      if (sA === 0) {
        continue;
      } else {
        const sRate = sA / 255;
        const tRate = 1 - sRate;
        target.setPixelAt(
          1 + targetX + x,
          1 + targetY + y,
          Image.rgbaToColor(
            tR * tRate + sR * sRate,
            tG * tRate + sG * sRate,
            tB * tRate + sB * sRate,
            255,
          ),
        );
      }
    }
  }
};

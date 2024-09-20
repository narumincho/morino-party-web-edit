import { decode, Image } from "https://deno.land/x/imagescript@1.3.0/mod.ts";
import { decodeBase64 } from "jsr:@std/encoding/base64";

Deno.serve(async (request: Request): Promise<Response> => {
  const cors = supportCrossOriginResourceSharing(request);
  if (cors.type === "skipMainProcess") {
    return cors.response;
  }

  const url = new URL(request.url);
  const uuid = url.searchParams.get("uuid");
  if (!uuid) {
    return new Response("UUID is required", {
      status: 400,
      headers: cors.headers,
    });
  }
  // https://minecraft.wiki/w/Mojang_API#Query_player's_skin_and_cape
  const response: {
    readonly name: string;
    readonly properties: ReadonlyArray<{
      readonly name: "textures" | string;
      readonly value: string;
    }>;
  } = await (await fetch(
    `https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`,
  )).json();

  if (url.pathname === "/name") {
    return new Response(JSON.stringify({ name: response.name }), {
      headers: cors.headers,
    });
  }
  if (url.pathname === "/skin") {
    const textureProperty = response.properties.find((property) =>
      property.name === "textures"
    );
    if (!textureProperty) {
      return new Response("No skin property found", {
        status: 404,
        headers: cors.headers,
      });
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
      return new Response("No skin url found", {
        status: 404,
        headers: cors.headers,
      });
    }
    const skinImage = await (await fetch(skinUrl)).arrayBuffer();
    const canvas = new Image(8, 8);
    const skinImageParsed = await decode(skinImage);
    if (!(skinImageParsed instanceof Image)) {
      return new Response("Failed to decode skin image", {
        status: 500,
        headers: cors.headers,
      });
    }
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

    cors.headers.append("content-type", "image/png");
    return new Response(await canvas.encode(), {
      headers: cors.headers,
    });
  }
  return new Response("Not found", { status: 404, headers: cors.headers });
});

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
      );
      if (sA < 255) {
        continue;
      } else {
        target.setPixelAt(
          1 + targetX + x,
          1 + targetY + y,
          Image.rgbaToColor(sR, sG, sB, sA),
        );
      }
    }
  }
};

const supportCrossOriginResourceSharing = (
  request: Request,
):
  | { readonly type: "needMainProcess"; readonly headers: Headers }
  | { readonly type: "skipMainProcess"; readonly response: Response } => {
  const headers = new Headers({
    "access-control-allow-origin": "https://wiki.morino.party",
    vary: "Origin",
  });

  if (request.method === "OPTIONS") {
    headers.set("access-control-allow-methods", "POST, GET, OPTIONS");
    headers.set("access-control-allow-headers", "content-type,authorization");
    return {
      type: "skipMainProcess",
      response: new Response(undefined, { status: 200, headers }),
    };
  }
  return {
    type: "needMainProcess",
    headers,
  };
};

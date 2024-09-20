import { Image } from "https://deno.land/x/imagescript@1.2.17/mod.ts";
import decode from "https://deno.land/x/wasm_image_decoder@v0.0.7/mod.js";
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
    name: string;
    properties: ReadonlyArray<{
      name: "textures" | string;
      value: string;
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
      textures: {
        SKIN: {
          url: string;
          metadata?: {
            model: "slim";
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
    const skinImageParsed = decode(skinImage);
    const skinImageData = skinImageParsed.data;
    console.log(skinImageParsed, skinImageParsed.width, skinImageParsed.height);
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        console.log(x, y);
        const offset = ((8 + y) * skinImageParsed.width + 8 + x) * 4;
        const r = skinImageData[offset];
        const g = skinImageData[offset + 1];
        const b = skinImageData[offset + 2];
        const a = skinImageData[offset + 3];
        console.log(r, g, b, a);
        canvas.setPixelAt(1 + x, 1 + y, r << 24 | g << 16 | b << 8 | a);
      }
    }

    cors.headers.append("content-type", "image/png");
    return new Response(await canvas.encode(), {
      headers: cors.headers,
    });
  }
  return new Response("Not found", { status: 404, headers: cors.headers });
});

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

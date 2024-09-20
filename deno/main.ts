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
    cors.headers.append("content-type", "image/png");
    return new Response(skinImage, {
      headers: cors.headers,
    });
    //   // ArrayBuffer を Blob に変換
    //   const blob = new Blob([arrayBuffer], { type: "image/png" });

    //   // Blob を使ってオブジェクトURLを生成
    //   const url = URL.createObjectURL(blob);

    //   // Image オブジェクトを作成
    //   const img = new Image();

    //   // 画像が読み込まれたらキャンバスに描画
    //   img.onload = function () {
    //     const canvas = document.createElement("canvas");
    //     const ctx = canvas.getContext("2d");

    //     // キャンバスサイズを画像のサイズに設定
    //     canvas.width = img.width;
    //     canvas.height = img.height;

    //     // 画像をキャンバスに描画
    //     ctx.drawImage(img, 0, 0);

    //     // URL を解放
    //     URL.revokeObjectURL(url);

    //     // キャンバスの ImageData を取得して putImageData する場合
    //     const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    //     ctx.putImageData(imageData, 0, 0); // 必要に応じて他のキャンバスに描画する
    //   };

    //   // 画像のソースをオブジェクトURLに設定
    //   img.src = url;
    //   const canvasContext = createCanvas(64, 64).getContext("2d");
    //   canvasContext.putImageData(
    //     new ImageData(skinImage, 64, 64),
    //     0,
    //     0,
    //     8,
    //     8,
    //     8,
    //     8,
    //   );
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

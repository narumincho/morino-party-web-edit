import { S3Client } from "@bradenmacdonald/s3-lite-client";
import { getProfile } from "./profile.ts";
import { handleSkin } from "./skin.ts";
import { handleWebmap } from "./webmap.ts";

export const startServer = (
  { cloudflareR2 }: {
    cloudflareR2: {
      accountId: string;
      bucket: string;
      keyId: string;
      secretKey: string;
    };
  },
) => {
  const s3 = new S3Client({
    endPoint: `${cloudflareR2.accountId}.r2.cloudflarestorage.com`,
    region: "auto",
    accessKey: cloudflareR2.keyId,
    bucket: cloudflareR2.bucket,
    secretKey: cloudflareR2.secretKey,
  });

  Deno.serve(async (request: Request): Promise<Response> => {
    const cors = supportCrossOriginResourceSharing(request);
    if (cors.type === "skipMainProcess") {
      return cors.response;
    }

    const url = new URL(request.url);
    if (url.pathname === "/name") {
      const uuid = url.searchParams.get("uuid");
      if (!uuid) {
        return new Response("UUID is required", { status: 400 });
      }
      const profile = await getProfile(uuid);
      return new Response(JSON.stringify({ name: profile.name }), {
        headers: cors.headers,
      });
    }
    if (url.pathname === "/skin") {
      const response = await handleSkin(url.searchParams);
      cors.headers.forEach((value, key) => {
        response.headers.set(key, value);
      });
      return response;
    }
    if (url.pathname === "/createImageUploadUrl") {
      if (request.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
      }
      return new Response(
        JSON.stringify({
          url: await s3.getPresignedUrl(
            "PUT",
            `minecraft-360/${crypto.randomUUID()}.png`,
          ),
        }),
        {
          headers: {
            ...cors.headers,
            "Content-Type": "application/json",
          },
        },
      );
    }
    const response = await handleWebmap(request);
    const headers = new Headers();
    response.headers.forEach((value, key) => {
      headers.append(key, value);
    });
    cors.headers.forEach((value, key) => {
      headers.append(key, value);
    });
    return new Response(response.body, {
      status: response.status,
      headers,
    });
  });

  const supportCrossOriginResourceSharing = (
    request: Request,
  ):
    | { readonly type: "needMainProcess"; readonly headers: Headers }
    | { readonly type: "skipMainProcess"; readonly response: Response } => {
    const origin = request.headers.get("origin");
    const headers = new Headers({
      "access-control-allow-origin": typeof origin === "string"
        ? origin
        : "https://narumincho-minecraft.deno.dev",
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
};

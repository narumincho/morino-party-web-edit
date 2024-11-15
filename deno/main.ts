import { getProfile } from "./profile.ts";
import { handleSkin } from "./skin.ts";
import { handleWebmap } from "./webmap.ts";

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

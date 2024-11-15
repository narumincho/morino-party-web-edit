export const webmapPrefix = "/webmap";

export const handleWebmap = async (request: Request): Promise<Response> => {
  const urlInput = new URL(request.url);
  const urlRequest = new URL(
    urlInput.pathname.slice(webmapPrefix.length),
    "https://seikatsumain.map.morino.party/",
  );
  for (const [key, value] of urlInput.searchParams) {
    urlRequest.searchParams.append(key, value);
  }
  return await fetch(urlRequest, {
    headers: request.headers,
    body: request.body,
  });
};

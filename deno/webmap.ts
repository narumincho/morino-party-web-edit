export type MarkerGroup = {
  readonly hide: boolean;
  readonly z_index: number;
  readonly name: string;
  readonly control: boolean;
  readonly id: string;
  readonly markers: ReadonlyArray<Marker>;
};

export type Marker =
  & {
    readonly fillColor?: string;
    readonly popup?: string;
    readonly tooltip?: string;
    readonly color?: string;
  }
  & ({
    readonly type: "polyline";
    readonly points: ReadonlyArray<{ readonly z: number; readonly x: number }>;
  } | {
    readonly type: "circle";
    readonly center: { readonly z: number; readonly x: number };
    readonly radius: number;
  });

export const handleWebmap = async (request: Request): Promise<Response> => {
  const urlInput = new URL(request.url);
  const urlRequest = new URL(
    urlInput.pathname,
    "https://seikatsumain.map.morino.party",
  );
  for (const [key, value] of urlInput.searchParams) {
    urlRequest.searchParams.append(key, value);
  }
  const response = await fetch(urlRequest, {
    headers: request.headers,
    body: request.body,
  });
  if (urlInput.pathname === "/tiles/minecraft_overworld/markers.json") {
    console.log("status", response.status);
    const markerGroups: ReadonlyArray<MarkerGroup> = JSON.parse(
      // response.json() では解釈できない? 不正なJSONを返す? ので response.json() を使わず JSON.parse() を使う
      await response.text(),
    );
    const newMarkerGroups = markerGroups.flatMap(
      (markerGroup): ReadonlyArray<MarkerGroup> => {
        switch (markerGroup.id) {
          case "griefprevention":
            return [{
              ...markerGroup,
              markers: markerGroup.markers.map((marker) => ({
                ...marker,
                tooltip: `${
                  marker.popup?.match(/Claim Owner: <span.+?>(.+?)<\/span>/)
                    ?.[1]
                } さんの土地`,
              })),
            }];
          case "Railway":
            return [{
              ...markerGroup,
              hide: false,
              id: "station",
              name: "駅",
              markers: markerGroup.markers.flatMap((marker) =>
                marker.type === "circle"
                  ? [
                    {
                      ...marker,
                      tooltip: marker.popup?.trim().replace("名前 : ", " ") ??
                        "",
                    } satisfies Marker,
                  ]
                  : []
              ),
            }, {
              ...markerGroup,
              hide: false,
              id: "Railway",
              name: "路線",
              markers: markerGroup.markers.filter((marker) =>
                marker.type === "polyline"
              ).map(railwayOverwrite),
            }];
          default:
            return [markerGroup];
        }
      },
    );
    return new Response(JSON.stringify(newMarkerGroups), {
      headers: response.headers,
    });
  }
  return response;
};

const railwayOverwrite = (marker: Marker): Marker => {
  if (marker.popup?.includes("しばむら南区 <-> kara村")) {
    return {
      ...marker,
      popup: `${marker.popup} <br>※駅の場所移動による修正中...`,
      type: "polyline",
      points: [
        { z: -1766, x: 219 },
        { z: -1766, x: 513 },
        { z: -1765, x: 514 },
        { z: -1375, x: 514 },
        { z: -1374, x: 515 },
        { z: -1374, x: 727 },
        { z: -1300, x: 727 },
        { z: -1300, x: 769 },
        { z: -1294, x: 769 },
        { z: -1232, x: 790 },
        { z: -1218, x: 790 },
        { z: -1104, x: 790 },
      ],
    };
  }
  return marker;
};

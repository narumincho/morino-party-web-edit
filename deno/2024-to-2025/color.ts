type Color = {
  readonly r: number;
  readonly g: number;
  readonly b: number;
};

const fromCssRgbFunction = (rgbFunction: RgbFunction): Color => {
  const match = rgbFunction.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (match) {
    const r = Number.parseInt(match[1]!);
    const g = Number.parseInt(match[2]!);
    const b = Number.parseInt(match[3]!);
    return { r, g, b };
  }
  throw new Error("Invalid CSS RGB function " + rgbFunction);
};

type RgbFunction = `rgb(${number},${number},${number})`;

type ColorDataRaw = {
  readonly name: string;
  readonly id: string;
  /** VSCodeのエディタ上で色が見れるためRgbFunctionで表記している */
  readonly rgbFunction: RgbFunction;
  readonly type: ColorType;
};

export type ColorData = {
  readonly name: string;
  readonly id: string;
  readonly color: Color;
  readonly type: ColorType;
};

export type ColorType = "grayScale" | "powderAndCarpet";

export type ColorId =
  | "white"
  | "light_gray"
  | "gray"
  | "black"
  | "brown"
  | "red"
  | "orange"
  | "yellow"
  | "lime"
  | "green"
  | "cyan"
  | "light_blue"
  | "blue"
  | "purple"
  | "magenta"
  | "pink";

// https://github.com/gd-codes/mc-pixelart-maker/blob/main/scripts/data.js
const colorMapRaw = new Map<ColorId, ColorDataRaw>([["white", {
  name: "白",
  id: "white",
  type: "grayScale",
  rgbFunction: "rgb(220, 220, 220)",
}], ["light_gray", {
  name: "薄灰色",
  id: "light_gray",
  type: "grayScale",
  rgbFunction: "rgb(132, 132, 132)",
}], ["gray", {
  name: "灰色",
  id: "gray",
  type: "grayScale",
  rgbFunction: "rgb(65, 65, 65)",
}], ["black", {
  name: "黒",
  id: "black",
  type: "grayScale",
  rgbFunction: "rgb(21, 21, 21)",
}], ["brown", {
  name: "Brown Dye",
  id: "brown",
  type: "powderAndCarpet",
  rgbFunction: "rgb(88, 65, 44)",
}], ["red", {
  name: "Red Dye",
  id: "red",
  type: "powderAndCarpet",
  rgbFunction: "rgb(132, 44, 44)",
}], ["orange", {
  name: "Orange Dye",
  id: "orange",
  type: "powderAndCarpet",
  rgbFunction: "rgb(186, 109, 44)",
}], ["yellow", {
  name: "Yellow Dye",
  id: "yellow",
  type: "powderAndCarpet",
  rgbFunction: "rgb(197, 197, 44)",
}], ["lime", {
  name: "Lime Dye",
  id: "lime",
  type: "powderAndCarpet",
  rgbFunction: "rgb(109, 176, 21)",
}], ["green", {
  name: "Green Dye",
  id: "green",
  type: "powderAndCarpet",
  rgbFunction: "rgb(88, 109, 44)",
}], ["cyan", {
  name: "Cyan Dye",
  id: "cyan",
  type: "powderAndCarpet",
  rgbFunction: "rgb(65, 109, 132)",
}], ["light_blue", {
  name: "Light Blue Dye",
  id: "light_blue",
  type: "powderAndCarpet",
  rgbFunction: "rgb(88, 132, 186)",
}], ["blue", {
  name: "Blue Dye",
  id: "blue",
  type: "powderAndCarpet",
  rgbFunction: "rgb(44, 65, 153)",
}], ["purple", {
  name: "Purple Dye",
  id: "purple",
  type: "powderAndCarpet",
  rgbFunction: "rgb(132, 77, 176)",
}], ["magenta", {
  name: "Magenta Dye",
  id: "magenta",
  type: "powderAndCarpet",
  rgbFunction: "rgb(153, 65, 186)",
}], ["pink", {
  name: "Pink Dye",
  id: "pink",
  type: "powderAndCarpet",
  rgbFunction: "rgb(208, 109, 142)",
}]// ["sand", {
  //   name: "Sand",
  //   id: "sand",
  //   type: "sand",
  //   rgbFunction: "rgb(213, 201, 140)",
  // }]
]);

export const colorMap = new Map<ColorId, ColorData>(
  [...colorMapRaw].map(([id, data]): [ColorId, ColorData] => [
    id,
    {
      id: data.id,
      name: data.name,
      color: fromCssRgbFunction(data.rgbFunction),
      type: data.type,
    },
  ]),
);

export const getColorById = (id: ColorId): Color => {
  const color = colorMap.get(id);
  if (color) {
    return color.color;
  }
  throw new Error("Color not found: " + id);
};

export const randomColor = (
  colorIds: ReadonlyArray<ColorId>,
): ColorId => {
  return colorIds[Math.floor(Math.random() * colorIds.length)]!;
};

/**
 * https://github.com/gd-codes/mc-pixelart-maker/blob/main/scripts/data.js
 */
export const darkPixel = (
  rgb: Color,
): Color => {
  return {
    r: Math.floor(rgb.r * 180 / 220),
    g: Math.floor(rgb.g * 180 / 220),
    b: Math.floor(rgb.b * 180 / 220),
    // 254,
  };
};

/**
 * https://github.com/gd-codes/mc-pixelart-maker/blob/main/scripts/data.js
 */
export function lightPixel(
  rgb: Color,
): Color {
  return {
    r: Math.ceil(rgb.r * 255 / 220),
    g: Math.ceil(rgb.g * 255 / 220),
    b: Math.ceil(rgb.b * 255 / 220),
    // 253,
  };
}

/**
 * https://github.com/gd-codes/mc-pixelart-maker/blob/main/scripts/imageProcessor.js
 */
export const closestColor = (
  color: Color,
  type?: ColorType,
): ColorId => {
  let delta = Infinity;
  let clr: ColorId;
  const r = Math.min(Math.max(color.r, 0), 255);
  const g = Math.min(Math.max(color.g, 0), 255);
  const b = Math.min(Math.max(color.b, 0), 255);
  for (
    const [colorId, colorData] of [...colorMap].filter(([, c]) =>
      type ? c.type === type : true
    )
  ) {
    const c = colorData.color;
    if (r + c.r > 256) {
      const d = 2 * (r - c.r) * (r - c.r) + 4 * (g - c.g) * (g - c.g) +
        3 * (b - c.b) * (b - c.b);
      if (d < delta) {
        delta = d;
        clr = colorId;
      }
    } else {
      const d = 3 * (r - c.r) * (r - c.r) + 4 * (g - c.g) * (g - c.g) +
        2 * (b - c.b) * (b - c.b);
      if (d < delta) {
        delta = d;
        clr = colorId;
      }
    }
  }
  return clr!;
};

export const fromImageMagicColor = (color: number): Color | "transparent" => {
  if ((color & 0xff) === 0) {
    return "transparent";
  }
  const r = (color >> 24) & 0xff;
  const g = (color >> 16) & 0xff;
  const b = (color >> 8) & 0xff;
  return { r, g, b };
};

export const toImageMagicColor = (color: Color | "transparent"): number =>
  color === "transparent"
    ? 0
    : ((color.r << 24) | (color.g << 16) | (color.b << 8) | 0xff) >>> 0;

export const transparentFallback = (
  color: Color | "transparent",
  defaultColor: Color,
): Color => {
  if (color === "transparent") {
    return defaultColor;
  }
  return color;
};

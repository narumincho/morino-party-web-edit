import {
  doubleZ,
  lineBresenham3D,
  setBlock,
  toHalf,
  toSymmetry,
  uniqPositions,
  Vec3,
} from "./lib.ts";

const setY = (position: Vec3, y: number) => ({
  x: position.x,
  y,
  z: position.z,
});

const toCenter = (position: Vec3): Vec3 => setY(position, 0);

const outerA: Vec3 = { x: 41, y: -41, z: 9 };
const outerB: Vec3 = { x: 38, y: -38, z: 14 };
const outerC: Vec3 = { x: 36, y: -36, z: 20 };
const outerD: Vec3 = { x: 34, y: -34, z: 26 };
const outerE: Vec3 = { x: 30, y: -30, z: 33 };
const outerG: Vec3 = { x: 26, y: -26, z: 40 };
const outerH: Vec3 = { x: 21, y: -21, z: 54 };
const outerI: Vec3 = { x: 17, y: -17, z: 66 };
const outerJ: Vec3 = { x: 14, y: -14, z: 77 };
const outerK: Vec3 = { x: 13, y: -13, z: 87 };
const outerL: Vec3 = { x: 11, y: -11, z: 97 };
const outerM: Vec3 = { x: 10, y: -10, z: 105 };
const outerN: Vec3 = { x: 10, y: -10, z: 115 };
const outerO: Vec3 = { x: 9, y: -9, z: 120 };

const innerA = setY(outerA, -34);
const innerB = setY(outerB, -31);
const innerC = setY(outerC, -27);
const innerD = setY(outerD, -25);
const innerE = setY(outerE, -18);
const innerG = setY(outerG, -12);
const innerH = setY(outerH, -10);
const innerI = setY(outerI, -7);
const innerJ = setY(outerJ, -7);
const innerK = setY(outerK, -6);
const innerL = setY(outerL, -5);
const innerM = setY(outerM, -5);
const innerN = setY(outerN, -5);
const innerO = setY(outerO, -4);

const centerG = toCenter(outerG);
const centerH = toCenter(outerH);
const centerI = toCenter(outerI);
const centerJ = toCenter(outerJ);
const centerK = toCenter(outerK);
const centerL = toCenter(outerL);
const centerM = toCenter(outerM);
const centerN = toCenter(outerN);
const centerO = toCenter(outerO);

const mainDeckBottomOuter: Vec3 = { x: 10, y: 14, z: 120 };
const mainDeckBottomInner: Vec3 = { x: 14, y: 10, z: 120 };
const mainDeckBottomCenter = toCenter(mainDeckBottomInner);
const mainDeckTopOuter: Vec3 = { x: 12, y: 15, z: 131 };
const mainDeckTopInner: Vec3 = { x: 15, y: 12, z: 131 };
const mainDeckTopCenter = toCenter(mainDeckTopInner);
const h13Outer: Vec3 = { x: 10, y: 10, z: 132 };
const h13Center = toCenter(h13Outer);
const h23h: Vec3 = { x: 3, y: 3, z: 226 };
const h27: Vec3 = { x: 3, y: 3, z: 247 };
const h27Inner: Vec3 = { x: 2, y: 2, z: 247 };
const topSquare: Vec3 = { x: 1, y: 1, z: 313 };
const top: Vec3 = { x: 0, y: 0, z: 333 };

// position-check.blend グローバル
const pointPairList: ReadonlyArray<readonly [Vec3, Vec3]> = [
  [innerA, innerG],
  [outerA, innerA],
  [innerA, outerB],
  [outerB, innerC],
  [innerC, outerD],
  [outerD, innerE],
  [innerE, outerG],
  [outerA, innerA],
  [outerB, innerB],
  [outerC, innerC],
  [outerD, innerD],
  [outerE, innerE],
  // ノ
  [outerA, outerG],
  [outerG, outerH],
  [outerH, outerI],
  [outerI, outerJ],
  [outerJ, outerK],
  [outerK, outerL],
  [outerL, outerM],
  [outerM, outerN],
  [outerN, outerO],
  // 一
  [outerG, centerG],
  [outerH, centerH],
  [outerI, centerI],
  [outerJ, centerJ],
  [outerK, centerK],
  [outerL, centerL],
  [outerM, centerM],
  [outerN, centerN],
  // inner ｜
  [innerG, innerH],
  [innerH, innerI],
  [innerI, innerJ],
  [innerJ, innerK],
  [innerK, innerL],
  [innerL, innerM],
  [innerM, innerN],
  [innerN, innerO],
  // ｜
  [centerG, centerH],
  [centerH, centerI],
  [centerI, centerJ],
  [centerJ, centerK],
  [centerK, centerL],
  [centerL, centerM],
  [centerM, centerN],
  [centerN, centerO],
  // X
  [outerG, innerH],
  [innerG, outerH],
  [innerG, centerH],
  [centerG, innerH],
  [innerH, outerI],
  [innerH, centerI],
  [outerI, innerJ],
  [centerI, innerJ],
  [innerJ, outerK],
  [innerJ, centerK],
  [outerK, innerL],
  [centerK, innerL],
  [innerL, outerM],
  [innerL, centerM],
  [outerM, innerN],
  [centerM, innerN],
  [innerN, outerO],
  [innerN, centerO],
  // mainDeck
  // [mainDeckBottomOuter, mainDeckBottomInner],
  // [mainDeckBottomInner, mainDeckBottomCenter],
  // [mainDeckBottomInner, mainDeckTopInner],
  // [mainDeckTopOuter, mainDeckTopInner],
  // [mainDeckTopInner, mainDeckTopCenter],
  // top
  // [h13Outer, h13Center],
  // [h13Outer, h23h],
  // [h23h, h27],
  // [h27Inner, topSquare],
  // [topSquare, top],
];

const positions = toHalf(
  pointPairList.flatMap(([a, b]) => lineBresenham3D(doubleZ(a), doubleZ(b))),
);
const maximumPosition: Vec3 = positions.reduce((min, p) => ({
  x: Math.max(min.x, p.vec3.x),
  y: Math.max(min.y, p.vec3.y),
  z: Math.max(min.z, p.vec3.z),
}), positions[0]?.vec3!);
const movedPositions = positions.map((p) => ({
  type: p.type,
  vec3: {
    x: p.vec3.x,
    y: p.vec3.y,
    z: 319 + (p.vec3.z - maximumPosition.z),
  },
}));

await Deno.writeTextFile(
  new URL(import.meta.resolve("./tower/data/tower/function/a.mcfunction")),
  movedPositions.map(({ vec3, type }) =>
    setBlock(
      vec3,
      type === "full"
        ? "minecraft:resin_bricks"
        : type === "top"
        ? "minecraft:resin_brick_slab[type=top]"
        : "minecraft:resin_brick_slab[type=bottom]",
    )
  )
    .join("\n"),
);

await Deno.writeTextFile(
  new URL(import.meta.resolve("./tower/data/tower/function/c.mcfunction")),
  movedPositions.map(({ vec3 }) => setBlock(vec3, "minecraft:air"))
    .join("\n"),
);

/*

paste で 500, -125 で

/tp 500 240 -125
/function tower:a

*/

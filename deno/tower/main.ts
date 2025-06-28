import { lineBresenham3D, setBlock, uniqPositions, Vec3 } from "./lib.ts";

const setY = (position: Vec3, y: number) => ({
  x: position.x,
  y,
  z: position.z,
});

const toCenter = (position: Vec3): Vec3 => setY(position, 0);

const outerA: Vec3 = { x: 41, y: -41, z: 9 };
const outerG: Vec3 = { x: 26, y: -26, z: 40 };
const outerH: Vec3 = { x: 21, y: -21, z: 54 };
const outerI: Vec3 = { x: 17, y: -17, z: 66 };
const outerJ: Vec3 = { x: 14, y: -14, z: 77 };
const outerK: Vec3 = { x: 13, y: -13, z: 87 };
const outerL: Vec3 = { x: 11, y: -11, z: 97 };
const outerM: Vec3 = { x: 10, y: -10, z: 105 };
const outerN: Vec3 = { x: 10, y: -10, z: 115 };
const outerO: Vec3 = { x: 9, y: -9, z: 120 };

const innerG: Vec3 = setY(outerG, -12);
const innerH: Vec3 = setY(outerH, -10);
const innerI: Vec3 = setY(outerI, -7);
const innerJ: Vec3 = setY(outerJ, -7);
const innerK: Vec3 = setY(outerK, -6);
const innerL: Vec3 = setY(outerL, -5);
const innerM: Vec3 = setY(outerM, -5);
const innerN: Vec3 = setY(outerN, -5);
const innerO: Vec3 = setY(outerO, -4);

const centerG = toCenter(outerG);
const centerH = toCenter(outerH);
const centerI = toCenter(outerI);
const centerJ = toCenter(outerJ);
const centerK = toCenter(outerK);
const centerL = toCenter(outerL);
const centerM = toCenter(outerM);
const centerN = toCenter(outerN);
const centerO = toCenter(outerO);

const toSymmetry = (position: Vec3): ReadonlyArray<Vec3> => {
  return [
    { x: position.x, y: position.y, z: position.z },
    { x: position.x, y: -position.y, z: position.z },
    { x: -position.x, y: position.y, z: position.z },
    { x: -position.x, y: -position.y, z: position.z },
    { x: position.y, y: position.x, z: position.z },
    { x: position.y, y: -position.x, z: position.z },
    { x: -position.y, y: position.x, z: position.z },
    { x: -position.y, y: -position.x, z: position.z },
  ];
};

// position-check.blend グローバル
const pointPairList: ReadonlyArray<readonly [Vec3, Vec3]> = [
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
];

const positions: ReadonlyArray<Vec3> = pointPairList.flatMap(([a, b]) =>
  lineBresenham3D(a, b)
).flatMap(toSymmetry);
const maximumPosition: Vec3 = positions.reduce((min, p) => ({
  x: Math.max(min.x, p.x),
  y: Math.max(min.y, p.y),
  z: Math.max(min.z, p.z),
}), positions[0]!);
const movedPositions = positions.map((p) => ({
  x: p.x - maximumPosition.x,
  y: p.y - maximumPosition.y,
  z: 319 + (p.z - maximumPosition.z),
}));

const uniqedPostions = uniqPositions(movedPositions);
console.log(uniqedPostions.length);

await Deno.writeTextFile(
  new URL(import.meta.resolve("./tower/data/tower/function/a.mcfunction")),
  uniqedPostions.map((vec3) => setBlock(vec3, "minecraft:resin_bricks"))
    .join("\n"),
);

await Deno.writeTextFile(
  new URL(import.meta.resolve("./tower/data/tower/function/c.mcfunction")),
  uniqedPostions.map((vec3) => setBlock(vec3, "minecraft:air"))
    .join("\n"),
);

/*

paste で 500, -125 で

/tp 500 240 -125
/function tower:a

*/

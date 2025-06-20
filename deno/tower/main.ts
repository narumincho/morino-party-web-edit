const setBlock = (position: Vec3, block: string): string => {
  return `setblock ~${position.x} ${position.z} ~${position.y} ${block}`;
};

type Vec3 = { readonly x: number; readonly y: number; readonly z: number };

function lineBresenham3D(a: Vec3, b: Vec3): ReadonlyArray<Vec3> {
  const points: Vec3[] = [];
  let x0 = Math.floor(a.x), y0 = Math.floor(a.y), z0 = Math.floor(a.z);
  const x1 = Math.floor(b.x), y1 = Math.floor(b.y), z1 = Math.floor(b.z);
  const dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0), dz = Math.abs(z1 - z0);
  const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1, sz = z0 < z1 ? 1 : -1;

  const ax = dx * 2, ay = dy * 2, az = dz * 2;
  const max = Math.max(dx, dy, dz);
  let err1 = 0, err2 = 0;

  if (max === dx) {
    err1 = ay - dx;
    err2 = az - dx;
    while (true) {
      points.push({ x: x0, y: y0, z: z0 });
      if (x0 === x1) break;
      if (err1 > 0) {
        y0 += sy;
        err1 -= ax;
      }
      if (err2 > 0) {
        z0 += sz;
        err2 -= ax;
      }
      x0 += sx;
      err1 += ay;
      err2 += az;
    }
  } else if (max === dy) {
    err1 = ax - dy;
    err2 = az - dy;
    while (true) {
      points.push({ x: x0, y: y0, z: z0 });
      if (y0 === y1) break;
      if (err1 > 0) {
        x0 += sx;
        err1 -= ay;
      }
      if (err2 > 0) {
        z0 += sz;
        err2 -= ay;
      }
      y0 += sy;
      err1 += ax;
      err2 += az;
    }
  } else {
    err1 = ay - dz;
    err2 = ax - dz;
    while (true) {
      points.push({ x: x0, y: y0, z: z0 });
      if (z0 === z1) break;
      if (err1 > 0) {
        y0 += sy;
        err1 -= az;
      }
      if (err2 > 0) {
        x0 += sx;
        err2 -= az;
      }
      z0 += sz;
      err1 += ay;
      err2 += ax;
    }
  }
  return points;
}

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

await Deno.writeTextFile(
  new URL(import.meta.resolve("./tower/data/tower/function/a.mcfunction")),
  movedPositions.map((vec3) => setBlock(vec3, "minecraft:orange_concrete"))
    .join("\n"),
);

await Deno.writeTextFile(
  new URL(import.meta.resolve("./tower/data/tower/function/c.mcfunction")),
  movedPositions.map((vec3) => setBlock(vec3, "minecraft:air"))
    .join("\n"),
);

/*

paste で 500, -125 で

/tp 500 240 -125
/function tower:a

*/

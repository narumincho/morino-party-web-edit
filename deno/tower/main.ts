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

const outsideA = { x: 42, y: -41, z: 9 };
const outsideG = { x: 26, y: -26, z: 40 };
const outsideH = { x: 21, y: -21, z: 54 };
const outsideI = { x: 17, y: -17, z: 66 };
const outsideJ = { x: 15, y: -14, z: 77 };
const outsideK = { x: 13, y: -13, z: 87 };
const outsideL = { x: 11, y: -12, z: 97 };
const outsideM = { x: 10, y: -11, z: 105 };
const outsideN = { x: 10, y: -10, z: 115 };
const outsideO = { x: 9, y: -10, z: 120 };

const toCenter = (position: Vec3): Vec3 => ({
  x: position.x,
  y: 0,
  z: position.z,
});

// position-check.blend グローバル
const pointPairList: ReadonlyArray<readonly [Vec3, Vec3]> = [
  // ノ
  [outsideA, outsideG],
  [outsideG, outsideH],
  [outsideH, outsideI],
  [outsideI, outsideJ],
  [outsideJ, outsideK],
  [outsideK, outsideL],
  [outsideL, outsideM],
  [outsideM, outsideN],
  [outsideN, outsideO],
  // 一
  [outsideG, toCenter(outsideG)],
  [outsideH, toCenter(outsideH)],
  [outsideI, toCenter(outsideI)],
  [outsideJ, toCenter(outsideJ)],
  [outsideK, toCenter(outsideK)],
  [outsideL, toCenter(outsideL)],
  [outsideM, toCenter(outsideM)],
  [outsideN, toCenter(outsideN)],
];

const positions = pointPairList.flatMap(([a, b]) => lineBresenham3D(a, b));
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

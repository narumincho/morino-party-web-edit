export type Vec3 = {
  readonly x: number;
  readonly y: number;
  readonly z: number;
};

export const uniqPositions = (
  positions: ReadonlyArray<Vec3>,
): ReadonlyArray<Vec3> => {
  const set = new Set<string>();
  for (const position of positions) {
    set.add(`${position.x},${position.y},${position.z}`);
  }
  return [...set].map((e) => {
    const [x, y, z] = e.split(",");
    return {
      x: Number.parseInt(x!),
      y: Number.parseInt(y!),
      z: Number.parseInt(z!),
    };
  });
};

export const setBlock = (position: Vec3, block: string): string => {
  return `setblock ~${position.x} ${position.z} ~${position.y} ${block}`;
};

export function lineBresenham3D(a: Vec3, b: Vec3): ReadonlyArray<Vec3> {
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

/*
The following has been modified from https://github.com/x6ud/poly-partition-js

MIT License

Copyright (c) 2020 x6ud

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import type { Vec2 } from "kaplay";

// Signed area.
function area(a: Vec2, b: Vec2, c: Vec2) {
  return (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y);
}

// Whether corner of a counterclockwise polygon is convex.
function isConvex(p1: Vec2, p2: Vec2, p3: Vec2): boolean {
  return area(p1, p2, p3) < 0;
}

// Whether point is inside a corner of a counterclockwise polygon.
function inCone(p1: Vec2, p2: Vec2, p3: Vec2, p: Vec2): boolean {
  const convex = isConvex(p1, p2, p3);
  if (convex) {
    return isConvex(p1, p2, p) && isConvex(p2, p3, p);
  } else {
    return isConvex(p1, p2, p) || isConvex(p2, p3, p);
  }
}

// Check if two lines intersect.
function intersects(p11: Vec2, p12: Vec2, p21: Vec2, p22: Vec2) {
  if (p11.eq(p21) || p11.eq(p22) || p12.eq(p21) || p12.eq(p22)) {
    return false;
  }
  const v1ortX = p12.y - p11.y;
  const v1ortY = p11.x - p12.x;
  const v2ortX = p22.y - p21.y;
  const v2ortY = p21.x - p22.x;

  const v21X = p21.x - p11.x;
  const v21Y = p21.y - p11.y;
  const dot21 = v21X * v1ortX + v21Y * v1ortY;
  const v22X = p22.x - p11.x;
  const v22Y = p22.y - p11.y;
  const dot22 = v22X * v1ortX + v22Y * v1ortY;

  const v11X = p11.x - p21.x;
  const v11Y = p11.y - p21.y;
  const dot11 = v11X * v2ortX + v11Y * v2ortY;
  const v12X = p12.x - p21.x;
  const v12Y = p12.y - p21.y;
  const dot12 = v12X * v2ortX + v12Y * v2ortY;

  return !(dot11 * dot12 > 0 || dot21 * dot22 > 0);
}

export function isClockwise(polygon: Vec2[]) {
  let sum = 0;
  for (let i = 0, len = polygon.length; i < len; ++i) {
    const p1 = polygon[i];
    const p2 = polygon[(i + 1) % len];
    sum += (p2.x - p1.x) * (p2.y + p1.y);
  }
  return sum > 0;
}

/**
 * Removes holes from polygon by merging them with non-hole.
 */
export function removeHoles(
  polygon: Vec2[],
  holes: Vec2[][],
  doNotCheckOrdering: boolean = false
): Vec2[] {
  if (!doNotCheckOrdering) {
    if (isClockwise(polygon)) {
      throw new Error("Polygon should be counterclockwise");
    }
    holes.forEach((hole) => {
      if (!isClockwise(hole)) {
        throw new Error("Hole should be clockwise");
      }
    });
  }

  holes = holes.slice();

  while (holes.length) {
    // find the hole point with the largest x
    let holeIndex = -1;
    let holePointIndex = -1;
    let holeLargestX = -Infinity;
    for (let i = 0, holesLen = holes.length; i < holesLen; ++i) {
      const hole = holes[i];
      for (let j = 0, holeLen = hole.length; j < holeLen; ++j) {
        const point = hole[j];
        const x = point.x;
        if (x > holeLargestX) {
          holeLargestX = x;
          holeIndex = i;
          holePointIndex = j;
        }
      }
    }

    // find the farthest polygon vertex on X axis, without polyPoint-holePoint intersects with any edge
    const holePoint = holes[holeIndex][holePointIndex];
    const polyLen = polygon.length;
    let polyPointIndex = -1;
    for (let i = 0; i < polyLen; ++i) {
      const p1 = polygon[(i + polyLen - 1) % polyLen];
      const p2 = polygon[i];
      const p3 = polygon[(i + 1) % polyLen];
      if (!inCone(p1, p2, p3, holePoint)) {
        continue;
      }

      const polyPoint = p2;
      if (polyPointIndex >= 0) {
        const bestPoint = polygon[polyPointIndex];
        const v1x = polyPoint.x - holePoint.x;
        const v1y = polyPoint.y - holePoint.y;
        const v1Len = Math.sqrt(v1x * v1x + v1y * v1y);
        const v2x = bestPoint.x - holePoint.x;
        const v2y = bestPoint.y - holePoint.y;
        const v2Len = Math.sqrt(v2x * v2x + v2y * v2y);
        if (v2x / v2Len > v1x / v1Len) {
          continue;
        }
      }

      let pointVisible = true;
      for (let j = 0; j < polyLen; ++j) {
        const lineP1 = polygon[j];
        const lineP2 = polygon[(j + 1) % polyLen];
        if (intersects(holePoint, polyPoint, lineP1, lineP2)) {
          pointVisible = false;
          break;
        }
      }
      if (pointVisible) {
        polyPointIndex = i;
      }
    }

    if (polyPointIndex < 0) {
      throw new Error(
        "Failed to find cutting point. There may be self-intersection in the polygon."
      );
    }

    const newPoly: Vec2[] = [];
    for (let i = 0; i <= polyPointIndex; ++i) {
      newPoly.push(polygon[i]);
    }
    const hole = holes[holeIndex];
    for (let i = 0, len = hole.length; i <= len; ++i) {
      newPoly.push(hole[(i + holePointIndex) % len]);
    }
    for (let i = polyPointIndex; i < polyLen; ++i) {
      newPoly.push(polygon[i]);
    }

    polygon = newPoly;
    holes.splice(holeIndex, 1);
  }

  return polygon;
}

type PartitionVertex = {
  isActive: boolean;
  isConvex: boolean;
  isEar: boolean;
  point: Vec2;
  angleCos: number;
  prev?: PartitionVertex;
  next?: PartitionVertex;
  index: number;
  shouldUpdate: boolean;
};

function updateVertex(vertex: PartitionVertex, vertices: PartitionVertex[]) {
  if (!vertex.shouldUpdate) {
    return;
  }
  vertex.shouldUpdate = false;

  const v1 = vertex.prev!.point;
  const v2 = vertex.point;
  const v3 = vertex.next!.point;

  vertex.isConvex = isConvex(v1, v2, v3);

  let v1x = v1.x - v2.x;
  let v1y = v1.y - v2.y;
  const v1Len = Math.sqrt(v1x * v1x + v1y * v1y);
  v1x /= v1Len;
  v1y /= v1Len;
  let v3x = v3.x - v2.x;
  let v3y = v3.y - v2.y;
  const v3Len = Math.sqrt(v3x * v3x + v3y * v3y);
  v3x /= v3Len;
  v3y /= v3Len;
  vertex.angleCos = v1x * v3x + v1y * v3y;

  if (vertex.isConvex) {
    vertex.isEar = true;
    for (let i = 0, len = vertices.length; i < len; ++i) {
      const curr = vertices[i];
      if (!curr.isActive || curr === vertex) {
        continue;
      }
      if (v1.eq(curr.point) || v2.eq(curr.point) || v3.eq(curr.point)) {
        continue;
      }
      const areaA = area(v1, curr.point, v2);
      const areaB = area(v2, curr.point, v3);
      const areaC = area(v3, curr.point, v1);
      if (areaA > 0 && areaB > 0 && areaC > 0) {
        vertex.isEar = false;
        break;
      }
      if (areaA === 0 && areaB >= 0 && areaC >= 0) {
        if (
          area(v1, curr.prev!.point, v2) > 0 ||
          area(v1, curr.next!.point, v2) > 0
        ) {
          vertex.isEar = false;
          break;
        }
      }
      if (areaB === 0 && areaA >= 0 && areaC >= 0) {
        if (
          area(v2, curr.prev!.point, v3) > 0 ||
          area(v2, curr.next!.point, v3) > 0
        ) {
          vertex.isEar = false;
          break;
        }
      }
      if (areaC === 0 && areaA >= 0 && areaB >= 0) {
        if (
          area(v3, curr.prev!.point, v1) > 0 ||
          area(v3, curr.next!.point, v1) > 0
        ) {
          vertex.isEar = false;
          break;
        }
      }
    }
  } else {
    vertex.isEar = false;
  }
}

function removeCollinearOrDuplicate(start: PartitionVertex) {
  for (let curr = start, end = start; ; ) {
    if (
      curr.point.eq(curr.next!.point) ||
      area(curr.prev!.point, curr.point, curr.next!.point) === 0
    ) {
      curr.prev!.next = curr.next;
      curr.next!.prev = curr.prev;
      curr.prev!.shouldUpdate = true;
      curr.next!.shouldUpdate = true;
      if (curr === curr.next!) {
        break;
      }
      end = curr.prev!;
      curr = curr.next!;
      continue;
    }
    curr = curr.next!;
    if (curr === end) {
      break;
    }
  }
}

/**
 * Triangulation by ear clipping.
 */
export function triangulate(
  polygon: Vec2[],
  doNotCheckOrdering: boolean = false
): Vec2[][] {
  if (!doNotCheckOrdering) {
    if (isClockwise(polygon)) {
      throw new Error("Polygon should be counterclockwise");
    }
  }

  if (polygon.length < 4) {
    return [polygon];
  }

  const len = polygon.length;
  const vertices: PartitionVertex[] = [];
  const triangles: Vec2[][] = [];

  // init
  for (let i = 0; i < len; ++i) {
    vertices.push({
      isActive: true,
      isConvex: false,
      isEar: false,
      point: polygon[i],
      angleCos: 0,
      shouldUpdate: true,
      index: i,
    });
  }
  for (let i = 0; i < len; ++i) {
    const vertex = vertices[i];
    vertex.prev = vertices[(i + len - 1) % len];
    vertex.next = vertices[(i + 1) % len];
  }

  vertices.forEach((vertex) => updateVertex(vertex, vertices));

  for (let i = 0; i < len - 3; ++i) {
    let ear: PartitionVertex | null = null;

    // find the most extruded ear
    for (let j = 0; j < len; ++j) {
      const vertex = vertices[j];
      if (!vertex.isActive || !vertex.isEar) {
        continue;
      }
      if (!ear) {
        ear = vertex;
      } else if (vertex.angleCos > ear.angleCos) {
        ear = vertex;
      }
    }

    if (!ear) {
      for (let i = 0; i < len; ++i) {
        const vertex = vertices[i];
        if (vertex.isActive) {
          const p1 = vertex.prev!.point;
          const p2 = vertex.point;
          const p3 = vertex.next!.point;
          if (Math.abs(area(p1, p2, p3)) > 1e-5) {
            throw new Error(
              "Failed to find ear. There may be self-intersection in the polygon."
            );
          }
        }
      }
      break;
    }

    triangles.push([ear.prev!.point, ear.point, ear.next!.point]);

    ear.isActive = false;
    ear.prev!.next = ear.next;
    ear.next!.prev = ear.prev;
    ear.prev!.shouldUpdate = true;
    ear.next!.shouldUpdate = true;
    removeCollinearOrDuplicate(ear.next!);

    if (i === len - 4) {
      break;
    }

    for (let i = 0; i < len; ++i) {
      updateVertex(vertices[i], vertices);
    }
  }

  for (let i = 0; i < len; ++i) {
    const vertex = vertices[i];
    if (vertex.isActive) {
      vertex.prev!.isActive = false;
      vertex.next!.isActive = false;
      const p1 = vertex.prev!.point;
      const p2 = vertex.point;
      const p3 = vertex.next!.point;
      if (Math.abs(area(p1, p2, p3)) > 1e-5) {
        triangles.push([p1, p2, p3]);
      }
    }
  }

  return triangles;
}

/**
 * Convex partition using Hertel-Mehlhorn algorithm.
 */
export function convexPartition(
  polygon: Vec2[],
  doNotCheckOrdering: boolean = false
) {
  //check if the poly is already convex
  let convex = true;
  for (let i = 0, len = polygon.length; i < len; ++i) {
    if (
      !isConvex(
        polygon[(i + len - 1) % len],
        polygon[i],
        polygon[(i + 1) % len]
      )
    ) {
      convex = false;
      break;
    }
  }
  if (convex) {
    return [polygon];
  }

  const ret: Vec2[][] = [];

  const triangles = triangulate(polygon, doNotCheckOrdering);

  for (; triangles.length; ) {
    let poly = triangles.splice(0, 1)[0];

    for (let iPoly = 0, polyLen = poly.length; iPoly < polyLen; ++iPoly) {
      const diag1 = poly[iPoly];
      const diag2 = poly[(iPoly + 1) % polyLen];

      // find diagonal
      let tri3: Vec2 | null = null;
      let iTri2 = 0;
      for (; iTri2 < triangles.length; ++iTri2) {
        const triangle = triangles[iTri2];
        for (let i = 0; i < 3; ++i) {
          const tri1 = triangle[i];
          const tri2 = triangle[(i + 1) % 3];
          if (diag1.eq(tri2) && diag2.eq(tri1)) {
            tri3 = triangle[(i + 2) % 3];
            break;
          }
        }
        if (tri3) {
          break;
        }
      }
      if (!tri3) {
        // not a diagonal
        continue;
      }
      if (area(poly[(iPoly + polyLen - 1) % polyLen], diag1, tri3) > 0) {
        // neither convex nor on the same line
        continue;
      }
      if (area(tri3, diag2, poly[(iPoly + 2) % polyLen]) > 0) {
        continue;
      }

      // merge triangle
      const newPoly: Vec2[] = [];
      for (let i = (iPoly + 1) % polyLen; i != iPoly; i = (i + 1) % polyLen) {
        newPoly.push(poly[i]);
      }
      newPoly.push(diag1, tri3);

      poly = newPoly;
      polyLen = newPoly.length;
      iPoly = -1;

      triangles.splice(iTri2, 1);
    }

    ret.push(poly);
  }

  return ret;
}

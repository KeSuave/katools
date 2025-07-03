/*
The following has been modified from https://github.com/x6ud/tilemap-to-convexes

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
import { convexPartition, removeHoles } from "./polyPartitions";

import type { Vec2 } from "kaplay";

type Edge = [Vec2, Vec2];
type Edges = Edge[];
type Contour = Vec2[];
type Polygon = Contour[];

function area(a: Vec2, b: Vec2, c: Vec2) {
  return (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y);
}

function vectorsAngle(v1: Vec2, v2: Vec2): number {
  let angle = Math.atan2(v2.y, v2.x) - Math.atan2(v1.y, v1.x);
  if (angle < 0) {
    angle += Math.PI * 2;
  }
  return angle;
}

export default class MergePolygons {
  private polygons: Edges[] = [];

  addPolygon(...vertices: Vec2[]) {
    const edges: Edge[] = [];
    for (let i = 0, len = vertices.length; i < len; ++i) {
      const p0 = vertices[i];
      const p1 = vertices[(i + 1) % len];
      edges.push([p0.clone(), p1.clone()]);
    }
    this.polygons.push(edges);
  }

  getMergedPolygons(): Polygon[] {
    type WrappedEdge = {
      edge: Edge;
      polygon: number;
    };

    type EdgesMap = Map<string, Map<string, WrappedEdge>>;

    function hash(point: Vec2) {
      return point.x + "," + point.y;
    }

    let edgesMap: EdgesMap = new Map();
    const polyEdgesMap: Map<number, WrappedEdge[]> = new Map();

    function addEdge(edge: WrappedEdge) {
      const p1 = hash(edge.edge[0]);

      let p1Edges: Map<string, WrappedEdge>;
      if (edgesMap.has(p1)) {
        p1Edges = edgesMap.get(p1)!;
      } else {
        p1Edges = new Map();
        edgesMap.set(p1, p1Edges);
      }
      p1Edges.set(hash(edge.edge[1]), edge);
      let polyEdges = polyEdgesMap.get(edge.polygon);
      if (!polyEdges) {
        polyEdges = [];
        polyEdgesMap.set(edge.polygon, polyEdges);
      }
      polyEdges.push(edge);
    }

    function removeEdge(edge: WrappedEdge) {
      removeEdgeFromMap(edgesMap, edge);
      const polyEdges = polyEdgesMap.get(edge.polygon);
      if (polyEdges) {
        const index = polyEdges.indexOf(edge);
        if (index >= 0) {
          polyEdges.splice(index, 1);
        }
      }
    }

    function removeEdgeFromMap(map: EdgesMap, edge: WrappedEdge) {
      const p1Hash = hash(edge.edge[0]);
      const p1Edges: Map<string, WrappedEdge> | undefined = map.get(p1Hash);
      if (p1Edges) {
        const p2Hash = hash(edge.edge[1]);
        p1Edges.delete(p2Hash);
      }
    }

    function getEdge(p1: Vec2, p2: Vec2): WrappedEdge | undefined {
      const p1Hash = hash(p1);
      const p1Edges = edgesMap.get(p1Hash);
      if (p1Edges) {
        const p2Hash = hash(p2);
        return p1Edges.get(p2Hash);
      }
    }

    function takeOne(from: EdgesMap, to?: EdgesMap): WrappedEdge | undefined {
      for (
        let iter = from.entries(), next = iter.next();
        !next.done;
        next = iter.next()
      ) {
        if (!next.value) {
          continue;
        }
        const p1Edges: Map<string, WrappedEdge> = next.value[1];
        for (
          let iter = p1Edges.entries(), next = iter.next();
          !next.done;
          next = iter.next()
        ) {
          if (!next.value) {
            continue;
          }
          p1Edges.delete(next.value[0]);
          const edge: WrappedEdge = next.value[1];
          if (to) {
            const p1 = hash(edge.edge[0]);
            const p2 = hash(edge.edge[1]);
            let toP1Edges = to.get(p1);
            if (!toP1Edges) {
              toP1Edges = new Map();
              to.set(p1, toP1Edges);
            }
            toP1Edges.set(p2, edge);
          }
          return edge;
        }
      }
    }

    function mergePolygons(target: number, merged: number) {
      const targetEdges = polyEdgesMap.get(target);
      const mergedEdges = polyEdgesMap.get(merged);
      if (mergedEdges) {
        mergedEdges.forEach((edge) => (edge.polygon = target));
        if (targetEdges) {
          targetEdges.push(...mergedEdges);
        }
        polyEdgesMap.delete(merged);
      }
    }

    // init
    for (
      let polyIndex = 0, polyNum = this.polygons.length;
      polyIndex < polyNum;
      ++polyIndex
    ) {
      const poly = this.polygons[polyIndex];
      for (let i = 0, len = poly.length; i < len; ++i) {
        const edge: WrappedEdge = {
          edge: poly[i],
          polygon: polyIndex,
        };
        addEdge(edge);
      }
    }

    // remove shared edges
    let visitedMap: EdgesMap = new Map();
    for (
      let edge = takeOne(edgesMap, visitedMap);
      edge;
      edge = takeOne(edgesMap, visitedMap)
    ) {
      const reverse = getEdge(edge.edge[1], edge.edge[0]);
      if (reverse) {
        removeEdge(edge);
        removeEdge(reverse);
        if (edge.polygon !== reverse.polygon) {
          mergePolygons(edge.polygon, reverse.polygon);
        }
        removeEdgeFromMap(visitedMap, edge);
        removeEdgeFromMap(visitedMap, reverse);
      }
    }

    // merge collinear edges
    edgesMap = visitedMap;
    visitedMap = new Map();
    for (
      let edge = takeOne(edgesMap, visitedMap);
      edge;
      edge = takeOne(edgesMap, visitedMap)
    ) {
      if (edge.polygon < 0) {
        continue;
      }

      const p1 = hash(edge.edge[1]);
      let nextEdge: WrappedEdge | undefined = undefined;
      let nextEdgesMap: Map<string, WrappedEdge> | undefined = undefined;
      let count = 0;
      [edgesMap, visitedMap].forEach((map) => {
        nextEdgesMap = map.get(p1);
        if (nextEdgesMap) {
          const iter = nextEdgesMap.values();
          for (let next = iter.next(); !next.done; next = iter.next()) {
            nextEdge = next.value;
            count += 1;
          }
        }
      });

      if (!nextEdge || count > 1) {
        continue;
      }

      // @ts-expect-error
      if (area(edge.edge[0], edge.edge[1], nextEdge!.edge[1]) === 0) {
        removeEdge(edge);
        removeEdge(nextEdge);
        // @ts-expect-error
        if (edge.polygon !== nextEdge!.polygon) {
          throw new Error("Found invalid edge");
        }
        addEdge({
          // @ts-expect-error
          edge: [edge.edge[0], nextEdge!.edge[1]],
          polygon: edge.polygon,
        });
        removeEdgeFromMap(visitedMap, edge);
        removeEdgeFromMap(visitedMap, nextEdge);
      }
    }

    // merge into rings
    edgesMap = visitedMap;
    const polygons: Map<number, Polygon> = new Map();
    const holes: Map<number, Contour[]> = new Map();
    for (let curr = takeOne(edgesMap); curr; curr = takeOne(edgesMap)) {
      const contour: Contour = [];
      const start = curr;
      const polyId = curr.polygon;
      let angleSum = 0;
      contour.push(curr.edge[0]);

      for (;;) {
        const nextEdgesMap = edgesMap.get(hash(curr.edge[1]));
        if (!nextEdgesMap) {
          throw new Error("Failed to find closed ring");
        }
        const candidates = Array.from(nextEdgesMap.values()).filter(
          (edge) => edge.polygon === polyId
        );
        if (!candidates.length) {
          throw new Error("Failed to find closed ring");
        }
        let next = candidates[0];
        let minAngle = Infinity;
        for (let i = 0, len = candidates.length; i < len; ++i) {
          const candidate = candidates[i];
          const v1 = next.edge[1].sub(next.edge[0]);
          const v2 = curr.edge[0].sub(curr.edge[1]);
          const angle = vectorsAngle(v1, v2);
          if (angle < minAngle) {
            next = candidate;
            minAngle = angle;
          }
        }
        contour.push(next.edge[0]);
        curr = next;
        angleSum += minAngle;
        removeEdgeFromMap(edgesMap, next);
        if (next.edge[1].eq(start.edge[0])) {
          break;
        }
      }

      const isHole = angleSum - (contour.length - 2) * Math.PI > Math.PI * 1e-4;
      if (isHole) {
        let polyHoles = holes.get(polyId);
        if (!polyHoles) {
          polyHoles = [];
          holes.set(polyId, polyHoles);
        }
        polyHoles.push(contour);
      } else {
        if (polygons.has(polyId)) {
          throw new Error("Polygon ID is duplicated");
        }
        let poly: Contour[] = [contour];
        polygons.set(polyId, poly);
      }
    }

    for (
      let iter = holes.entries(), next = iter.next();
      !next.done;
      next = iter.next()
    ) {
      const polyId = next.value[0];
      const polyHoles = next.value[1];
      const poly = polygons.get(polyId);
      if (!poly) {
        throw new Error("Failed to find outer contour for holes");
      }
      poly.push(...polyHoles);
    }

    return Array.from(polygons.values());
  }

  getConvexes() {
    const polygons = this.getMergedPolygons();
    const ret: Contour[] = [];
    polygons.forEach((polygon) => {
      const merged = removeHoles(polygon[0], polygon.slice(1));
      const convexes = convexPartition(merged);
      ret.push(...convexes);
    });

    return ret;
  }
}

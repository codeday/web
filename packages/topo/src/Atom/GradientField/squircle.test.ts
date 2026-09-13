import { describe, expect, it } from "vitest";

import { generateSquircleMask, generateSquirclePath } from "./squircle";

function parsePoints(d: string): Array<[number, number]> {
  const matches = d.matchAll(/([ML])(-?[\d.]+),(-?[\d.]+)/g);
  return Array.from(matches, (m) => [Number(m[2]), Number(m[3])]);
}

describe("generateSquirclePath", () => {
  it("starts with M and closes with Z", () => {
    const d = generateSquirclePath(120, 120);
    expect(d.startsWith("M")).toBe(true);
    expect(d.trim().endsWith("Z")).toBe(true);
  });

  it("keeps every point inside the box bounds (no distortion/overflow)", () => {
    const width = 240;
    const height = 90;
    const d = generateSquirclePath(width, height);
    for (const [x, y] of parsePoints(d)) {
      expect(x).toBeGreaterThanOrEqual(-0.01);
      expect(x).toBeLessThanOrEqual(width + 0.01);
      expect(y).toBeGreaterThanOrEqual(-0.01);
      expect(y).toBeLessThanOrEqual(height + 0.01);
    }
  });

  it("holds the corner size constant in absolute terms on a non-square box (.spec.md §4.8)", () => {
    // Corner size = 32% of the shorter dimension. On a 200x100 box that's
    // 32 — the tangent point on the long (top) edge should sit 32px in from
    // the corner, not stretched to a fraction of the long edge.
    const width = 200;
    const height = 100;
    const r = 0.32 * Math.min(width, height);
    const d = generateSquirclePath(width, height);
    const points = parsePoints(d);
    const firstPoint = points[0];
    expect(firstPoint[0]).toBeCloseTo(r, 1);
    expect(firstPoint[1]).toBeCloseTo(0, 1);
  });

  it("produces a symmetric shape on a square box", () => {
    const size = 100;
    const d = generateSquirclePath(size, size);
    const points = parsePoints(d);
    const cx = size / 2;
    const cy = size / 2;
    // Every point's mirror across the box's diagonal center should also
    // (approximately) appear among the sampled points, since a square
    // superellipse rounded-rect is 4-fold symmetric.
    const hasNear = (x: number, y: number) =>
      points.some(([px, py]) => Math.abs(px - x) < 1 && Math.abs(py - y) < 1);
    for (const [x, y] of points) {
      expect(hasNear(2 * cx - x, 2 * cy - y)).toBe(true);
    }
  });
});

describe("generateSquircleMask", () => {
  it("uses a viewBox matching the box's own aspect ratio, not a stretched 1:1", () => {
    const uri = generateSquircleMask(300, 120);
    const decoded = decodeURIComponent(uri.replace("data:image/svg+xml,", ""));
    expect(decoded).toContain("viewBox='0 0 300 120'");
    expect(decoded).toContain(`preserveAspectRatio='none'`);
  });

  it("returns a usable data URI", () => {
    const uri = generateSquircleMask(64, 64);
    expect(uri.startsWith("data:image/svg+xml,")).toBe(true);
  });
});

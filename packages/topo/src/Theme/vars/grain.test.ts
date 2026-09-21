import { describe, expect, it } from "vitest";

import { generateGrainField } from "./grain";

// A modest patch is plenty here — there's no spatial-period calibration to
// resolve precisely anymore, just basic sanity checks on a simple generator.
const WIDTH = 400;
const HEIGHT = 400;

const field = generateGrainField(WIDTH, HEIGHT, "grain-fixture");

function meanAndStd(values: Float32Array): { mean: number; std: number } {
  let sum = 0;
  for (let i = 0; i < values.length; i += 1) sum += values[i];
  const mean = sum / values.length;
  let sumSq = 0;
  for (let i = 0; i < values.length; i += 1) sumSq += (values[i] - mean) ** 2;
  return { mean, std: Math.sqrt(sumSq / values.length) };
}

function lag1Autocorrelation(
  values: Float32Array,
  width: number,
  height: number,
  mean: number,
): number {
  let num = 0;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width - 1; x += 1) {
      num += (values[y * width + x] - mean) * (values[y * width + x + 1] - mean);
    }
  }
  let den = 0;
  for (let i = 0; i < values.length; i += 1) den += (values[i] - mean) ** 2;
  return num / (height * (width - 1)) / (den / values.length);
}

describe("generateGrainField", () => {
  it("is centred near the configured mean (128)", () => {
    const { mean } = meanAndStd(field);
    expect(mean).toBeGreaterThanOrEqual(120);
    expect(mean).toBeLessThanOrEqual(136);
  });

  it("has real variance — not degenerate/flat", () => {
    const { std } = meanAndStd(field);
    expect(std).toBeGreaterThan(15);
  });

  it("the bicubic upscale meaningfully reduces variance relative to the raw source sigma (34) — confirms it's not generating at full resolution directly", () => {
    const { std } = meanAndStd(field);
    expect(std).toBeLessThan(32);
  });

  it("neighbouring pixels are strongly positively correlated — the upscale, not independent per-pixel noise, is what sets the grain size", () => {
    const { mean } = meanAndStd(field);
    const autocorr = lag1Autocorrelation(field, WIDTH, HEIGHT, mean);
    expect(autocorr).toBeGreaterThan(0.5);
  });

  it("is deterministic for a given seed", () => {
    const again = generateGrainField(WIDTH, HEIGHT, "grain-fixture");
    expect(Array.from(again)).toEqual(Array.from(field));
  });

  it("a different seed produces a different field", () => {
    const other = generateGrainField(WIDTH, HEIGHT, "a-different-seed");
    expect(Array.from(other)).not.toEqual(Array.from(field));
  });
});

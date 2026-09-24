import { create as createRandom } from "random-seed";
import React, { useCallback, useEffect, useRef, useState } from "react";

const MEAN = 128;
const SIGMA = 34;

const DOWNSCALE = 2.2;

export const OVERLAY_OPACITY = 0.38;

function gaussian(random: () => number): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = random();
  while (v === 0) v = random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function generateSource(width: number, height: number, random: () => number): Float32Array {
  const count = width * height;
  const out = new Float32Array(count);
  for (let i = 0; i < count; i += 1) out[i] = MEAN + gaussian(random) * SIGMA;
  return out;
}

function cubicWeight(x: number): number {
  const a = -0.5;
  const ax = Math.abs(x);
  if (ax <= 1) return (a + 2) * ax ** 3 - (a + 3) * ax ** 2 + 1;
  if (ax < 2) return a * ax ** 3 - 5 * a * ax ** 2 + 8 * a * ax - 4 * a;
  return 0;
}

function sampleClamped(
  src: Float32Array,
  width: number,
  height: number,
  x: number,
  y: number,
): number {
  const cx = Math.min(width - 1, Math.max(0, x));
  const cy = Math.min(height - 1, Math.max(0, y));
  return src[cy * width + cx];
}

function bicubicUpscale(
  src: Float32Array,
  srcWidth: number,
  srcHeight: number,
  dstWidth: number,
  dstHeight: number,
): Float32Array {
  const out = new Float32Array(dstWidth * dstHeight);
  const scaleX = srcWidth / dstWidth;
  const scaleY = srcHeight / dstHeight;

  for (let dy = 0; dy < dstHeight; dy += 1) {
    const sy = (dy + 0.5) * scaleY - 0.5;
    const sy0 = Math.floor(sy);
    const fy = sy - sy0;
    const wy = [cubicWeight(fy + 1), cubicWeight(fy), cubicWeight(fy - 1), cubicWeight(fy - 2)];

    for (let dx = 0; dx < dstWidth; dx += 1) {
      const sx = (dx + 0.5) * scaleX - 0.5;
      const sx0 = Math.floor(sx);
      const fx = sx - sx0;
      const wx = [cubicWeight(fx + 1), cubicWeight(fx), cubicWeight(fx - 1), cubicWeight(fx - 2)];

      let value = 0;
      for (let j = -1; j <= 2; j += 1) {
        let rowValue = 0;
        for (let i = -1; i <= 2; i += 1) {
          rowValue += sampleClamped(src, srcWidth, srcHeight, sx0 + i, sy0 + j) * wx[i + 1];
        }
        value += rowValue * wy[j + 1];
      }
      out[dy * dstWidth + dx] = value;
    }
  }
  return out;
}

export function generateGrainField(width: number, height: number, seed: string): Float32Array {
  const generator = createRandom(seed);
  const random = () => generator.random();
  const srcWidth = Math.max(1, Math.round(width / DOWNSCALE));
  const srcHeight = Math.max(1, Math.round(height / DOWNSCALE));
  const source = generateSource(srcWidth, srcHeight, random);
  return bicubicUpscale(source, srcWidth, srcHeight, width, height);
}

function clampByte(v: number): number {
  return Math.min(255, Math.max(0, Math.round(v)));
}

function writeGrainFieldPixels(
  data: Uint8ClampedArray,
  field: Float32Array,
  width: number,
  height: number,
): void {
  const count = width * height;
  for (let i = 0; i < count; i += 1) {
    const value = clampByte(field[i]);
    data[i * 4] = value;
    data[i * 4 + 1] = value;
    data[i * 4 + 2] = value;
    data[i * 4 + 3] = 255;
  }
}

export function renderGrainFieldToCanvas(
  field: Float32Array,
  width: number,
  height: number,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;
  const imageData = ctx.createImageData(width, height);
  writeGrainFieldPixels(imageData.data, field, width, height);
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

export interface GrainOverlay {
  containerRef: (node: HTMLElement | null) => void;
  canvas: React.ReactNode;
}

function devicePixelRatio(): number {
  return typeof window === "undefined" ? 1 : Math.min(2, window.devicePixelRatio || 1);
}

export function useGrainOverlay(seed: string, opacity: number = OVERLAY_OPACITY): GrainOverlay {
  const elRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);

  const containerRef = useCallback((node: HTMLElement | null) => {
    elRef.current = node;
  }, []);

  useEffect(() => {
    const el = elRef.current;
    if (!el || typeof ResizeObserver === "undefined") return undefined;
    const observer = new ResizeObserver(([entry]) => {
      // `entry.contentRect` is the CONTENT box (padding excluded) — but the
      // canvas itself is `position: absolute; inset: 0`, which fills the
      // BORDER box (the full visual box, padding included). On anything
      // with padding, those two disagree, and the canvas ends up generated
      // at the wrong (smaller) size, then CSS-stretched non-uniformly to
      // fill the real box — the more padding-heavy the box is relative to
      // its own size, the worse the stretch (barely visible on a large
      // square Wash, badly visible on a short, padded Alert/
      // Header, where vertical padding alone can be half the box's
      // height). `borderBoxSize` is the correct measurement; fall back to
      // `getBoundingClientRect` for the rare environment without it.
      const borderBox = entry.borderBoxSize?.[0];
      const width = borderBox ? borderBox.inlineSize : el.getBoundingClientRect().width;
      const height = borderBox ? borderBox.blockSize : el.getBoundingClientRect().height;
      if (width > 0 && height > 0)
        setSize({ width: Math.round(width), height: Math.round(height) });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const dpr = devicePixelRatio();
  const deviceWidth = size ? Math.max(1, Math.round(size.width * dpr)) : null;
  const deviceHeight = size ? Math.max(1, Math.round(size.height * dpr)) : null;

  useEffect(() => {
    if (!deviceWidth || !deviceHeight) return;
    const canvasEl = canvasRef.current;
    const ctx = canvasEl?.getContext("2d");
    if (!ctx) return;

    const srcWidth = Math.max(1, Math.round(deviceWidth / DOWNSCALE));
    const srcHeight = Math.max(1, Math.round(deviceHeight / DOWNSCALE));
    const generator = createRandom(seed);
    const source = generateSource(srcWidth, srcHeight, () => generator.random());

    const srcCanvas = document.createElement("canvas");
    srcCanvas.width = srcWidth;
    srcCanvas.height = srcHeight;
    const srcCtx = srcCanvas.getContext("2d");
    if (!srcCtx) return;
    const srcImageData = srcCtx.createImageData(srcWidth, srcHeight);
    writeGrainFieldPixels(srcImageData.data, source, srcWidth, srcHeight);
    srcCtx.putImageData(srcImageData, 0, 0);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.clearRect(0, 0, deviceWidth, deviceHeight);
    ctx.drawImage(srcCanvas, 0, 0, srcWidth, srcHeight, 0, 0, deviceWidth, deviceHeight);
  }, [deviceWidth, deviceHeight, seed]);

  if (!deviceWidth || !deviceHeight) return { containerRef, canvas: null };

  return {
    containerRef,
    canvas: (
      <canvas
        ref={canvasRef}
        width={deviceWidth}
        height={deviceHeight}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          mixBlendMode: "overlay",
          opacity,
          pointerEvents: "none",
        }}
      />
    ),
  };
}

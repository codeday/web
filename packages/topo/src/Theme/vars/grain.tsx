import { create as createRandom } from "random-seed";
import React, { useCallback, useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// Grain — deliberately simple, replacing a
// coloured/heavy-tailed/autoregressive-band-pass generator that went through
// several rounds of recalibration without landing on the intended look:
//
//   1. generate a small monochrome Gaussian source — mean 128, sigma 34, at
//      1/`DOWNSCALE` the target's own resolution;
//   2. bicubic-upscale that source back up to the full target size — this
//      is what gives the field its spatial correlation/"grain size"; there
//      is no separate band-pass, tail-stretch, or per-channel colour mixing;
//   3. composite the result via `mix-blend-mode: overlay` at a fixed CSS
//      `opacity` (not baked into the pixel values the way earlier versions
//      baked in an amplitude).
//
// All the numeric work in `generateGrainField` is plain typed-array math
// with no DOM/Canvas dependency, so it runs identically under Node (this
// file's own test) and in the browser. Only the raster-encoding step needs
// a real `document`.
// ---------------------------------------------------------------------------

const MEAN = 128;
const SIGMA = 34;

/** The source is generated at 1/this fraction of the target's own resolution, then bicubic-upscaled back up — the upscale is what produces the grain's spatial size, not a separate blur/filter stage. */
const DOWNSCALE = 2.2;

/** CSS `opacity` for the `mix-blend-mode: overlay` composite (see `useGrainOverlay`) — a compositing-time constant, not baked into the generated field. */
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

// ---------------------------------------------------------------------------
// Bicubic upscale — a standard separable cubic convolution (Catmull-Rom,
// a=-0.5). Deliberately the ONLY thing that sets the grain's spatial size:
// there's no band-pass or blur beyond what this resampling itself does.
// ---------------------------------------------------------------------------

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

/**
 * Generate the grain field at `width`x`height` (monochrome — one value per
 * pixel, not per channel) — a small Gaussian source bicubic-upscaled to
 * full size. Pure typed-array math, no DOM/Canvas dependency, so this runs
 * identically under Node and in the browser (see grain.test.ts).
 */
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

/** Write a generated (monochrome) field into an existing ImageData buffer — same value in R, G, and B. */
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

/**
 * Encode a generated field as a standalone grey canvas — for a consumer
 * that wants a real `<canvas>`/raster directly (e.g. a slide-bake pipeline)
 * rather than the `useGrainOverlay` hook below. Browser only (needs a real
 * `document`). Composite it the same way `useGrainOverlay` does: `mix-
 * blend-mode: overlay` at some opacity — `OVERLAY_OPACITY` for parity with
 * the web default, or a different value if the context calls for it.
 */
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
  /** Attach to the element the grain should track the size of (measured via ResizeObserver). */
  containerRef: (node: HTMLElement | null) => void;
  /** Render as a child of that same element — absolutely positioned, sized to fill it, already blended. `null` until measured (SSR / first paint), so nothing renders until there's a real size to draw at. */
  canvas: React.ReactNode;
}

/**
 * Capped at 2x even on 3x-DPR devices (most iPhones): the grain is a
 * subtle texture, not content, so it doesn't need to be pixel-perfect at
 * 3x, and the cap alone cuts the backing-store pixel count — and so the
 * cost of everything below that scales with it — by ~2.25x on those
 * devices.
 */
function devicePixelRatio(): number {
  return typeof window === "undefined" ? 1 : Math.min(2, window.devicePixelRatio || 1);
}

/**
 * The grain overlay for a web consumer (Wash, Card, StatTile,
 * Badge, EmptyState, Modal) — painted directly onto a `<canvas>` sized to
 * the consuming element's own box, not cropped from one big shared image.
 * `seed` only needs to vary if two components of THE SAME size, right next
 * to each other, would otherwise show visibly identical noise — otherwise
 * leave it as a stable per-component-kind label.
 *
 * Unlike `generateGrainField` (used by the Node-safe test and the
 * standalone `renderGrainFieldToCanvas` baking path), this does NOT run
 * the hand-rolled JS bicubic upscale at full (DPR-scaled) resolution —
 * on a busy page with many grain-bearing components, doing that upscale
 * loop synchronously for each of them was the main source of the
 * paint-blocking jank on iOS. Instead it paints the small Gaussian
 * source onto a tiny offscreen canvas and lets the browser's own
 * (GPU-accelerated) `drawImage` scaling produce the upscale, which keeps
 * the expensive part off the main thread's JS budget entirely — the
 * source generation that IS still JS-side stays cheap because it only
 * ever runs over the small pre-upscale size.
 *
 * Regenerates on resize (ResizeObserver): the box's own current size is
 * always what gets rendered, never a stretched/squeezed asset. Renders
 * nothing on the server or the client's first paint (no size yet, and
 * canvas painting needs a real DOM anyway), so there's no hydration
 * mismatch — the canvas appears as a normal post-hydration update.
 */
export function useGrainOverlay(seed: string, opacity: number = OVERLAY_OPACITY): GrainOverlay {
  const elRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // CSS pixels (the box's own on-screen size) — the canvas's backing store
  // is sized up from this by devicePixelRatio below, not used directly.
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

  // Sizing the canvas's backing store to the box's CSS pixel size — the
  // natural thing to do — means on any HiDPI/Retina display (2x, 3x, all
  // common) the browser has to upscale that backing store to fill the
  // display area: every generated grain feature ends up covering multiple
  // physical screen pixels, reading as coarser AND softer (the browser's
  // default image smoothing on the upscale) than intended. Sizing the
  // backing store up by `devicePixelRatio` — the standard "retina canvas"
  // pattern — means each backing-store pixel maps 1:1 to a physical pixel.
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

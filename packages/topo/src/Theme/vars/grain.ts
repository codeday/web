import { create as createRandom } from "random-seed";
import { useCallback, useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// Grain (.spec.md §5) — a noise overlay used in `mix-blend-mode: overlay`.
// It carries no colour: the tile averages 128 grey, and overlay against 128
// grey is a no-op, so it adds texture without shifting the hue underneath.
//
// Generated as real Gaussian noise (Box-Muller transform), sigma=34,
// mean=128, clamped to 0-255 — not a Perlin/turbulence approximation — via
// the Canvas API so the sigma/mean stay visible in code rather than shipping
// a checked-in binary. Canvas only exists in the browser, so this is a
// progressive enhancement: SSR (and any render before hydration) gets a
// transparent 1x1 placeholder, matching the existing `_toaster` SSR-guard
// pattern in `../../utils.ts`.
// ---------------------------------------------------------------------------

const MEAN = 128;
const SIGMA = 34;

const TRANSPARENT_PIXEL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

function gaussian(random: () => number): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = random();
  while (v === 0) v = random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

const cache = new Map<string, string>();

/**
 * Generate a square grayscale noise tile as a data URI. `tileSize` is in
 * device pixels; `seed` keeps output deterministic across renders/reloads —
 * pass a distinct seed per logical use (web vs. slide scale) so tiles don't
 * visibly repeat when several appear on one page (.spec.md §5, "never tile a
 * coarse grain").
 */
export function generateGrainDataUri(tileSize: number, seed = "codeday-topo-grain"): string {
  const cacheKey = `${tileSize}:${seed}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  if (typeof document === "undefined") {
    return TRANSPARENT_PIXEL;
  }

  const canvas = document.createElement("canvas");
  canvas.width = tileSize;
  canvas.height = tileSize;
  const ctx = canvas.getContext("2d");
  if (!ctx) return TRANSPARENT_PIXEL;

  const imageData = ctx.createImageData(tileSize, tileSize);
  const random = createRandom(seed).random;
  for (let i = 0; i < imageData.data.length; i += 4) {
    const value = Math.min(255, Math.max(0, Math.round(MEAN + gaussian(random) * SIGMA)));
    imageData.data[i] = value;
    imageData.data[i + 1] = value;
    imageData.data[i + 2] = value;
    imageData.data[i + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);

  const uri = canvas.toDataURL("image/png");
  cache.set(cacheKey, uri);
  return uri;
}

/**
 * React hook form of `generateGrainDataUri`. Returns `undefined` on the
 * server and on the client's first render (so SSR and initial hydration
 * markup match exactly, avoiding a hydration-mismatch warning), then flips
 * to the real generated tile once mounted — the grain fades in as a normal
 * post-hydration update rather than a mismatch.
 */
export function useGrainDataUri(tileSize: number, seed?: string): string | undefined {
  const [uri, setUri] = useState<string | undefined>(undefined);
  useEffect(() => {
    setUri(generateGrainDataUri(tileSize, seed));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tileSize, seed]);
  return uri;
}

// Opacity + tile-size presets by context (.spec.md §5).
export const grainPresets = {
  field: { tileFraction: 0.07, opacity: [0.42, 0.5] as const },
  badge: { tileSizePx: 34, opacity: 0.3 },
  slide: { tileFractionMultiplier: 2, opacity: 0.55 },
} as const;

export interface FieldGrainOverlay {
  /** Attach to the actual DOM node whose width the tile should be sized to. */
  ref: (node: HTMLElement | null) => void;
  /** Merge into a `css` prop; `null` until measured (nothing to show yet). */
  overlayCss: Record<string, unknown> | null;
}

/**
 * Grain sized as a fraction of the FIELD'S OWN width (.spec.md §5: "7% of
 * field width"), not a fixed tile stretched/shrunk via CSS `background-size`
 * percentages. That distinction matters: a fixed-size tile scaled down via
 * `background-size: 7% auto` gets smoothed by the browser's image scaling —
 * heavily, the smaller the element — which low-pass-filters the noise into
 * near-uniform grey and makes it disappear (an overlay blend against flat
 * 128 grey is a no-op by design). Generating the tile AT the computed pixel
 * size and tiling it at `background-size: <n>px <n>px` (1:1, native
 * resolution, `background-repeat` stays the default `repeat`) avoids any
 * resampling. Uses the same ResizeObserver-measures-then-generate pattern as
 * `GradientField`'s mesh blur.
 */
export function useFieldGrain(tileFraction: number, opacity: number, seed: string): FieldGrainOverlay {
  const elRef = useRef<HTMLElement | null>(null);
  const [tileSize, setTileSize] = useState<number | null>(null);

  const ref = useCallback((node: HTMLElement | null) => {
    elRef.current = node;
  }, []);

  useEffect(() => {
    const el = elRef.current;
    if (!el || typeof ResizeObserver === "undefined") return undefined;
    const observer = new ResizeObserver(([entry]) => {
      const { width } = entry.contentRect;
      if (width > 0) setTileSize(Math.max(4, Math.round(width * tileFraction)));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [tileFraction]);

  // `tileSize` is null on the server and on the client's first render (before
  // ResizeObserver has fired), so `overlayCss` is null then too — server and
  // first client render match, same as `useGrainDataUri`'s mount gate.
  if (tileSize === null) return { ref, overlayCss: null };

  const uri = generateGrainDataUri(tileSize, seed);
  return {
    ref,
    overlayCss: {
      "&::after": {
        content: '""',
        position: "absolute",
        inset: 0,
        backgroundImage: `url("${uri}")`,
        backgroundSize: `${tileSize}px ${tileSize}px`,
        opacity,
        mixBlendMode: "overlay",
        pointerEvents: "none",
      },
    },
  };
}

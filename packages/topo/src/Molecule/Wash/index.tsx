import { Box, type BoxProps } from "@codeday/topo/Atom";
import React, { useEffect, useRef, useState } from "react";

import { type GradientName, STOP_POSITIONS, gradientStops } from "../../Theme/vars/colors";
import { useGrainOverlay } from "../../Theme/vars/grain";

export type WashShape = "rect" | "pill" | "tint" | "flat";

export interface WashProps extends Omit<BoxProps, "children"> {
  /** Which of the six brand ramps to use. */
  ramp: GradientName;
  /** Gradient angle in degrees. Section bands use 180. */
  angle?: number;
  /** Which form to render. */
  shape?: WashShape;
  /** The three-blurred-lobe mesh construction. */
  mesh?: boolean;
  /**
   * On a tall field the mesh lobes must be wide-and-short ellipses rather
   * than circles, or they clump — this is a caller-supplied hint rather
   * than auto-detected, since it only matters for the decorative mesh.
   */
  tall?: boolean;
  /** `corner-shape: superellipse(<n>)` exponent for `shape="rect"` — 2 (the default) is the `squircle` keyword itself. Every rect field is squircle-cornered by default, matching every other component in the system. */
  squircleN?: number;
  children?: React.ReactNode;
}

function hexToRgbTriplet(hex: string): string {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => Number.parseInt(h.slice(i, i + 2), 16)).join(",");
}

function stopList(stops: readonly string[], angle: number): string {
  return `linear-gradient(${angle}deg, ${stops.map((color, i) => `${color} ${STOP_POSITIONS[i]}%`).join(", ")})`;
}

// Mesh lobe ellipse radii — circles on a normal field, wide
// flattened ellipses on a tall one, otherwise the lobes clump.
const LOBES = [
  { at: "70% 14%", alpha: 0.75, normal: "34% 34%", tall: "46% 27%" },
  { at: "18% 70%", alpha: 0.7, normal: "38% 38%", tall: "52% 30%" },
  { at: "46% 92%", alpha: 0.6, normal: "30% 30%", tall: "44% 26%" },
] as const;

const Wash = React.forwardRef<HTMLDivElement, WashProps>(
  (
    {
      ramp,
      angle = 110,
      shape = "rect",
      mesh = false,
      tall = false,
      squircleN = 2,
      children,
      ...props
    },
    forwardedRef,
  ) => {
    const innerRef = useRef<HTMLDivElement | null>(null);
    const [size, setSize] = useState<{ width: number; height: number } | null>(null);

    useEffect(() => {
      const el = innerRef.current;
      if (!el || typeof ResizeObserver === "undefined") return undefined;
      const observer = new ResizeObserver(([entry]) => {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
      });
      observer.observe(el);
      return () => observer.disconnect();
    }, []);

    const stops = gradientStops[ramp];
    // 40%/62% stops — the ramp's own deep/mid, reused by the flat and tint forms.
    const [, , deep, mid] = stops;

    const backgroundImage =
      shape === "rect" || shape === "pill" ? stopList(stops, angle) : undefined;
    const backgroundColor =
      shape === "flat"
        ? mid
        : shape === "tint"
          ? "colorPalette.50" /* a solid, mode-aware wash instead of a raw alpha blend */
          : undefined;

    // `pill` is a stadium (full round), never sharing `rect`'s squircle
    // radius token — a "md"-radius pill isn't a pill at all.
    const borderRadius = shape === "rect" ? "md" : shape === "pill" ? "full" : undefined;

    // Native CSS corner-shape — Chromium-only, falls back to
    // the plain `border-radius` arc above on unsupported browsers. Every
    // rect field is squircle-cornered by default (squircleN=2), matching
    // Card/Badge/Button/Alert/Dialog/StatTile/forms/tooltip — there's no
    // separate "squircle" shape anymore since `rect` always is one. `pill`
    // is excluded: corner-shape has no visible effect on a fully round
    // stadium and isn't part of that shape's language.
    const cornerShape = shape === "rect" ? `superellipse(${squircleN})` : undefined;

    // Mesh lobe colours are the ramp's own 82%, 62%, 20% stops, so they
    // move with the ramp rather than being fixed.
    const lobeColors = [stops[4], stops[3], stops[1]];
    // Blur is 13% of the field's shorter dimension, floor 24px — not the
    // "4% of field width" originally specified. That number was
    // derived from the slide case (where the field IS the whole frame) and
    // doesn't transfer to a small box: the approved gallery used ~13% on a
    // ~360px field (blur(46px)), and 4% on a small tall field leaves the
    // lobe edges legible — exactly the "three blobs" failure the mesh
    // exists to prevent.
    const blurPx = size ? Math.max(24, Math.min(size.width, size.height) * 0.13) : 24;

    const meshCss = mesh
      ? {
          "&::before": {
            content: '""',
            position: "absolute",
            inset: "-25%",
            filter: `blur(${blurPx}px)`,
            zIndex: 0,
            background: LOBES.map(
              (lobe, i) =>
                `radial-gradient(${tall ? lobe.tall : lobe.normal} at ${lobe.at}, rgba(${hexToRgbTriplet(lobeColors[i])},${lobe.alpha}) 0%, rgba(${hexToRgbTriplet(lobeColors[i])},0) 100%)`,
            ).join(", "),
          },
        }
      : {};

    const cornerShapeCss = cornerShape ? { cornerShape } : {};

    // Grain — painted onto a canvas sized to this field (see
    // `useGrainOverlay`); `tint`/`flat` are explicitly
    // "quiet"/"when a gradient would be noise" forms, so they're excluded.
    const grainEligible = shape !== "tint" && shape !== "flat";
    const { containerRef: grainRef, canvas: grainCanvas } = useGrainOverlay("wash");

    return (
      <Box
        ref={(node: HTMLDivElement | null) => {
          innerRef.current = node;
          if (grainEligible) grainRef(node);
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef)
            (forwardedRef as React.RefObject<HTMLDivElement | null>).current = node;
        }}
        position="relative"
        overflow={mesh ? "hidden" : undefined}
        colorPalette={ramp}
        backgroundImage={backgroundImage}
        backgroundColor={backgroundColor}
        borderRadius={borderRadius}
        css={{ ...cornerShapeCss, ...meshCss }}
        {...props}
      >
        {children !== undefined && (
          // `height="100%"` only takes effect when this field has an explicit
          // height (e.g. the hero's mesh field) — CSS falls back to `auto` on
          // an auto-height ancestor, so content-sized fields are unaffected.
          // Without it, a `bottom`-positioned absolute child measures from
          // this wrapper's own flow height, which collapses to 0 when every
          // child is `position="absolute"`, landing it near the top instead.
          <Box position="relative" zIndex={1} height="100%">
            {children}
          </Box>
        )}
        {grainEligible && grainCanvas}
      </Box>
    );
  },
);

Wash.displayName = "Wash";
export { Wash };

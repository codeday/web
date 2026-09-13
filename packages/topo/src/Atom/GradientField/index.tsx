import { Box, type BoxProps } from "@codeday/topo/Atom";
import React, { useEffect, useRef, useState } from "react";

import { type GradientName, STOP_POSITIONS, gradientStops } from "../../Theme/vars/colors";
import { generateSquircleMask } from "./squircle";

export type GradientFieldShape = "rect" | "squircle" | "pill" | "tint" | "flat";

export interface GradientFieldProps extends Omit<BoxProps, "children"> {
  /** Which of the six brand ramps to use (.spec.md §1). */
  ramp: GradientName;
  /** Gradient angle in degrees. Section bands use 180 (.spec.md §4.7). */
  angle?: number;
  /** Which of §4.7's forms to render. */
  shape?: GradientFieldShape;
  /** The three-blurred-lobe mesh construction (.spec.md §4.7). */
  mesh?: boolean;
  /**
   * On a tall field the mesh lobes must be wide-and-short ellipses rather
   * than circles, or they clump — this is a caller-supplied hint rather
   * than auto-detected, since it only matters for the decorative mesh.
   */
  tall?: boolean;
  /** Superellipse exponent for `shape="squircle"` (.spec.md §4.8). */
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

// Mesh lobe ellipse radii (.spec.md §4.7) — circles on a normal field, wide
// flattened ellipses on a tall one, otherwise the lobes clump.
const LOBES = [
  { at: "70% 14%", alpha: 0.75, normal: "34% 34%", tall: "46% 27%" },
  { at: "18% 70%", alpha: 0.7, normal: "38% 38%", tall: "52% 30%" },
  { at: "46% 92%", alpha: 0.6, normal: "30% 30%", tall: "44% 26%" },
] as const;

const GradientField = React.forwardRef<HTMLDivElement, GradientFieldProps>(
  (
    { ramp, angle = 110, shape = "rect", mesh = false, tall = false, squircleN = 4.2, children, ...props },
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

    const backgroundImage = shape === "rect" || shape === "squircle" || shape === "pill" ? stopList(stops, angle) : undefined;
    const backgroundColor =
      shape === "flat" ? mid : shape === "tint" ? `${mid}12` /* 7% alpha over the surface */ : undefined;

    const borderRadius = shape === "rect" ? "26%" : shape === "pill" ? "16% / 46%" : undefined;

    const maskImage =
      shape === "squircle" && size ? `url("${generateSquircleMask(size.width, size.height, squircleN)}")` : undefined;

    // Mesh lobe colours are the ramp's own 82%, 62%, 20% stops (.spec.md §4.7),
    // so they move with the ramp rather than being fixed.
    const lobeColors = [stops[4], stops[3], stops[1]];
    // Blur is 4% of the field width (.spec.md §4.7).
    const blurPx = size ? Math.max(1, size.width * 0.04) : 16;

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

    const maskCss = maskImage
      ? { maskImage, WebkitMaskImage: maskImage, maskSize: "100% 100%", WebkitMaskSize: "100% 100%" }
      : {};

    return (
      <Box
        ref={(node: HTMLDivElement | null) => {
          innerRef.current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) (forwardedRef as React.RefObject<HTMLDivElement | null>).current = node;
        }}
        position="relative"
        overflow={mesh ? "hidden" : undefined}
        backgroundImage={backgroundImage}
        backgroundColor={backgroundColor}
        borderRadius={borderRadius}
        css={{ ...maskCss, ...meshCss }}
        {...props}
      >
        {children !== undefined && (
          <Box position="relative" zIndex={1}>
            {children}
          </Box>
        )}
      </Box>
    );
  },
);

GradientField.displayName = "GradientField";
export { GradientField };
export { generateSquirclePath, generateSquircleMask } from "./squircle";

import { Box, type BoxProps } from "@codeday/topo/Atom";
import React, { useEffect, useRef, useState } from "react";

import { type GradientName, STOP_POSITIONS, gradientStops } from "../../Theme/vars/colors";
import { useGrainOverlay } from "../../Theme/vars/grain";

export type WashShape = "rect" | "pill" | "tint" | "flat";

export interface WashProps extends Omit<BoxProps, "children"> {
  ramp: GradientName;
  angle?: number;
  shape?: WashShape;
  mesh?: boolean;
  tall?: boolean;
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
    const [, , deep, mid] = stops;

    const backgroundImage =
      shape === "rect" || shape === "pill" ? stopList(stops, angle) : undefined;
    const backgroundColor =
      shape === "flat" ? mid : shape === "tint" ? "colorPalette.50" : undefined;

    const borderRadius = shape === "rect" ? "md" : shape === "pill" ? "full" : undefined;

    const cornerShape = shape === "rect" ? `superellipse(${squircleN})` : undefined;

    const lobeColors = [stops[4], stops[3], stops[1]];
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

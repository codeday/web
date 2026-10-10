import { Box, type BoxProps } from "@codeday/topo/Atom";
import React from "react";

import { OVERLAY_OPACITY, useGrainOverlay } from "../../Theme/vars/grain";

export const INK_ILLUSTRATION_DESKTOP_SIZE = "min(36vw, {sizes.xl})";

const DARK_INK = "color-mix(in oklab, {colors.hibiscus.true.900} 45%, {colors.trueBlack})";
const GLOW =
  "color-mix(in oklab, color-mix(in oklab, {colors.hibiscus.900} 55%, {colors.hibiscus.400}) 45%, {colors.hibiscus.50})";
const GLOW_GRADIENT = `radial-gradient(${GLOW}, color-mix(in oklab, ${GLOW} 80%, transparent))`;

interface Fades {
  top: string;
  right: string;
  bottom: string;
  left: string;
}

function fadeMask({ top, right, bottom, left }: Fades): string {
  return [
    `linear-gradient(to bottom, transparent, black ${top})`,
    `linear-gradient(to left, transparent, black ${right})`,
    `linear-gradient(to top, transparent, black ${bottom})`,
    `linear-gradient(to right, transparent, black ${left})`,
  ].join(", ");
}

const EASE_STEPS = [0, 0.2, 0.4, 0.6, 0.8, 1];

function easedFade(direction: string, size: number): string {
  const stops = EASE_STEPS.map((t) => {
    const strength = Math.round((3 * t * t - 2 * t * t * t) * 100);
    return `color-mix(in oklab, black ${strength}%, transparent) ${t * size}%`;
  });
  return `linear-gradient(to ${direction}, ${stops.join(", ")})`;
}

function easedFadeMask({ top, right, bottom, left }: Record<keyof Fades, number>): string {
  return [
    easedFade("bottom", top),
    easedFade("left", right),
    easedFade("top", bottom),
    easedFade("right", left),
  ].join(", ");
}

export interface InkIllustrationProps extends Omit<BoxProps, "children"> {
  src: string;
  side: "left" | "right";
  textFade?: string;
}

export const InkIllustration = React.forwardRef<HTMLDivElement, InkIllustrationProps>(
  ({ src, side, textFade = "18%", css, ...props }, ref) => {
    const { containerRef, canvas } = useGrainOverlay(`ink-${src}`, OVERLAY_OPACITY * 0.8);
    const { containerRef: glowGrainRef, canvas: glowGrainCanvas } = useGrainOverlay(
      `ink-glow-${src}`,
      OVERLAY_OPACITY * 0.3,
    );

    const mobileMask = fadeMask({ top: "5%", right: "5%", bottom: "18%", left: "5%" });
    const desktopMask = fadeMask({
      top: "5%",
      bottom: "9%",
      left: side === "right" ? textFade : "0%",
      right: side === "left" ? textFade : "0%",
    });
    const mobileGlowMask = easedFadeMask({ top: 24, right: 24, bottom: 32, left: 24 });
    const desktopGlowMask = easedFadeMask({
      top: 26,
      bottom: 26,
      left: side === "right" ? 36 : 0,
      right: side === "left" ? 36 : 0,
    });

    return (
      <Box
        ref={ref}
        aria-hidden
        pointerEvents="none"
        flexShrink={0}
        aspectRatio="square"
        width={{ base: "5/6", md: INK_ILLUSTRATION_DESKTOP_SIZE }}
        height={{ md: INK_ILLUSTRATION_DESKTOP_SIZE }}
        maxWidth={{ base: "sm", md: "none" }}
        marginX={{ base: "auto", md: "0" }}
        position={{ base: "relative", md: "absolute" }}
        insetBlock={{ md: "0" }}
        marginBlock={{ md: "auto" }}
        left={{ md: side === "left" ? "0" : "auto" }}
        right={{ md: side === "right" ? "0" : "auto" }}
        css={{
          maskImage: { base: mobileMask, md: desktopMask },
          WebkitMaskImage: { base: mobileMask, md: desktopMask },
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
          ...(css as object),
        }}
        {...props}
      >
        <Box
          ref={glowGrainRef as any}
          position="absolute"
          inset="0"
          display={{ base: "none", _dark: "block" }}
          backgroundImage={GLOW_GRADIENT}
          css={{
            maskImage: { base: mobileGlowMask, md: desktopGlowMask },
            WebkitMaskImage: { base: mobileGlowMask, md: desktopGlowMask },
            maskComposite: "intersect",
            WebkitMaskComposite: "source-in",
          }}
        >
          {glowGrainCanvas}
        </Box>
        <Box
          ref={containerRef as any}
          position="absolute"
          inset="0"
          colorPalette="hibiscus"
          backgroundImage={{
            base: "radial-gradient(125% 135% at 20% 12%, {colors.colorPalette.gradient.critical})",
            _dark: "none",
          }}
          backgroundColor={{ _dark: DARK_INK }}
          css={{
            maskImage: `url("${src}")`,
            WebkitMaskImage: `url("${src}")`,
            maskSize: "contain",
            WebkitMaskSize: "contain",
            maskPosition: "center",
            WebkitMaskPosition: "center",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
          }}
        >
          {canvas}
        </Box>
      </Box>
    );
  },
);
InkIllustration.displayName = "InkIllustration";

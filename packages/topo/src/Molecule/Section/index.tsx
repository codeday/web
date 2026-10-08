import { Box, type BoxProps } from "@codeday/topo/Atom";
import React, { createContext, useContext } from "react";

import { type GradientName } from "../../Theme/vars/colors";

export type SectionSpacing = "default" | "compact";

export const SectionSpacingContext = createContext<SectionSpacing | undefined>(undefined);

const SPACING: Record<SectionSpacing, BoxProps["paddingBlock"]> = {
  default: { base: "16", xl: "24" },
  compact: { base: "10", xl: "14" },
};

export const CONTENT_INSET: BoxProps["paddingInline"] = { base: "5", md: "12", xl: "32" };

type Responsive<T> = T | Array<T> | Partial<Record<string, T>>;

export type SectionImgSrc = Responsive<string | null>;

export const SECTION_IMAGE_ANCHOR = "--section-image-anchor";

export interface SectionProps extends BoxProps {
  ramp: GradientName;
  spacing?: SectionSpacing;
  imgSrc?: SectionImgSrc;
  imgOpacity?: BoxProps["opacity"];
  imgBlendMode?: BoxProps["mixBlendMode"];
  imgPosition?: BoxProps["backgroundPosition"];
  imgSize?: BoxProps["backgroundSize"];
  imgFilter?: BoxProps["filter"];
  imgMask?: BoxProps["maskImage"];
  imgSide?: "left" | "right";
  imgOverlap?: string;
}

function toUrl(src: string | null | undefined): string {
  return src ? `url("${src}")` : "none";
}

function imgSrcToBackground(src: SectionImgSrc): BoxProps["backgroundImage"] {
  if (Array.isArray(src)) return src.map(toUrl);
  if (src && typeof src === "object") {
    return Object.fromEntries(
      Object.entries(src as Partial<Record<string, string | null>>).map(([bp, v]) => [
        bp,
        toUrl(v),
      ]),
    );
  }
  return toUrl(src as string | null);
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  (
    {
      ramp,
      spacing,
      imgSrc,
      imgOpacity = 0.9,
      imgBlendMode = "multiply",
      imgPosition = "center",
      imgSize = "cover",
      imgFilter = "grayscale(1) brightness(1.15) contrast(1.4)",
      imgMask,
      imgSide,
      imgOverlap = "{spacing.8}",
      children,
      ...props
    },
    ref,
  ) => {
    const contextSpacing = useContext(SectionSpacingContext);
    const resolvedSpacing = spacing ?? contextSpacing ?? "default";

    return (
      <Box
        as="section"
        ref={ref as any}
        colorPalette={ramp}
        paddingBlock={SPACING[resolvedSpacing]}
        paddingInline={CONTENT_INSET}
        {...(imgSrc && { position: "relative", isolation: "isolate", overflow: "hidden" })}
        {...props}
      >
        {children}
        {imgSrc && (
          <Box
            aria-hidden
            position="absolute"
            insetBlock="0"
            left={
              imgSide === "right"
                ? `calc(anchor(${SECTION_IMAGE_ANCHOR} right) - ${imgOverlap})`
                : "0"
            }
            right={
              imgSide === "left"
                ? `calc(anchor(${SECTION_IMAGE_ANCHOR} left) - ${imgOverlap})`
                : "0"
            }
            zIndex={-1}
            backgroundImage={imgSrcToBackground(imgSrc)}
            backgroundSize={imgSize}
            backgroundPosition={imgPosition}
            backgroundRepeat="no-repeat"
            mixBlendMode={imgBlendMode}
            filter={imgFilter}
            maskImage={imgMask}
            opacity={imgOpacity}
            pointerEvents="none"
          />
        )}
      </Box>
    );
  },
);
Section.displayName = "Section";

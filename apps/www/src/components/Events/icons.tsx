import React from "react";

interface IconProps {
  boxSize?: string | number;
  color?: string;
  style?: React.CSSProperties;
}

function svgSize(boxSize?: string | number): { width: string; height: string } {
  const size = typeof boxSize === "number" ? `${boxSize}px` : boxSize || "20px";
  return { width: size, height: size };
}

export function ExternalLinkIcon({ boxSize, color = "currentColor", style }: IconProps) {
  return (
    <svg
      {...svgSize(boxSize)}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={style}
    >
      <path d="M14 4h6v6M20 4l-9 9M18 13v6H5V6h6" />
    </svg>
  );
}

export function ChevronRightIcon({ boxSize, color = "currentColor", style }: IconProps) {
  return (
    <svg
      {...svgSize(boxSize)}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={style}
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

export function ChevronDownIcon({ boxSize, color = "currentColor", style }: IconProps) {
  return (
    <svg
      {...svgSize(boxSize)}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={style}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

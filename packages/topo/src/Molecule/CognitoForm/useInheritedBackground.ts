import { type RefObject, useEffect, useState } from "react";

export interface InheritedBackground {
  color: string;
  hsl: string;
}

let parseContext: CanvasRenderingContext2D | null = null;

function toRgba(color: string): [number, number, number, number] | null {
  parseContext ??= document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  if (!parseContext) return null;
  parseContext.clearRect(0, 0, 1, 1);
  parseContext.fillStyle = color;
  parseContext.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = parseContext.getImageData(0, 0, 1, 1).data;
  return [r, g, b, a / 255];
}

function rgbToHslTriplet(r: number, g: number, b: number): string {
  const [rn, gn, bn] = [r / 255, g / 255, b / 255];
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  const d = max - min;
  let h = 0;
  let s = 0;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    if (max === rn) h = ((gn - bn) / d) % 6;
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h = (h * 60 + 360) % 360;
  }
  return `${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`;
}

export function useInheritedBackground(
  ref: RefObject<HTMLElement | null>,
  deps: unknown[],
): InheritedBackground | null {
  const [background, setBackground] = useState<InheritedBackground | null>(null);

  useEffect(() => {
    let el: HTMLElement | null = ref.current?.parentElement ?? null;
    while (el) {
      const rgba = toRgba(getComputedStyle(el).backgroundColor);
      if (rgba && rgba[3] > 0) {
        const [r, g, b] = rgba;
        setBackground({ color: `rgb(${r}, ${g}, ${b})`, hsl: rgbToHslTriplet(r, g, b) });
        return;
      }
      el = el.parentElement;
    }
    setBackground(null);
  }, deps);

  return background;
}

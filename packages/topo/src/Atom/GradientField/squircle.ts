// ---------------------------------------------------------------------------
// The squircle (.spec.md §4.8) — a true superellipse corner (n=4.2), not a
// `border-radius` ellipse, which has discontinuous curvature and reads
// visibly differently at large sizes.
//
// The path is generated directly in the box's own pixel units (never a 1:1
// mask stretched via `preserveAspectRatio="none"` onto a non-square box —
// that turns the corners into tall ellipses), with the corner size held
// constant in absolute terms: 32% of the shorter dimension.
// ---------------------------------------------------------------------------

const DEFAULT_N = 4.2;
const CORNER_FRACTION = 0.32;
const SAMPLES_PER_CORNER = 20;
const HALF_PI = Math.PI / 2;

type Sign = 1 | -1;

function superellipseArc(
  cx: number,
  cy: number,
  r: number,
  n: number,
  sx: Sign,
  sy: Sign,
  tStart: number,
  tEnd: number,
): Array<[number, number]> {
  const points: Array<[number, number]> = [];
  for (let i = 0; i <= SAMPLES_PER_CORNER; i += 1) {
    const t = tStart + ((tEnd - tStart) * i) / SAMPLES_PER_CORNER;
    const cosPow = Math.cos(t) ** (2 / n);
    const sinPow = Math.sin(t) ** (2 / n);
    points.push([cx + sx * r * cosPow, cy + sy * r * sinPow]);
  }
  return points;
}

/**
 * Generate an SVG path `d` for a superellipse rounded-rect at the given box
 * dimensions (device pixels). Traversal is clockwise starting on the top
 * edge, one arc per corner meeting the straight edges tangentially.
 */
export function generateSquirclePath(width: number, height: number, n = DEFAULT_N): string {
  const r = CORNER_FRACTION * Math.min(width, height);

  const topRight = superellipseArc(width - r, r, r, n, 1, -1, HALF_PI, 0);
  const bottomRight = superellipseArc(width - r, height - r, r, n, 1, 1, 0, HALF_PI);
  const bottomLeft = superellipseArc(r, height - r, r, n, -1, 1, HALF_PI, 0);
  const topLeft = superellipseArc(r, r, r, n, -1, -1, 0, HALF_PI);

  const points: Array<[number, number]> = [
    [r, 0],
    ...topRight,
    [width, height - r],
    ...bottomRight,
    [r, height],
    ...bottomLeft,
    [0, r],
    ...topLeft,
  ];

  const [start, ...rest] = points;
  const line = rest.map(([x, y]) => `L${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
  return `M${start[0].toFixed(2)},${start[1].toFixed(2)} ${line} Z`;
}

/**
 * Build a `mask-image` data URI for the squircle at the given box
 * dimensions. The viewBox matches the box's own aspect ratio exactly, so
 * `preserveAspectRatio="none"` is a no-op rather than a distortion.
 */
export function generateSquircleMask(width: number, height: number, n = DEFAULT_N): string {
  const d = generateSquirclePath(width, height, n);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}' preserveAspectRatio='none'><path d='${d}' fill='#fff'/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

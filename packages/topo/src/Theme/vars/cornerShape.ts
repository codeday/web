// The house corner treatment — CSS's native `corner-shape`
// property (Chromium-only as of 2026; unsupported browsers just render the
// plain `border-radius` arc, an acceptable fallback) replaces the old
// ResizeObserver + SVG mask-image squircle simulation entirely. `corner-shape`
// blends only the corner region against `border-radius`, unlike the old JS's
// whole-box superellipse exponent — the two `n`s aren't equivalent, so the
// old implementation's 4.2 doesn't carry over. `squircle` (== superellipse(2))
// is the value the spec itself designates as the iOS-style squircle look.
export const SQUIRCLE_CORNER_SHAPE = "squircle";

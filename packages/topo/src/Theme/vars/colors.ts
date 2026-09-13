// Alpha color scales (previously from @chakra-ui/theme)
const blackAlpha: Record<string, string> = {
  50: "rgba(0, 0, 0, 0.04)",
  100: "rgba(0, 0, 0, 0.06)",
  200: "rgba(0, 0, 0, 0.08)",
  300: "rgba(0, 0, 0, 0.16)",
  400: "rgba(0, 0, 0, 0.24)",
  500: "rgba(0, 0, 0, 0.36)",
  600: "rgba(0, 0, 0, 0.48)",
  700: "rgba(0, 0, 0, 0.64)",
  800: "rgba(0, 0, 0, 0.80)",
  900: "rgba(0, 0, 0, 0.92)",
};

const whiteAlpha: Record<string, string> = {
  50: "rgba(255, 255, 255, 0.04)",
  100: "rgba(255, 255, 255, 0.06)",
  200: "rgba(255, 255, 255, 0.08)",
  300: "rgba(255, 255, 255, 0.16)",
  400: "rgba(255, 255, 255, 0.24)",
  500: "rgba(255, 255, 255, 0.36)",
  600: "rgba(255, 255, 255, 0.48)",
  700: "rgba(255, 255, 255, 0.64)",
  800: "rgba(255, 255, 255, 0.80)",
  900: "rgba(255, 255, 255, 0.92)",
};

// Only ever consumed at 180deg (Organism/Header's mobile-nav overlay), so this
// is a plain two-color helper rather than the old all-angles `linearGrads`.
const grad180 = (from: string, to: string) => `linear-gradient(180deg, ${from} 0%, ${to} 100%)`;

// ---------------------------------------------------------------------------
// The six brand gradients (.spec.md §1). Each ramp is six stops between a
// shared near-black `#120510` and a shared sand `#F7DEC9` — the shared
// endpoints are what make them read as one family.
//
// Stop roles: 62% is the ramp's midpoint and doubles as the solid accent
// colour (focus rings, tab markers, checked states); 40% is the deep. 82%
// and 100% are decorative-only — white text never sits over them (see
// `capRamp` in `./gradients.ts`).
// ---------------------------------------------------------------------------
export const gradientStops = {
  hibiscus: ["#120510", "#38102A", "#701C46", "#A83A5C", "#D97C56", "#F7DEC9"],
  hotsauce: ["#120510", "#3E1206", "#7E2608", "#BC4A1A", "#E28C3C", "#F7DEC9"],
  chilioil: ["#120510", "#380A10", "#6E1620", "#A82A2E", "#D9603E", "#F7DEC9"],
  blackberry: ["#120510", "#2C1638", "#5E2A52", "#9B4A4E", "#D08A4A", "#F7DEC9"],
  figjam: ["#120510", "#241242", "#4A2270", "#8A3A78", "#C87264", "#F7DEC9"],
  marmalade: ["#120510", "#33260A", "#6B4E10", "#A8801C", "#DCB43C", "#F7DEC9"],
} as const;

export const STOP_POSITIONS = [0, 20, 40, 62, 82, 100] as const;

export type GradientName = keyof typeof gradientStops;

// Per-section primary button fills (.spec.md §4.1) — each ramp compressed as
// far as it can travel while still holding white text at AA, plus a
// hand-tuned lightened tail. These are fixed values from the approved build,
// not derived.
export const gradientButtonStops = {
  hibiscus: ["#38102A", "#A83A5C", "#BC545A"],
  hotsauce: ["#3E1206", "#BC4A1A", "#CE5E22"],
  chilioil: ["#380A10", "#A82A2E", "#B93A34"],
  blackberry: ["#2C1638", "#9B4A4E", "#AD5A51"],
  figjam: ["#241242", "#8A3A78", "#9D4A79"],
  marmalade: ["#33260A", "#8C6C15", "#9C7A18"],
} as const;

export const GRADIENT_BUTTON_POSITIONS = [0, 62, 100] as const;

// Badge `gradient` variant fills (.spec.md §4.2) — its own hand-tuned
// two-color set, not the general deep/mid stops. Marmalade has no approved
// value (it's reserve, not in rotation per §1) — falls back to its own
// deep/mid stops so the token still resolves for every ramp.
export const badgeGradientStops: Record<GradientName, readonly [string, string]> = {
  hibiscus: ["#6A1A43", "#A83A5C"],
  hotsauce: ["#77240A", "#BC4A1A"],
  blackberry: ["#59284E", "#9B4A4E"],
  figjam: ["#472170", "#8A3A78"],
  chilioil: ["#6B1620", "#A82A2E"],
  marmalade: [gradientStops.marmalade[2], gradientStops.marmalade[3]],
};

const colors: Record<string, any> = {
  blackAlpha,
  whiteAlpha,
  black: "#252222",
  white: "#ffffff",
  // ---------------------------------------------------------------------------
  // Semantic palette (.spec.md §2). Eleven scales at six stops, derived in
  // OKLCH so lightness is perceptually even across hues (chroma capped at
  // 0.155, just under the gradients' own peak chroma of 0.162, so these
  // never out-saturate the brand).
  //
  // Stop contract: 500 is a light fill that takes BLACK text. 600 and 700
  // are dark fills that take WHITE text. 100 is a wash. 300 is a light
  // accent. 900 is near-black text on a 100 wash.
  //
  // BREAKING: this replaces a 50-1000(-1200) scale on a different lightness
  // curve. The polarity at a given stop name is not preserved — e.g. the old
  // red.600 (#ff686b) was a light fill under dark text; the new red.600
  // (#AA342E) is a dark fill under white text. Every call site was audited
  // and re-mapped by role, not by number (.spec.md §2.1).
  // ---------------------------------------------------------------------------
  gray: {
    100: "#F7E5D8",
    300: "#E7D7CF",
    500: "#B8A7A1",
    600: "#6F5F5A",
    700: "#524440",
    900: "#2A1E20",
  },
  red: {
    100: "#FBE4D7",
    300: "#FECEC5",
    500: "#FD8074",
    600: "#AA342E",
    700: "#841817",
    900: "#41060C",
  },
  orange: {
    100: "#FBE4D4",
    300: "#FED0B4",
    500: "#F68B43",
    600: "#9A4900",
    700: "#713400",
    900: "#371707",
  },
  yellow: {
    100: "#FBE6C2",
    300: "#F3D983",
    500: "#C9A800",
    600: "#766200",
    700: "#564700",
    900: "#2B1F07",
  },
  green: {
    100: "#E6EDCC",
    300: "#B3ECAC",
    500: "#65C46A",
    600: "#06791F",
    700: "#005813",
    900: "#07270D",
  },
  teal: {
    100: "#E0EDD8",
    300: "#91F0CC",
    500: "#00C89D",
    600: "#00755A",
    700: "#005541",
    900: "#072521",
  },
  cyan: {
    100: "#E4EBE1",
    300: "#7EEDF6",
    500: "#00C1D1",
    600: "#00717A",
    700: "#005259",
    900: "#07242C",
  },
  blue: {
    100: "#EFE7E1",
    300: "#C7DDF6",
    500: "#60B0FF",
    600: "#0065B0",
    700: "#004982",
    900: "#07203E",
  },
  indigo: {
    100: "#F2E6E1",
    300: "#D7D8F6",
    500: "#97A1FF",
    600: "#5254B9",
    700: "#393992",
    900: "#1F1847",
  },
  purple: {
    100: "#F9E3E1",
    300: "#F5CAF6",
    500: "#D588E7",
    600: "#883F99",
    700: "#682576",
    900: "#340E3A",
  },
  pink: {
    100: "#FBE3DA",
    300: "#FECCD5",
    500: "#F77DA7",
    600: "#A53260",
    700: "#7F1744",
    900: "#3F0523",
  },
};

// Hibiscus's accent-on-white (.spec.md §2.1) — not the raw 62% stop, the
// contrast-walked value from `accentOnWhite`, which for Hibiscus happen to
// be the same since Hibiscus already clears 4.5:1 at its 62% stop.
colors.brand = gradientStops.hibiscus[3];
colors.success = {
  border: colors.green[100],
  bg: colors.green[500],
  text: colors.green[900],
};
colors.failure = {
  border: colors.red[100],
  bg: colors.red[500],
  text: colors.red[900],
};
colors.grad = {
  // Only ever consumed at 180deg (Header's mobile-nav overlay via the `Box`
  // `grad` prop), so this is a flat sm/lg pair rather than the old
  // all-angles table `linearGrads` used to produce.
  darken: {
    sm: grad180(blackAlpha[300], "rgba(0,0,0,0)"),
    lg: grad180(blackAlpha[700], "rgba(0,0,0,0)"),
  },
  lighten: {
    sm: grad180(whiteAlpha[300], "rgba(255, 255, 255, 0)"),
    lg: grad180(whiteAlpha[700], "rgba(255, 255, 255, 0)"),
  },
  // Interim: gray.800 no longer exists in the new six-stop scale. Repointed
  // to gray.700 for now — Skelly's neutrals get a full retune in a later
  // commit (.spec.md §7 commit 5b).
  skelly: `linear-gradient(270deg, ${colors.gray[300]} 0, ${colors.gray[100]} 50%, ${colors.gray[300]} 100%)`,
  darkSkelly: `linear-gradient(270deg, ${colors.gray[700]} 0, ${colors.gray[600]} 50%, ${colors.gray[700]} 100%)`,
};
colors.modes = {
  light: {
    color: colors.black,
    text: colors.black,
    textLight: "#717171",
    bg: colors.white,
    background: colors.white,
    primary: colors.brand,
    // gray.200 no longer exists in the new six-stop scale (100/300/500/600/700/900);
    // nearest stop by role (a visible-but-quiet light border) is gray.300.
    border: colors.gray[300],
    borderColor: colors.gray[300],
    placeholder: colors.gray[600],
  },
  dark: {
    color: whiteAlpha[900],
    text: whiteAlpha[900],
    textLight: "#717171",
    // gray.1100 is removed entirely (.spec.md §2.1 step 5) — the dark-mode
    // page background is hardcoded here rather than being a palette stop.
    // This is the exact value gray.1100 used to hold, so dark mode's look is
    // unchanged; picking a *new* dark ground is a separate decision.
    bg: "#292929",
    background: "#292929",
    primary: colors.brand,
    border: whiteAlpha[300],
    borderColor: whiteAlpha[300],
    placeholder: whiteAlpha[400],
  },
};
colors.current = colors.modes.light;

export default colors;

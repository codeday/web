export { useColorMode, useColorModeValue, ColorModeScript } from "./compat";

export { default as codedayTheme } from "./vars";
// The six brand ramps (.spec.md §1) — public so consumers (including the
// component gallery) can enumerate/derive from them without reaching into
// internal paths.
export { gradientStops, type GradientName } from "./vars/colors";
export { accentOnWhite, capRamp } from "./vars/gradients";

export * from "./Provider";
export { useCmp } from "./providers/Cmp";
export * from "./query";

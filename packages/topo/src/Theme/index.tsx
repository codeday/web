export { useColorMode, useColorModeValue, ColorModeScript } from "./compat";

export { default as codedayTheme } from "./vars";
// The legacy plain-object theme (colors/fonts/fontSizes/cognito/config) that
// `ThemeDataProvider` (`@codeday/topo/utils`) expects as its context value —
// a handful of non-Chakra-style consumers (Box's `grad` prop, CognitoForm's
// style generator, the Html prose renderer) read colours/sizes through that
// context instead of Chakra's own system. Named distinctly from the Chakra
// `codedayTheme` system above — same underlying naming collision `Provider.tsx`
// resolves internally by importing both under different local names. A
// consumer that wraps its own tree without the full app `ThemeProvider` (the
// Storybook gallery) needs this to build its own `<ThemeDataProvider>`.
export { Theme as legacyThemeData } from "./vars";
// The six brand ramps — public so consumers (including the component
// gallery) can enumerate/derive from them without reaching into internal
// paths.
export { gradientStops, type GradientName } from "./vars/colors";
export { accentOnWhite, capRamp } from "./vars/gradients";

export * from "./Provider";
export { useCmp } from "./providers/Cmp";
// The brand @font-face declarations alone, with no consent-manager/Cognito
// chrome attached — for a consumer (the Storybook gallery) that wants real
// typography without the rest of `ThemeProvider`'s app-level side effects.
export { FontStyles } from "./providers/Fonts";
export * from "./query";

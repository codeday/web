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
// The dark-mode counterpart to `legacyThemeData.colors`'s `gray`/`red`
// scales (see `vars/darkColors.ts`) — public for a consumer that needs a
// mode-aware colour as a literal hex value rather than the
// `var(--chakra-colors-*)` reference every `_dark`-conditioned semantic
// token normally resolves to (via a `color`/`backgroundColor` prop, or
// `useToken` — both go through the same semantic-token machinery, so
// neither escapes the CSS variable for a token like `gray.700`). Needed
// anywhere a mode-aware colour has to survive being read by something that
// isn't a CSS cascade recalculation — see `LogoWall`'s `LogoMark` and
// `CreditLists`' `LogoMark` for why.
export { default as darkColors } from "./vars/darkColors";
export { accentOnWhite, capRamp } from "./vars/gradients";

export * from "./Provider";
export { useCmp } from "./providers/Cmp";
// The brand @font-face declarations alone, with no consent-manager/Cognito
// chrome attached — for a consumer (the Storybook gallery) that wants real
// typography without the rest of `ThemeProvider`'s app-level side effects.
export { FontStyles } from "./providers/Fonts";
export * from "./query";

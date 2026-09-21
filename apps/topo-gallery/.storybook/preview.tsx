import { ChakraProvider } from "@chakra-ui/react";
import { Box, Toaster } from "@codeday/topo/Atom";
import { codedayTheme, FontStyles, legacyThemeData } from "@codeday/topo/Theme";
import { ThemeDataProvider, _toaster, defaultFontSizes, type ThemeData } from "@codeday/topo/utils";
import type { Preview } from "@storybook/react-vite";
import { ThemeProvider as NextThemesProvider } from "@wrksz/themes";
import React from "react";

// Mirrors the `themeData` object `ThemeProvider`/`Provider.tsx` builds
// internally (colors/fonts/fontSizes/space/radii/cognito/config) — several
// components (Box's `grad` prop for Skelly's gradient, among others) read
// through `ThemeDataProvider`'s context rather than Chakra's own system, and
// crash on the default empty-`colors` context value if nothing supplies
// this.
const themeData: ThemeData = {
  colors: legacyThemeData.colors,
  fonts: legacyThemeData.fonts,
  fontSizes: defaultFontSizes,
  space: legacyThemeData.space || {},
  radii: legacyThemeData.radii || {
    none: "0",
    sm: "0.125rem",
    base: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    "2xl": "1rem",
    "3xl": "1.5rem",
    full: "9999px",
  },
  cognito: legacyThemeData.cognito,
  config: legacyThemeData.config,
  visibility: "Public",
  strings: {},
  apiEndpoint: "https://graph.codeday.org/",
};

// Deliberately NOT the full app `ThemeProvider` (`@codeday/topo/Theme`) —
// that also wires up Cognito Forms' script tag and the Usercentrics
// consent-manager banner, both app-level concerns with no place in a
// component gallery (the old Next.js version of this gallery reused
// `ThemeProvider` directly, which is why every one of its screenshots had
// a cookie-consent banner sitting over the components under test). This
// wires up only what stories actually need: the Chakra system, color-mode
// switching, the legacy theme-data context a few components still read
// (see `themeData` above), the brand fonts, and the app-wide default
// `colorPalette="hibiscus"` (matching `Provider.tsx`'s own `<Box
// colorPalette={brandRamp} display="contents">` wrapper) — without it, any
// story that doesn't set its own `colorPalette` (Tabs' indicator, etc.)
// falls back to Chakra's built-in default palette instead of a brand ramp.
const preview: Preview = {
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <ChakraProvider value={codedayTheme}>
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          storage="none"
          followSystem
        >
          <ThemeDataProvider value={themeData}>
            <FontStyles />
            <Box colorPalette="hibiscus" display="contents">
              <Story />
            </Box>
            <Toaster toaster={_toaster} />
          </ThemeDataProvider>
        </NextThemesProvider>
      </ChakraProvider>
    ),
  ],
};

export default preview;

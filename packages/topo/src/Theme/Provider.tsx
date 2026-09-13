import { Box } from "@codeday/topo/Atom";
import { ChakraProvider } from "@chakra-ui/react";
import { ThemeDataProvider, defaultFontSizes, type ThemeData } from "@codeday/topo/utils";
import { ThemeProvider as NextThemesProvider } from "@wrksz/themes";
import React from "react";

import { CmpProvider } from "./providers/Cmp";
import { FontStyles } from "./providers/Fonts";
import codedaySystem, { Theme as codedayTheme } from "./vars";
import { gradientStops } from "./vars/colors";
import { accentOnWhite } from "./vars/gradients";

export interface ProviderProps {
  analyticsId?: string | null;
  brandColor?: string | null;
  withChat?: boolean;
  visibility?: string;
  initialColorMode?: string | null;
  useSystemColorMode?: boolean;
  /** @deprecated Cookie-based color mode is no longer supported in v3. */
  cookies?: any;
  children?: React.ReactNode;
  locale?: string;
  localizationConfig?: string;
  /** Override the Cognito Forms account ID (default: 7hYXr3TPxk6yIpJxjqVoFQ) */
  cognitoFormsId?: string;
  /** Override the Usercentrics CMP settings ID (default: FQ314iLcg1whiu) */
  usercentricsSettingsId?: string;
  /** Override the GraphQL API endpoint (default: https://graph.codeday.org/) */
  apiEndpoint?: string;
}

const Provider = ({
  brandColor = null,
  visibility = "Public",
  children,
  locale,
  localizationConfig,
  cognitoFormsId,
  usercentricsSettingsId,
  apiEndpoint,
}: ProviderProps) => {
  // Handle brandColor (mutates theme object — same behaviour as v2).
  // .spec.md §2.1: `brand` is now a ramp's accent-on-white, not a semantic
  // hue's `.600` stop — `brandColor="red"` (the old default, back when
  // brand was literally `red.600`) would otherwise silently re-clobber the
  // Hibiscus default set in colors.ts. Ramp names take priority; a
  // semantic-hue name is still accepted for any caller that hasn't moved
  // off the old convention.
  const brandRamp = brandColor && brandColor in gradientStops ? brandColor : "hibiscus";
  if (brandColor && brandColor in gradientStops) {
    codedayTheme.colors.brand = accentOnWhite(gradientStops[brandColor as keyof typeof gradientStops]);
  } else if (brandColor && brandColor in codedayTheme.colors) {
    codedayTheme.colors.brand = codedayTheme.colors[brandColor][600];
  }

  const themeData: ThemeData = {
    colors: codedayTheme.colors,
    fonts: codedayTheme.fonts,
    fontSizes: defaultFontSizes,
    space: codedayTheme.space || {},
    radii: codedayTheme.radii || {
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
    cognito: cognitoFormsId ? { id: cognitoFormsId } : codedayTheme.cognito,
    config: codedayTheme.config,
    visibility,
    strings: {},
    programWebname: undefined,
    apiEndpoint: apiEndpoint || "https://graph.codeday.org/",
  };

  return (
    <ChakraProvider value={codedaySystem}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem={true}
        storage="none"
        followSystem
      >
        <ThemeDataProvider value={themeData}>
          <FontStyles />
          <script src="https://www.cognitoforms.com/f/seamless.js" defer />
          {/* App-wide default `colorPalette` (.spec.md §4.1's per-section
              ramp switching needs *some* default so recipes referencing
              `colorPalette.mid`/`.deep`/etc. don't silently fail when a
              descendant doesn't set one itself; any section can still
              override by setting its own `colorPalette`). */}
          <Box colorPalette={brandRamp} display="contents">
            <CmpProvider usercentricsSettingsId={usercentricsSettingsId}>{children}</CmpProvider>
          </Box>
        </ThemeDataProvider>
      </NextThemesProvider>
    </ChakraProvider>
  );
};

/** @deprecated Cookie-based SSR color mode is no longer needed with next-themes. */
function getServerSideProps({ req }: any) {
  return {
    props: {
      cookies: req.headers.cookie ?? "",
    },
  };
}

export { getServerSideProps, Provider as ThemeProvider };
export type { ProviderProps as ThemeProviderProps };

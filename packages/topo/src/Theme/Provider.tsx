import { ChakraProvider } from "@chakra-ui/react";
import { ThemeDataProvider, defaultFontSizes, type ThemeData } from "@codeday/topo/utils";
import { ThemeProvider as NextThemesProvider } from "@wrksz/themes";
import React from "react";

import { CmpProvider } from "./providers/Cmp";
import { useCmsStrings } from "./providers/CmsStrings";
import { FontStyles } from "./providers/Fonts";
import { QueryProvider } from "./query";
import codedaySystem, { Theme as codedayTheme } from "./vars";

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
  const { data, strings } = useCmsStrings({ locale, localizationConfig, apiEndpoint });

  // Handle brandColor (mutates theme object — same behaviour as v2)
  if (brandColor && brandColor in codedayTheme.colors) {
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
    strings,
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
          <QueryProvider value={data}>
            <CmpProvider usercentricsSettingsId={usercentricsSettingsId}>{children}</CmpProvider>
          </QueryProvider>
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

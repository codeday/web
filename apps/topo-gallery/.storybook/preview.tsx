import { ChakraProvider } from "@chakra-ui/react";
import { Box, Toaster } from "@codeday/topo/Atom";
import { codedayTheme, FontStyles, legacyThemeData } from "@codeday/topo/Theme";
import {
  ThemeDataProvider,
  _toaster,
  defaultFontSizes,
  defaultRadii,
  defaultSpace,
  type ThemeData,
} from "@codeday/topo/utils";
import type { Preview } from "@storybook/react-vite";
import { ThemeProvider as NextThemesProvider } from "@wrksz/themes";
import React from "react";

const themeData: ThemeData = {
  colors: legacyThemeData.colors,
  fonts: legacyThemeData.fonts,
  fontSizes: defaultFontSizes,
  space: legacyThemeData.space || defaultSpace,
  radii: legacyThemeData.radii || defaultRadii,
  cognito: legacyThemeData.cognito,
  config: legacyThemeData.config,
  visibility: "Public",
  strings: {},
  apiEndpoint: "https://graph.codeday.org/",
};

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

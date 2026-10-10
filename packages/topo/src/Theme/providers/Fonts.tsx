import { Global, css } from "@emotion/react";
import React from "react";

const fontCss = css`
  @font-face {
    font-family: "Sofia Pro";
    src:
      url("https://f1.codeday.org/topo/fonts/SofiaPro-Bold.woff2") format("woff2"),
      url("https://f1.codeday.org/topo/fonts/SofiaPro-Bold.woff") format("woff"),
      url("https://f1.codeday.org/topo/fonts/SofiaPro-Bold.ttf") format("truetype");
    font-weight: 700;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: "Sofia Pro";
    src:
      url("https://f1.codeday.org/topo/fonts/SofiaPro-Regular.woff2") format("woff2"),
      url("https://f1.codeday.org/topo/fonts/SofiaPro-Regular.woff") format("woff"),
      url("https://f1.codeday.org/topo/fonts/SofiaPro-Regular.ttf") format("truetype");
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: "Sofia Pro";
    src:
      url("https://f1.codeday.org/topo/fonts/SofiaPro-Regularitalic.woff2") format("woff2"),
      url("https://f1.codeday.org/topo/fonts/SofiaPro-Regularitalic.woff") format("woff"),
      url("https://f1.codeday.org/topo/fonts/SofiaPro-Regularitalic.ttf") format("truetype");
    font-weight: 400;
    font-style: italic;
    font-display: swap;
  }
  @font-face {
    font-family: "Fira Code";
    src:
      url("https://f1.codeday.org/topo/fonts/firacode-bold-webfont.woff2") format("woff2"),
      url("https://f1.codeday.org/topo/fonts/firacode-bold-webfont.woff") format("woff");
    font-weight: 700;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: "Fira Code";
    src:
      url("https://f1.codeday.org/topo/fonts/firacode-regular-webfont.woff2") format("woff2"),
      url("https://f1.codeday.org/topo/fonts/firacode-regular-webfont.woff") format("woff");
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: "Caveat";
    src: url("/fonts/caveat-latin-500-normal.woff2") format("woff2");
    font-weight: 500;
    font-style: normal;
    font-display: swap;
    unicode-range:
      U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329,
      U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }
  @font-face {
    font-family: "Caveat";
    src: url("/fonts/caveat-latin-ext-500-normal.woff2") format("woff2");
    font-weight: 500;
    font-style: normal;
    font-display: swap;
    unicode-range:
      U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329,
      U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F,
      U+A720-A7FF;
  }
`;

export function FontStyles() {
  return <Global styles={fontCss} />;
}

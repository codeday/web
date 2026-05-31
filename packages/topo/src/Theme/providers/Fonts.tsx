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
    font-family: "Gosha Sans";
    font-weight: 700;
    src:
      url("https://f1.codeday.org/topo/fonts/GoshaSans-Bold.woff2") format("woff2"),
      url("https://f1.codeday.org/topo/fonts/GoshaSans-Bold.woff") format("woff"),
      url("https://f1.codeday.org/topo/fonts/GoshaSans-Bold.ttf") format("truetype");
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
`;

export function FontStyles() {
  return <Global styles={fontCss} />;
}

import { Toaster } from "@codeday/topo/Atom";
import { ThemeProvider } from "@codeday/topo/Theme";
import { _toaster } from "@codeday/topo/utils";
import type { AppProps } from "next/app";
import React from "react";

export default function GalleryApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider brandColor="hibiscus" useSystemColorMode>
      <Component {...pageProps} />
      <Toaster toaster={_toaster} />
    </ThemeProvider>
  );
}

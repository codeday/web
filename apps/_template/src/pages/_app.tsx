import { ThemeProvider, PageDataProvider } from "@codeday/topo/Theme";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <PageDataProvider value={pageProps?.query || {}}>
        <Component {...pageProps} />
      </PageDataProvider>
    </ThemeProvider>
  );
}

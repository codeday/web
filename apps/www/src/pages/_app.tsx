import { ThemeProvider, PageDataProvider } from "@codeday/topo/Theme";
import { overwriteGetLocale, baseLocale, type Locale } from "@codeday/i18n/runtime";

import "react-responsive-modal/styles.css";
import { debug } from "@codeday/utils";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { Fragment, StrictMode, useEffect } from "react";

import { MarketingProvider, FundraiseProvider } from "../providers";
const DEBUG = debug(["www", "pages", "_app"]);

const STRICT_MODE_OR_FRAGMENT =
  process.env.NEXT_PUBLIC_ENV === "development" ? StrictMode : Fragment;

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Wire Next.js locale to Paraglide
  overwriteGetLocale(() => (router.locale as Locale) ?? baseLocale);

  useEffect(() => {
    DEBUG("pageProps", pageProps);
  }, []);

  return (
    <STRICT_MODE_OR_FRAGMENT>
      <ThemeProvider brandColor="red" useSystemColorMode cookies={pageProps.cookies}>
        <MarketingProvider>
          <FundraiseProvider>
            <PageDataProvider value={pageProps?.query || {}}>
              <Component {...pageProps} />
            </PageDataProvider>
          </FundraiseProvider>
        </MarketingProvider>
      </ThemeProvider>
    </STRICT_MODE_OR_FRAGMENT>
  );
}

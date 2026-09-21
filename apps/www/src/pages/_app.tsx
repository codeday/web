import { overwriteGetLocale, baseLocale, type Locale } from "@codeday/i18n/runtime";
import { Toaster } from "@codeday/topo/Atom";
import { RegionProvider, getRegionFromHostname } from "@codeday/topo/Region";
import { ThemeProvider } from "@codeday/topo/Theme";

import "react-responsive-modal/styles.css";
import { _toaster } from "@codeday/topo/utils";
import { debug } from "@codeday/utils";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { Fragment, StrictMode, useEffect, useMemo } from "react";

import { MarketingProvider, FundraiseProvider } from "../providers";

const DEBUG = debug(["www", "pages", "_app"]);

const STRICT_MODE_OR_FRAGMENT =
  process.env.NEXT_PUBLIC_ENV === "development" ? StrictMode : Fragment;

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Wire Next.js locale to Paraglide.
  // The "_default" sentinel locale means no prefix was in the URL — treat as baseLocale.
  const resolvedLocale = (
    router.locale && router.locale !== "_default" ? router.locale : baseLocale
  ) as Locale;
  overwriteGetLocale(() => resolvedLocale);

  // Resolve region from the current hostname.
  const region = useMemo(
    () =>
      getRegionFromHostname(typeof window !== "undefined" ? window.location.hostname : undefined),
    [],
  );

  useEffect(() => {
    DEBUG("pageProps", pageProps);
  }, []);

  return (
    <STRICT_MODE_OR_FRAGMENT>
      <RegionProvider value={region}>
        <ThemeProvider brandColor="hibiscus" useSystemColorMode cookies={pageProps.cookies}>
          <MarketingProvider>
            <FundraiseProvider>
              <Component {...pageProps} />
              <Toaster toaster={_toaster} />
            </FundraiseProvider>
          </MarketingProvider>
        </ThemeProvider>
      </RegionProvider>
    </STRICT_MODE_OR_FRAGMENT>
  );
}

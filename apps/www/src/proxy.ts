import { locales, baseLocale as FALLBACK_LOCALE } from "@codeday/i18n/locales";
import { getRegionFromHostname, REGION_HEADER } from "@codeday/topo/Region/config";
import { NextRequest, NextResponse } from "next/server";

const AVAILABLE_LOCALES: readonly string[] = locales;
const UNSPECIFIED = "_default";

const PUBLIC_FILE = /\.(.*)$/;

function getPreferredLocale(acceptLanguage: string | null): string {
  if (!acceptLanguage) return FALLBACK_LOCALE;

  const entries = acceptLanguage.split(",").map((entry) => {
    const [lang, qPart] = entry.trim().split(";");
    const q = qPart ? parseFloat(qPart.replace("q=", "")) : 1.0;
    return { lang: lang.trim().toLowerCase(), q };
  });

  entries.sort((a, b) => b.q - a.q);

  for (const { lang } of entries) {
    if (AVAILABLE_LOCALES.includes(lang)) return lang;
    const prefix = lang.split("-")[0];
    if (AVAILABLE_LOCALES.includes(prefix)) return prefix;
  }

  return FALLBACK_LOCALE;
}

export function proxy(request: NextRequest) {
  if (
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.includes("/api/") ||
    PUBLIC_FILE.test(request.nextUrl.pathname)
  ) {
    return;
  }

  if (request.nextUrl.locale === UNSPECIFIED) {
    const browserLocale = getPreferredLocale(request.headers.get("accept-language"));
    const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;

    const locale =
      cookieLocale && AVAILABLE_LOCALES.includes(cookieLocale) ? cookieLocale : browserLocale;

    return NextResponse.redirect(
      new URL(`/${locale}${request.nextUrl.pathname}${request.nextUrl.search}`, request.url),
    );
  }

  const region = getRegionFromHostname(request.headers.get("host"));
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(REGION_HEADER, region);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

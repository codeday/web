import { NextRequest, NextResponse } from "next/server";
import { getRegionFromHostname, REGION_HEADER } from "./region/config";

/** Real locales supported by the app (excludes the _default sentinel). */
const AVAILABLE_LOCALES = ["en", "es"];
const FALLBACK_LOCALE = "en";
const UNSPECIFIED = "_default";

const PUBLIC_FILE = /\.(.*)$/;

/**
 * Parse the Accept-Language header and return the first supported locale.
 * Falls back to FALLBACK_LOCALE if no match is found.
 */
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

export function middleware(request: NextRequest) {
  // Skip Next.js internals, API routes, and static files
  if (
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.includes("/api/") ||
    PUBLIC_FILE.test(request.nextUrl.pathname)
  ) {
    return;
  }

  // If Next.js resolved locale to _default, the URL has no locale prefix.
  // Detect the browser's preferred language and redirect.
  if (request.nextUrl.locale === UNSPECIFIED) {
    const browserLocale = getPreferredLocale(request.headers.get("accept-language"));
    const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;

    const locale =
      cookieLocale && AVAILABLE_LOCALES.includes(cookieLocale)
        ? cookieLocale
        : browserLocale;

    return NextResponse.redirect(
      new URL(
        `/${locale}${request.nextUrl.pathname}${request.nextUrl.search}`,
        request.url,
      ),
    );
  }

  // Resolve region from the hostname and forward it as a request header
  // so getServerSideProps can read it without re-parsing.
  const region = getRegionFromHostname(request.headers.get("host"));
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(REGION_HEADER, region);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

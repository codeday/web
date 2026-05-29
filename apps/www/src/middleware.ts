import { NextRequest, NextResponse } from "next/server";

const LOCALES = ["en", "es"];
const DEFAULT_LOCALE = "en";

/**
 * Parse the Accept-Language header and return the best matching supported locale.
 * Falls back to DEFAULT_LOCALE if no match is found.
 */
function getPreferredLocale(acceptLanguage: string | null): string {
  if (!acceptLanguage) return DEFAULT_LOCALE;

  // Parse entries like "en-US,en;q=0.9,es;q=0.8"
  const entries = acceptLanguage.split(",").map((entry) => {
    const [lang, qPart] = entry.trim().split(";");
    const q = qPart ? parseFloat(qPart.replace("q=", "")) : 1.0;
    return { lang: lang.trim().toLowerCase(), q };
  });

  // Sort by quality descending
  entries.sort((a, b) => b.q - a.q);

  for (const { lang } of entries) {
    // Exact match (e.g. "en" or "es")
    if (LOCALES.includes(lang)) return lang;
    // Prefix match (e.g. "en-US" → "en")
    const prefix = lang.split("-")[0];
    if (LOCALES.includes(prefix)) return prefix;
  }

  return DEFAULT_LOCALE;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the pathname already starts with a supported locale
  const pathnameHasLocale = LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) return NextResponse.next();

  // Skip Next.js internals and static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") // static files like favicon.ico, robots.txt
  ) {
    return NextResponse.next();
  }

  // Redirect bare paths to the best matching locale
  const locale = getPreferredLocale(request.headers.get("accept-language"));
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Match all paths except Next.js internals and static files
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};

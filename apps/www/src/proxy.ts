import { locales, baseLocale as FALLBACK_LOCALE } from "@codeday/i18n/locales";
import { isInternalPageHref } from "@codeday/topo/isInternalPageHref";
import { getRegionFromHostname } from "@codeday/topo/Region/config";
import { NextRequest, NextResponse } from "next/server";

const AVAILABLE_LOCALES: readonly string[] = locales;
const UNSPECIFIED = "_default";

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
    const language = lang.split("-")[0];
    const sameLanguage = AVAILABLE_LOCALES.find((locale) => locale.split("-")[0] === language);
    if (sameLanguage) return sameLanguage;
  }

  return FALLBACK_LOCALE;
}

export function proxy(request: NextRequest) {
  if (!isInternalPageHref(request.nextUrl.pathname)) {
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
  const url = request.nextUrl.clone();
  url.pathname = `/_region/${region}${url.pathname === "/" ? "" : url.pathname}`;
  return NextResponse.rewrite(url);
}

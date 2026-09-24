import type {
  GetStaticProps,
  GetServerSideProps,
  GetStaticPropsContext,
  GetServerSidePropsContext,
} from "next";

import { overwriteGetLocale, baseLocale, type Locale, isLocale } from "./paraglide/runtime.js";

async function withLocale<T>(locale: string | undefined, fn: () => Promise<T>): Promise<T> {
  const resolvedLocale: Locale = (locale && isLocale(locale) ? locale : baseLocale) as Locale;

  const { getLocale: previousGetLocale } = await import("./paraglide/runtime.js");
  overwriteGetLocale(() => resolvedLocale);
  try {
    return await fn();
  } finally {
    overwriteGetLocale(previousGetLocale);
  }
}

export function withLocaleStaticProps<P extends Record<string, any>>(
  fn: GetStaticProps<P>,
): GetStaticProps<P> {
  return (context: GetStaticPropsContext) => {
    return withLocale(context.locale, () => Promise.resolve(fn(context)));
  };
}

export function withLocaleServerSideProps<P extends Record<string, any>>(
  fn: GetServerSideProps<P>,
): GetServerSideProps<P> {
  return (context: GetServerSidePropsContext) => {
    return withLocale(context.locale, () => Promise.resolve(fn(context)));
  };
}

export function getLocaleFromContext(
  context: GetStaticPropsContext | GetServerSidePropsContext,
): Locale {
  const locale = context.locale;
  return (locale && isLocale(locale) ? locale : baseLocale) as Locale;
}

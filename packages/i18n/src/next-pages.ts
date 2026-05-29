/**
 * Helpers for using Paraglide i18n with Next.js Pages Router.
 *
 * These wrappers ensure `getLocale()` returns the correct locale
 * inside `getStaticProps` and `getServerSideProps`, where the
 * `_app.tsx` `overwriteGetLocale` hasn't run yet.
 */
import type { GetStaticProps, GetServerSideProps, GetStaticPropsContext, GetServerSidePropsContext } from "next";
import { overwriteGetLocale, baseLocale, type Locale, isLocale } from "./paraglide/runtime.js";

/**
 * Temporarily set the Paraglide locale for the duration of an async callback.
 * Restores the previous `getLocale` implementation afterward.
 */
async function withLocale<T>(locale: string | undefined, fn: () => Promise<T>): Promise<T> {
  const resolvedLocale: Locale = (locale && isLocale(locale) ? locale : baseLocale) as Locale;

  // Save current getLocale so we can restore it
  const { getLocale: previousGetLocale } = await import("./paraglide/runtime.js");
  overwriteGetLocale(() => resolvedLocale);
  try {
    return await fn();
  } finally {
    overwriteGetLocale(previousGetLocale);
  }
}

/**
 * Wrap a `getStaticProps` function so that `getLocale()` returns the
 * page's locale during execution.
 *
 * @example
 *   export const getStaticProps = withLocaleStaticProps(async (ctx) => {
 *     // getLocale() and m.*() work correctly here
 *     return { props: { title: m.page_title() } };
 *   });
 */
export function withLocaleStaticProps<P extends Record<string, any>>(
  fn: GetStaticProps<P>,
): GetStaticProps<P> {
  return (context: GetStaticPropsContext) => {
    return withLocale(context.locale, () =>
      Promise.resolve(fn(context)),
    );
  };
}

/**
 * Wrap a `getServerSideProps` function so that `getLocale()` returns the
 * page's locale during execution.
 *
 * @example
 *   export const getServerSideProps = withLocaleServerSideProps(async (ctx) => {
 *     return { props: { greeting: m.hello() } };
 *   });
 */
export function withLocaleServerSideProps<P extends Record<string, any>>(
  fn: GetServerSideProps<P>,
): GetServerSideProps<P> {
  return (context: GetServerSidePropsContext) => {
    return withLocale(context.locale, () =>
      Promise.resolve(fn(context)),
    );
  };
}

/**
 * Get the resolved Paraglide locale from a Next.js context object.
 * Useful when you need the locale value itself (e.g., for GraphQL variables)
 * without going through Paraglide message functions.
 */
export function getLocaleFromContext(
  context: GetStaticPropsContext | GetServerSidePropsContext,
): Locale {
  const locale = context.locale;
  return (locale && isLocale(locale) ? locale : baseLocale) as Locale;
}

import { useRouter } from "next/compat/router";

import { isInternalPageHref } from "./isInternalPageHref";

export { isInternalPageHref };

// Next's Pages Router <Link> adds the current locale prefix (and client-side navigation), but
// crashes on click without a router, so only use it when one is mounted (not in Storybook).
export function useNextLinkHref(href: unknown): string | undefined {
  const router = useRouter();
  return router && isInternalPageHref(href) ? href : undefined;
}

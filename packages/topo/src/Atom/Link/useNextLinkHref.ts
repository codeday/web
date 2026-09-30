import { useRouter } from "next/compat/router";

const PUBLIC_FILE_EXTENSION =
  /\.(png|jpe?g|gif|svg|ico|webp|avif|pdf|txt|xml|json|webmanifest|mp4|webm|mp3|zip|csv|ics|woff2?|js|css)$/i;

export function isInternalPageHref(href: unknown): href is string {
  if (typeof href !== "string" || !href.startsWith("/") || href.startsWith("//")) return false;
  const path = href.split(/[?#]/, 1)[0];
  if (path.startsWith("/_next/") || path === "/api" || path.startsWith("/api/")) return false;
  return !PUBLIC_FILE_EXTENSION.test(path);
}

// Next's Pages Router <Link> adds the current locale prefix (and client-side navigation), but
// crashes on click without a router, so only use it when one is mounted (not in Storybook).
export function useNextLinkHref(href: unknown): string | undefined {
  const router = useRouter();
  return router && isInternalPageHref(href) ? href : undefined;
}

const PUBLIC_FILE_EXTENSION =
  /\.(png|jpe?g|gif|svg|ico|webp|avif|pdf|txt|xml|json|webmanifest|mp4|webm|mp3|zip|csv|ics|woff2?|js|css)$/i;

export function isInternalPageHref(href: unknown): href is string {
  if (typeof href !== "string" || !href.startsWith("/") || href.startsWith("//")) return false;
  const path = href.split(/[?#]/, 1)[0];
  if (path.startsWith("/_next/") || path === "/api" || path.startsWith("/api/")) return false;
  if (path.startsWith("/.well-known/")) return false;
  return !PUBLIC_FILE_EXTENSION.test(path);
}

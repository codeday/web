import debugFactory from "debug";

function hasDebugConfig() {
  if (typeof window !== "undefined") return !!window.localStorage?.debug;
  return typeof process !== "undefined" && !!process.env.DEBUG;
}

function defaultEnableDebug() {
  const env =
    typeof process !== "undefined" ? process.env : ({} as Record<string, string | undefined>);
  if (!hasDebugConfig() && env.NODE_ENV !== "production" && env.NEXT_PUBLIC_ENV !== "production") {
    debugFactory.enable("codeday:*");
  }
}

export function debug(nameParts: string[]) {
  defaultEnableDebug();
  return debugFactory(["codeday", ...nameParts].join(":"));
}

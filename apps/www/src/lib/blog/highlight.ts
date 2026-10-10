import hljs from "highlight.js/lib/common";

export function highlightCode(code: string): string {
  return hljs.highlightAuto(code).value;
}

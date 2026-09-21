import { DM_Mono } from "next/font/google";

// Scoped to this page only — DM Mono isn't part of the shared topo theme
// (which standardizes on Fira Code for `mono`), so it's loaded and applied
// locally rather than changing the design system's global font token.
export const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
});

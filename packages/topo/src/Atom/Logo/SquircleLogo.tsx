import { type IconProps } from "@chakra-ui/react";
import React from "react";

import { SquircleLogoColor } from "./marks/squircle-color";
import { SquircleLogoWhite } from "./marks/squircle-white";

export interface SquircleLogoProps extends IconProps {
  /**
   * Whether this mark sits over a colour/gradient field — a Wash — (renders
   * the solid white variant) or a white/light ground (renders the
   * full-colour variant) — same convention as `Header`'s own `onWash` prop,
   * since it's answering the same question: what ground is this sitting
   * on. Never driven by colour mode — a mark over a gradient hero stays
   * white even in light mode.
   */
  onWash?: boolean;
}

// The squircle brand mark — "wherever a logo is needed" gets one of these
// two fixed variants, never a single recolorable icon: solid white on top
// of colour, full colour on white. `onWash` picks which.
export const SquircleLogo = ({ onWash = false, ...props }: SquircleLogoProps) =>
  onWash ? <SquircleLogoWhite {...props} /> : <SquircleLogoColor {...props} />;
SquircleLogo.displayName = "SquircleLogo";

export { SquircleLogoColor, SquircleLogoWhite };

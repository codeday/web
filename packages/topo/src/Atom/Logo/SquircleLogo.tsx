import { type IconProps } from "@chakra-ui/react";
import React from "react";

import { SquircleLogoColor } from "./marks/squircle-color";
import { SquircleLogoWhite } from "./marks/squircle-white";

export interface SquircleLogoProps extends IconProps {
  onWash?: boolean;
}

export const SquircleLogo = ({ onWash = false, ...props }: SquircleLogoProps) =>
  onWash ? <SquircleLogoWhite {...props} /> : <SquircleLogoColor {...props} />;
SquircleLogo.displayName = "SquircleLogo";

export { SquircleLogoColor, SquircleLogoWhite };

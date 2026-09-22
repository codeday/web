import { Text } from "@codeday/topo/Atom";
import { useColorModeValue } from "@codeday/topo/Theme";
import React from "react";

import colors from "../../Theme/vars/colors";
import darkColors from "../../Theme/vars/darkColors";

export const Highlight = React.forwardRef<HTMLElement, React.ComponentProps<typeof Text>>(
  (props, ref) => {
    const bandColor = useColorModeValue(colors.yellow[300], darkColors.yellow[300]);
    return (
      <Text
        as="span"
        ref={ref as any}
        fontWeight="bold"
        css={{
          background: `linear-gradient(0deg, transparent 0 6%, ${bandColor} 6% 84%, transparent 84%)`,
          paddingInline: "0.12em",
          borderRadius: "0.05em",
          WebkitBoxDecorationBreak: "clone",
          boxDecorationBreak: "clone",
        }}
        {...props}
      />
    );
  },
);
Highlight.displayName = "Highlight";

import { Text } from "@codeday/topo/Atom";
import React from "react";

// Rewritten from a yellow.100/yellow.800 mode-toggle
// background to the highlight-band: a translucent band with room above and
// below the glyphs (a band ending exactly at the text edge cuts through
// letters), `box-decoration-break: clone` so a wrapped highlight keeps both
// ends.
export const Highlight = React.forwardRef<HTMLElement, React.ComponentProps<typeof Text>>(
  (props, ref) => (
    <Text
      as="span"
      ref={ref as any}
      fontWeight="bold"
      css={{
        background: "linear-gradient(0deg, transparent 0 6%, #F3D983 6% 84%, transparent 84%)",
        paddingInline: "0.12em",
        borderRadius: "0.05em",
        WebkitBoxDecorationBreak: "clone",
        boxDecorationBreak: "clone",
      }}
      {...props}
    />
  ),
);
Highlight.displayName = "Highlight";

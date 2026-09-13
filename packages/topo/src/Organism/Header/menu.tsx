import { reactChildrenMapRecursive } from "@codeday/topo/_utils";
import { Box, type BoxProps } from "@codeday/topo/Atom";
import React from "react";

export default function Menu({ children, ...props }: BoxProps) {
  return (
    <Box {...props}>
      {/* {children} */}
      {reactChildrenMapRecursive(children, (child) =>
        React.cloneElement(child as React.ReactElement, {
          //@ts-ignore
          textDecoration: "none",
          transition: "all 0.5s ease-in-out",
          // .spec.md §4.3 — nav links; a link marks itself active with the
          // standard `aria-current="page"` attribute.
          fontSize: "14px",
          fontWeight: "600",
          opacity: 0.82,
          position: "relative",
          css: {
            '&[aria-current="page"]': {
              opacity: 1,
              textDecoration: "underline",
              textDecorationColor: "currentColor",
              textDecorationThickness: "2px",
              textUnderlineOffset: "7px",
            },
          },
        }),
      )}
    </Box>
  );
}
Menu.displayName = "Menu";

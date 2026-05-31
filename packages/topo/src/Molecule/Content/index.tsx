import { pureRef, type ComponentWithAs } from "@codeday/topo/_utils";
import { Box, type BoxProps } from "@codeday/topo/Atom";
import React from "react";

interface ContentProps extends BoxProps {
  wide?: boolean;
  full?: boolean;
}

const Content: ComponentWithAs<"div", ContentProps> = pureRef<ContentProps, "div">(
  ({ wide, full, ref, ...props }: any) => {
    const boxProps: any = {
      paddingLeft: 3,
      paddingRight: 3,
      marginLeft: "auto",
      marginRight: "auto",
      marginBottom: 6,
      maxW: full ? "none" : wide ? "container.xl" : "container.lg",
      width: "100%",
      ref,
      ...props,
    };
    return <Box {...boxProps} />;
  },
) as ComponentWithAs<"div", ContentProps>;
Content.displayName = "Content";
export { Content, type ContentProps };

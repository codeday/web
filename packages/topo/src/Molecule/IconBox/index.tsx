import {
  childrenOfType,
  makePureBox,
  pureRef,
  setChildProps,
  wrapHtml,
  type ComponentWithAs,
} from "@codeday/topo/_utils";
import { Box, type BoxProps } from "@codeday/topo/Atom";
import React from "react";

export const IconBoxIcon = makePureBox("IconBoxIcon");
export const IconBoxText = makePureBox("IconBoxText");
export const IconBoxBody = makePureBox("Body");

const IconBox: ComponentWithAs<"div", BoxProps> = pureRef<BoxProps, "div">(
  ({ children, ref, ...props }: any) => {
    const headerIcon = childrenOfType(children, IconBoxIcon);
    const headerText = childrenOfType(children, IconBoxText);
    const body = childrenOfType(children, IconBoxBody);
    const boxProps: any = {
      borderWidth: 1,
      borderRadius: 3,
      padding: 4,
      ref,
      ...props,
    };
    return (
      <Box {...boxProps}>
        {React.Children.map(
          wrapHtml(headerIcon) as React.ReactElement[],
          setChildProps(null, {
            fontSize: "5xl",
            marginBottom: 1,
            color: "current.primary",
            lineHeight: 0,
          }),
        )}
        {React.Children.map(
          wrapHtml(headerText) as React.ReactElement[],
          setChildProps(null, {
            fontFamily: "accent",
            fontSize: "3xl",
            marginBottom: 2,
          }),
        )}
        {React.Children.map(
          wrapHtml(body) as React.ReactElement[],
          setChildProps(null, { color: "current.textLight" }),
        )}
      </Box>
    );
  },
) as ComponentWithAs<"div", BoxProps>;
export { IconBox };

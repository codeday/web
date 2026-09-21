import { type ComponentWithAs } from "@codeday/topo/_utils";
import React from "react";

import { P as Text } from "./Text";

interface CodeProps {
  fontFamily?: string;
  p?: number;
  paddingTop?: number;
  paddingBottom?: number;
  rounded?: string;
  display?: string;
  bg?: string;
  borderColor?: string;
  borderWidth?: number;
  fontSize?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

const Code: ComponentWithAs<"p", CodeProps> = (({ children, ref, ...props }: any) => (
  // `gray.100` is mode-aware (see Theme/vars/darkColors.ts) — no manual
  // light/dark switch needed.
  <Text
    {...props}
    fontFamily="mono"
    p={2}
    paddingTop={1}
    paddingBottom={1}
    rounded="sm"
    display="inline"
    bg="gray.100"
    borderColor="gray.100"
    borderWidth={1}
    fontSize="0.9em"
    ref={ref as any}
  >
    {children}
  </Text>
)) as ComponentWithAs<"p", CodeProps>;

Code.displayName = "Code";
export { Code, type CodeProps };

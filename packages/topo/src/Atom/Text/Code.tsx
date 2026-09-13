import { type ComponentWithAs } from "@codeday/topo/_utils";
import { useColorModeValue } from "@codeday/topo/Theme";
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

const Code: ComponentWithAs<"p", CodeProps> = (({ children, ref, ...props }: any) => {
    // gray.50/.800 no longer exist in the new six-stop scale
    // (100/300/500/600/700/900) — repointed to the nearest stop by role.
    const bg = useColorModeValue("gray.100", "gray.700");
    const borderColor = useColorModeValue("gray.100", "gray.700");
    return (
      <Text
        {...props}
        fontFamily="mono"
        p={2}
        paddingTop={1}
        paddingBottom={1}
        rounded="sm"
        display="inline"
        bg={bg}
        borderColor={borderColor}
        borderWidth={1}
        fontSize="0.9em"
        ref={ref as any}
      >
        {children}
      </Text>
    );
}) as ComponentWithAs<"p", CodeProps>;

Code.displayName = "Code";
export { Code, type CodeProps };

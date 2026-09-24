import { Box, type BoxProps } from "@codeday/topo/Atom";
import { useColorModeValue } from "@codeday/topo/Theme";
import React from "react";
export { Skeleton, SkeletonCircle, SkeletonText } from "@chakra-ui/react";

export const Skelly = (props: BoxProps) => (
  <Box
    grad={useColorModeValue("skelly", "darkSkelly")}
    height="1em"
    backgroundSize="200% 100%"
    marginBottom={1}
    borderRadius="sm"
    animation="skelly-load 1.4s linear infinite"
    {...props}
  />
);
Skelly.displayName = "Skelly";

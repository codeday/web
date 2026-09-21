import { EmptyState as ChakraEmptyState } from "@chakra-ui/react";
import React from "react";

import { useGrainOverlay } from "../../Theme/vars/grain";

// EmptyState's field gets the same grain treatment as any other field
// (Card/StatTile), which a static recipe can't add.
export const EmptyStateRoot = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof ChakraEmptyState.Root>
>(({ children, ...props }, forwardedRef) => {
  const { containerRef, canvas } = useGrainOverlay("empty-state");
  return (
    <ChakraEmptyState.Root
      ref={(node: HTMLDivElement | null) => {
        containerRef(node);
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef)
          (forwardedRef as React.RefObject<HTMLDivElement | null>).current = node;
      }}
      {...props}
    >
      {children}
      {canvas}
    </ChakraEmptyState.Root>
  );
});
EmptyStateRoot.displayName = "EmptyStateRoot";

export const EmptyState: typeof ChakraEmptyState = {
  ...ChakraEmptyState,
  Root: EmptyStateRoot,
};

import {
  Box,
  type BoxProps,
  CloseButton,
  Dialog as ChakraDialog,
  type DialogRootProps,
} from "@chakra-ui/react";
import React from "react";

import { useGrainOverlay } from "../../Theme/vars/grain";

export const Modal = React.forwardRef<HTMLDivElement, DialogRootProps>((props, ref) => (
  <ChakraDialog.Root {...props}>
    <ChakraDialog.Backdrop />
    <ChakraDialog.Positioner>
      <ChakraDialog.Content ref={ref} colorPalette="chilioil">
        {props.children}
      </ChakraDialog.Content>
    </ChakraDialog.Positioner>
  </ChakraDialog.Root>
));
Modal.displayName = "Modal";

export const ModalHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof ChakraDialog.Header>
>(({ children, ...props }, forwardedRef) => {
  const { containerRef, canvas } = useGrainOverlay("modal-header");
  return (
    <ChakraDialog.Header
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
    </ChakraDialog.Header>
  );
});
ModalHeader.displayName = "ModalHeader";

export const ModalTitle = ChakraDialog.Title;
export const ModalBody = ChakraDialog.Body;
export const ModalFooter = ChakraDialog.Footer;
export const ModalCloseTrigger = ChakraDialog.CloseTrigger;
export const ModalCloseButton = () => (
  <ChakraDialog.CloseTrigger asChild>
    <CloseButton size="sm" position="absolute" top="3" insetEnd="3" />
  </ChakraDialog.CloseTrigger>
);
export const ModalTrigger = ChakraDialog.Trigger;

export const ModalActions = React.forwardRef<HTMLDivElement, BoxProps>((props, ref) => (
  <Box ref={ref} marginTop="3.5" display="flex" gap="2" {...props} />
));
ModalActions.displayName = "ModalActions";

import { CloseButton, Dialog as ChakraDialog, type DialogRootProps } from "@chakra-ui/react";
import React from "react";

import { useFieldGrain } from "../../Theme/vars/grain";

// .spec.md §4.5 — Modal, built on Chakra v3's Dialog (v3's renamed Modal;
// Topo didn't have one before — the app used react-responsive-modal
// directly). Follows Card's "heading in the field" rule.
export const Modal = React.forwardRef<HTMLDivElement, DialogRootProps>((props, ref) => (
  <ChakraDialog.Root {...props}>
    <ChakraDialog.Backdrop />
    <ChakraDialog.Positioner>
      <ChakraDialog.Content ref={ref} colorPalette="hibiscus">
        {props.children}
      </ChakraDialog.Content>
    </ChakraDialog.Positioner>
  </ChakraDialog.Root>
));
Modal.displayName = "Modal";

export const ModalHeader = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof ChakraDialog.Header>>(
  ({ css, ...props }, forwardedRef) => {
    const { ref: grainRef, overlayCss } = useFieldGrain(0.07, 0.5, "modal-header");
    return (
      <ChakraDialog.Header
        ref={(node: HTMLDivElement | null) => {
          grainRef(node);
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) (forwardedRef as React.RefObject<HTMLDivElement | null>).current = node;
        }}
        css={{ ...overlayCss, ...(css as object) }}
        {...props}
      />
    );
  },
);
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

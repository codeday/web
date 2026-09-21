import {
  Box,
  Button,
  Modal,
  ModalActions,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  ModalTitle,
} from "@codeday/topo/Atom";
import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState } from "react";

const meta: Meta<typeof Modal> = {
  title: "Atom/Modal",
  component: Modal,
};
export default meta;

type Story = StoryObj<typeof Modal>;

function ModalDemo() {
  const [open, setOpen] = useState(false);
  return (
    <Box display="flex" flexWrap="wrap" gap={4} alignItems="flex-start">
      <Button size="sm" onClick={() => setOpen(true)}>
        Open modal
      </Button>
      <Modal open={open} onOpenChange={(d: any) => setOpen(d.open)}>
        <ModalHeader>
          <ModalTitle>Withdraw from CodeDay?</ModalTitle>
        </ModalHeader>
        <ModalBody>
          This releases your spot to someone on the waitlist. You can re-register later if space
          opens up.
          <ModalActions>
            <Button size="sm" variant="dangerSolid" onClick={() => setOpen(false)}>
              Withdraw
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
              Keep my slot
            </Button>
          </ModalActions>
        </ModalBody>
        <ModalCloseButton />
      </Modal>
    </Box>
  );
}

export const HeadingInFieldSameRuleAsCard: Story = {
  name: "Modal (heading in the field, same rule as Card)",
  render: () => <ModalDemo />,
};

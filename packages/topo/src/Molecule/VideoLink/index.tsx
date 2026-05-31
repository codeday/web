import { Box } from "@codeday/topo/Atom";
import React, { useState, ReactNode } from "react";
import { Modal } from "react-responsive-modal";

import { VideoPlayer } from "../VideoPlayer";

interface VideoLinkProps {
  children?: ReactNode;
  [key: string]: any;
}

export function VideoLink({ children, ...props }: VideoLinkProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <VideoPlayer {...props} />
      </Modal>
      <Box cursor="pointer" onClick={() => setModalOpen(true)}>
        {children}
      </Box>
    </>
  );
}

export type { VideoLinkProps };

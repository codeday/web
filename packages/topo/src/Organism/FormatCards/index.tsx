import {
  Box,
  type BoxProps,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  ModalTitle,
} from "@codeday/topo/Atom";
import { ActionLink } from "@codeday/topo/Molecule";
import React, { useState } from "react";

import { type GradientName } from "../../Theme/vars/colors";
import { SQUIRCLE_CORNER_SHAPE } from "../../Theme/vars/cornerShape";
import { buildGradientTokens } from "../../Theme/vars/gradients";
import { useGrainOverlay } from "../../Theme/vars/grain";
import type { Message } from "../../utils";

export interface FormatActionInfo {
  heading: Message;
  body: Message;
}

export interface FormatAction {
  label: Message;
  href?: string;
  info?: FormatActionInfo;
}

export interface FormatRoute {
  id: string;
  label: Message;
  detail: Message;
  action?: FormatAction;
}

export type FormatDepth = "flat" | "modal" | "rail";

export interface FormatCard {
  id: string;
  duration: Message;
  name: Message;
  body: Message;
  depth: FormatDepth;
  routes?: FormatRoute[];
  actions?: FormatAction[];
  span?: number;
}

export interface FormatCardsProps extends Omit<BoxProps, "children"> {
  ramp: GradientName;
  cards: FormatCard[];
}

const GRADIENT_TOKENS = buildGradientTokens();

function CardHeaderField({ card, ramp }: { card: FormatCard; ramp: GradientName }) {
  const tokens = GRADIENT_TOKENS[ramp];
  const { containerRef, canvas } = useGrainOverlay(`format-card-${card.id}`);

  const isFlat = card.depth === "flat";
  const backgroundColor = isFlat ? "colorPalette.600" : undefined;
  const backgroundImage =
    card.depth === "modal"
      ? `radial-gradient(120% 130% at 22% 14%, ${tokens.modal})`
      : card.depth === "rail"
        ? `radial-gradient(120% 130% at 22% 14%, ${tokens.rail})`
        : undefined;
  const textColor = isFlat ? "white" : "trueWhite";
  const subTextColor = isFlat ? "{colors.white/90}" : "whiteAlpha.900";

  return (
    <Box
      ref={containerRef as any}
      position="relative"
      overflow="hidden"
      minHeight="20"
      padding="{spacing.4} {spacing.4} {spacing.3.5}"
      display="flex"
      flexDirection="column"
      justifyContent="flex-end"
      backgroundColor={backgroundColor}
      backgroundImage={backgroundImage}
    >
      <Box fontSize="xl" fontWeight="800" color={textColor} letterSpacing="tight">
        {card.duration}
      </Box>
      <Box marginTop="0.5" fontSize="sm" fontWeight="600" color={subTextColor}>
        {card.name}
      </Box>
      {canvas}
    </Box>
  );
}

function RouteRow({ route }: { route: FormatRoute }) {
  return (
    <Box
      display="flex"
      alignItems="baseline"
      justifyContent="space-between"
      gap="3"
      paddingBlock="2.5"
      borderTop="sm"
      borderTopColor="colorPalette.300"
      _first={{ borderTop: "none" }}
    >
      <Box minWidth="0">
        <Box fontSize="sm" fontWeight="700" color="black">
          {route.label}
        </Box>
        <Box marginTop="0.5" fontSize="sm" color="gray.700">
          {route.detail}
        </Box>
      </Box>
      {route.action && (
        <Box flexShrink={0}>
          <ActionLink label={route.action.label} href={route.action.href} fontSize="sm" />
        </Box>
      )}
    </Box>
  );
}

function ActionInfoTrigger({ label, info }: { label: Message; info: FormatActionInfo }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <ActionLink label={label} fontSize="sm" onClick={() => setOpen(true)} />
      <Modal open={open} onOpenChange={(d: { open: boolean }) => setOpen(d.open)}>
        <ModalHeader>
          <ModalTitle>{info.heading}</ModalTitle>
        </ModalHeader>
        <ModalBody>{info.body}</ModalBody>
        <ModalCloseButton />
      </Modal>
    </>
  );
}

function CardView({ card, ramp }: { card: FormatCard; ramp: GradientName }) {
  return (
    <Box
      colorPalette={ramp}
      display="flex"
      flexDirection="column"
      border="sm"
      borderColor="current.border"
      borderRadius="md"
      overflow="hidden"
      background="colorPalette.50"
      css={{ cornerShape: SQUIRCLE_CORNER_SHAPE }}
    >
      <CardHeaderField card={card} ramp={ramp} />
      <Box
        padding="{spacing.3.5} {spacing.4} {spacing.4}"
        display="flex"
        flexDirection="column"
        flex="1"
      >
        <Box fontSize="sm" color="gray.700">
          {card.body}
        </Box>
        {card.routes && card.routes.length > 0 && (
          <Box marginTop="3">
            {card.routes.map((route) => (
              <RouteRow key={route.id} route={route} />
            ))}
          </Box>
        )}
        {card.actions && card.actions.length > 0 && (
          <Box marginTop="3.5" display="flex" flexDirection="column" gap="1.5">
            {card.actions.map((action, i) =>
              action.info ? (
                <ActionInfoTrigger key={i} label={action.label} info={action.info} />
              ) : (
                <ActionLink key={i} label={action.label} href={action.href!} fontSize="sm" />
              ),
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export const FormatCards = React.forwardRef<HTMLDivElement, FormatCardsProps>(
  ({ ramp, cards, ...props }, ref) => (
    <Box ref={ref} {...props}>
      <Box
        display="grid"
        gridTemplateColumns={{ base: "1fr", md: cards.map((c) => `${c.span ?? 1}fr`).join(" ") }}
        gap="4"
      >
        {cards.map((card) => (
          <CardView key={card.id} card={card} ramp={ramp} />
        ))}
      </Box>
    </Box>
  ),
);
FormatCards.displayName = "FormatCards";

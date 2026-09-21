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
  /** Omit when `info` is set — the action opens an info popup instead of navigating. */
  href?: string;
  info?: FormatActionInfo;
}

export interface FormatRoute {
  id: string;
  label: Message;
  detail: Message;
  action?: FormatAction;
}

/** How much of the ramp the header field carries. */
export type FormatDepth = "flat" | "modal" | "rail";

export interface FormatCard {
  id: string;
  duration: Message;
  name: Message;
  body: Message;
  depth: FormatDepth;
  /** Renders as hairline-separated rows inside the card body. */
  routes?: FormatRoute[];
  actions?: FormatAction[];
  /** Column width in `fr`. Default 1. */
  span?: number;
}

export interface FormatCardsProps extends Omit<BoxProps, "children"> {
  ramp: GradientName;
  cards: FormatCard[];
}

// One definition of every ramp's stop lists, shared with `gradients.test.ts`
// (which asserts every one of these — `mid` (now `colorPalette.600`),
// `modal`, `rail` — holds white at 4.5:1 for every ramp except Marmalade) —
// never re-derived here.
const GRADIENT_TOKENS = buildGradientTokens();

// Radial, not linear: the system assigns radial geometry (deep anchor in one
// corner) to cards and tiles; linear angles are for slides, bands and
// strips (see `Wash`). The stop-count ladder itself — `mid` alone, then
// 20/62, then 0/20/40/62 — IS the escalation; the geometry stays fixed.
function CardHeaderField({ card, ramp }: { card: FormatCard; ramp: GradientName }) {
  const tokens = GRADIENT_TOKENS[ramp];
  const { containerRef, canvas } = useGrainOverlay(`format-card-${card.id}`);

  // `flat` is a plain `colorPalette.600` fill — a real token, so it inverts
  // in dark mode along with everything else, and its label needs to invert
  // right along with it (self-inverting `white`, not a fixed `trueWhite`).
  // `modal`/`rail` are raw gradients (`buildGradientTokens()`'s hex-stop
  // strings), never mode-aware, so their label stays fixed.
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

// A route inside Micro-Internship (or any future multi-route card): label +
// detail on the left, its action link on the right. Hairline above every
// row but the first — same treatment `RowList` uses, at this card's own 22%
// alpha rather than RowList's 18%.
function RouteRow({ route }: { route: FormatRoute }) {
  return (
    <Box
      display="flex"
      alignItems="baseline"
      justifyContent="space-between"
      gap="3"
      paddingBlock="2.5"
      borderTop="sm"
      // `colorPalette.300` (mode-aware, unlike the old `deep/22`
      // alpha-blend) stays a faint-but-visible hairline in both modes.
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

// An action that opens a full popup with more detail, instead of navigating
// — e.g. Residency's "By invitation only", which explains the invitation
// rather than linking anywhere. Owns its own open state since each trigger
// is independent of its siblings.
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
        {/* Not clamped — these cards carry the full sentence. */}
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

// Three cards, escalating how much of the ramp their header field carries
// (`flat` → `modal` → `rail`) — the stop-count ladder IS the hierarchy, not
// a decorative choice. All three hold white body copy at 4.5:1 across the
// ENTIRE field for every ramp, including Marmalade (see `gradients.test.ts`).
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

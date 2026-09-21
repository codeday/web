import * as m from "@codeday/i18n/messages";
import { Box } from "@codeday/topo/Atom";
import { Content } from "@codeday/topo/Molecule";
import React, { useEffect, useState } from "react";

import type { PublicationType } from "../../lib/research/types";
import { dmMono } from "./fonts";

// The site header is itself `position: sticky; top: 0`, so a plain
// `top: 0` here would stick the filter bar directly behind it. The header
// starts at the very top of the page (nothing scrolls above it), so its
// resting/stuck screen position is already correct at mount — no need to
// wait for a scroll event, just measure once and on resize/breakpoint change.
function useHeaderBottom(): number {
  const [bottom, setBottom] = useState(0);
  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return undefined;
    const measure = () => setBottom(header.getBoundingClientRect().bottom);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(header);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);
  return bottom;
}

export type TypeFilter = "all" | PublicationType;

const TYPE_ORDER: { value: TypeFilter; label: () => string }[] = [
  { value: "all", label: m.www_research_filter_all },
  { value: "paper", label: m.www_research_filter_peer_reviewed },
  { value: "preprint", label: m.www_research_filter_preprints },
  { value: "report", label: m.www_research_filter_reports },
  { value: "talk", label: m.www_research_filter_talks },
  { value: "dataset", label: m.www_research_filter_datasets },
];

export interface FilterBarProps {
  typeCounts: Record<TypeFilter, number>;
  type: TypeFilter;
  onTypeChange: (value: TypeFilter) => void;
  topics: string[];
  topic: string;
  onTopicChange: (value: string) => void;
}

export default function FilterBar({
  typeCounts,
  type,
  onTypeChange,
  topics,
  topic,
  onTopicChange,
}: FilterBarProps) {
  const headerBottom = useHeaderBottom();

  return (
    // The gap above the bar needs to be solid on its own, not a window onto
    // whatever's scrolling underneath — the header's own wrapper is already
    // fading toward transparent by the time it reaches this far down (see
    // Page/index.tsx), so leaving the gap to that backdrop let scrolled
    // content show through. Sticking THIS wrapper flush with the header
    // (no gap in its own `top`) and painting the gap as solid `current.bg`
    // `paddingTop` inside it means the gap is opaque (page background, in
    // either colour mode) in front of everything, every time — the bar
    // reads as attached to it, not floating over a see-through notch.
    <Box
      position="sticky"
      top={headerBottom ? `${headerBottom}px` : "env(safe-area-inset-top, 0px)"}
      // Above the header's own sticky wrapper (zIndex 30) — that wrapper's
      // bottom padding fades out over roughly the same band this bar sticks
      // into, and at the lower zIndex this bar used to sit BEHIND that
      // fade instead of in front of it.
      zIndex="31"
      bg="current.bg"
      // Gap between the header's own bottom edge and this bar once both are
      // stuck — purely cosmetic breathing room, not needed for the header's
      // grain canvas or anything functional.
      paddingTop="4"
    >
      <Box
        data-testid="filter-bar"
        // Plain opaque background — a fade painted INSIDE the box reads as
        // a shadow inside the bar. A real cast shadow belongs outside the
        // box, below the bottom rule, the way a sticky toolbar actually
        // shadows the content scrolling under it.
        bg="{colors.current.bg/94}"
        css={{ backdropFilter: "blur({blurs.md})" }}
        boxShadow="0 8px 12px -8px rgba(20,10,10,.22)"
        borderTop="sm"
        borderTopColor="colorPalette.300"
        borderBottom="sm"
        borderBottomColor="current.border"
        paddingBlock="3"
      >
        <Content
          maxW="container.xl"
          marginBottom="0"
          paddingInline={{ base: "5", md: "12", xl: "32" }}
          display="flex"
          flexWrap="wrap"
          alignItems="center"
          gap="2.5"
        >
          <Box display="flex" flexWrap="wrap" gap="2">
            {TYPE_ORDER.map(({ value, label }) => {
              const pressed = type === value;
              return (
                <Box
                  as="button"
                  key={value}
                  aria-pressed={pressed}
                  onClick={() => onTypeChange(value)}
                  {...({ type: "button" } as any)}
                  display="inline-flex"
                  alignItems="center"
                  gap="1.5"
                  fontSize="sm"
                  fontWeight="600"
                  paddingInline="3"
                  paddingBlock="2"
                  borderRadius="full"
                  borderWidth="1.5px"
                  borderColor={pressed ? "colorPalette.600" : "gray.300"}
                  bg={pressed ? "colorPalette.600" : "transparent"}
                  color={pressed ? "white" : "gray.700"}
                  cursor="pointer"
                >
                  {label()}
                  <Box as="span" fontFamily={dmMono.style.fontFamily} fontSize="xs" opacity={0.75}>
                    {typeCounts[value]}
                  </Box>
                </Box>
              );
            })}
          </Box>

          <Box flex="1" />

          <Box
            as="select"
            {...({
              value: topic,
              onChange: (e: React.ChangeEvent<HTMLSelectElement>) => onTopicChange(e.target.value),
            } as any)}
            fontSize="sm"
            paddingInline="2.5"
            paddingBlock="2"
            borderRadius="lg"
            borderWidth="1.5px"
            borderColor="current.border"
            bg="current.bg"
          >
            <option value="">{m.www_research_filter_all_topics()}</option>
            {topics.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Box>
        </Content>
      </Box>
    </Box>
  );
}

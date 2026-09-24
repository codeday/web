import * as m from "@codeday/i18n/messages";
import { Box } from "@codeday/topo/Atom";
import { Content } from "@codeday/topo/Molecule";
import React, { useEffect, useState } from "react";

import type { PublicationType } from "../../lib/research/types";
import { dmMono } from "./fonts";

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
    <Box
      position="sticky"
      top={headerBottom ? `${headerBottom}px` : "env(safe-area-inset-top, 0px)"}
      zIndex="31"
      bg="current.bg"
      paddingTop="4"
    >
      <Box
        data-testid="filter-bar"
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

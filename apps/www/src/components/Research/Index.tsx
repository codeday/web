import * as m from "@codeday/i18n/messages";
import { Box } from "@codeday/topo/Atom";
import { CONTENT_INSET, Content } from "@codeday/topo/Molecule";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";

import type { Publication, PublicationType } from "../../lib/research/types";
import FilterBar, { type TypeFilter } from "./FilterBar";
import { dmMono } from "./fonts";
import Row from "./Row";

export interface ResearchIndexProps {
  publications: Publication[];
}

function YearGroup({
  year,
  items,
  isFirst,
}: {
  year: number;
  items: Publication[];
  isFirst: boolean;
}) {
  return (
    <Box
      display="grid"
      gridTemplateColumns={{ base: "1fr", md: "{sizes.28} 1fr" }}
      columnGap="7"
      borderTop="sm"
      borderTopColor="black"
      marginBlockStart={isFirst ? "0" : "9"}
      paddingTop="2.5"
      id={`y-${year}`}
      scrollMarginTop="20"
    >
      <Box display="flex" alignItems="baseline" gap="2" marginBlockEnd={{ base: "2", md: "0" }}>
        <Box as="span" fontFamily={dmMono.style.fontFamily} fontSize="sm" letterSpacing="wider">
          {year}
        </Box>
        <Box as="span" fontSize="2xs" textTransform="uppercase" color="gray.600">
          {items.length === 1
            ? m.www_research_filter_count_one({ count: items.length })
            : m.www_research_filter_count({ count: items.length })}
        </Box>
      </Box>
      <Box>
        {items.map((pub, i) => (
          <Row key={pub.id} publication={pub} first={i === 0} />
        ))}
      </Box>
    </Box>
  );
}

export default function ResearchIndex({ publications }: ResearchIndexProps) {
  const router = useRouter();
  const [type, setType] = useState<TypeFilter>("all");
  const [topic, setTopic] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (hydrated || !router.isReady) return;
    const q = router.query;
    if (typeof q.type === "string") setType(q.type as TypeFilter);
    if (typeof q.topic === "string") setTopic(q.topic);
    setHydrated(true);
  }, [router.isReady, router.query, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    const nextQuery: Record<string, string> = {};
    if (type !== "all") nextQuery.type = type;
    if (topic) nextQuery.topic = topic;
    router.replace({ pathname: router.pathname, query: nextQuery }, undefined, { shallow: true });
  }, [type, topic, hydrated]);

  const typeCounts = useMemo(() => {
    const counts: Record<TypeFilter, number> = {
      all: publications.length,
      paper: 0,
      preprint: 0,
      report: 0,
      talk: 0,
      dataset: 0,
    };
    publications.forEach((p) => {
      counts[p.type as PublicationType] += 1;
    });
    return counts;
  }, [publications]);

  const topics = useMemo(() => {
    const set = new Set<string>();
    publications.forEach((p) => p.topics.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [publications]);

  const filtered = useMemo(
    () =>
      publications.filter(
        (p) => (type === "all" || p.type === type) && (!topic || p.topics.includes(topic)),
      ),
    [publications, type, topic],
  );

  const grouped = useMemo(() => {
    const map = new Map<number, Publication[]>();
    filtered.forEach((p) => {
      if (!map.has(p.year)) map.set(p.year, []);
      map.get(p.year)!.push(p);
    });
    return Array.from(map.entries()).sort((a, b) => b[0] - a[0]);
  }, [filtered]);

  return (
    <Box id="index" scrollMarginTop="20">
      <FilterBar
        typeCounts={typeCounts}
        type={type}
        onTypeChange={setType}
        topics={topics}
        topic={topic}
        onTopicChange={setTopic}
      />
      <Content
        aria-live="polite"
        maxW="container.xl"
        marginBottom="0"
        paddingBlockStart="2"
        paddingInline={CONTENT_INSET}
      >
        {grouped.length === 0 ? (
          <Box textAlign="center" color="gray.600" paddingBlock="12">
            {m.www_research_empty()}
          </Box>
        ) : (
          grouped.map(([year, items], i) => (
            <YearGroup key={year} year={year} items={items} isFirst={i === 0} />
          ))
        )}
      </Content>
    </Box>
  );
}

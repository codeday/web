import * as m from "@codeday/i18n/messages";
import { baseLocale } from "@codeday/i18n/runtime";
import { Box } from "@codeday/topo/Atom";
import { PullQuote } from "@codeday/topo/Organism";
import { ResultOf } from "@graphql-typed-document-node/core";
import shuffle from "knuth-shuffle-seeded";
import React, { useEffect, useMemo, useState } from "react";

import { graphql } from "@/gql";
import { FragmentType, useFragment } from "@/gql/fragment-masking";

import { useSlideshow } from "../../providers";

// Mirrors `Index/Quote.tsx`'s fade timing/pattern, applied per-column below
// so the maintainer and employer quotes can cycle independently.
const QUOTE_DURATION_MS = 14_000;
const FADE_MS = 500;

export const EvidenceFragment = graphql(`
  fragment MicroInternshipEvidenceComponent on Query {
    labs {
      statOutcomes {
        studentCount
        studentHours
        prCount
      }
    }
    cms {
      maintainerTestimonials: testimonials(
        where: { featured: true, type_in: ["Maintainer"] }
        limit: 10
      ) {
        items {
          quote
          firstName
          lastName
          title
          company
          program {
            name
          }
        }
      }
      employerTestimonials: testimonials(
        where: { featured: true, type_in: ["Employer"] }
        limit: 10
      ) {
        items {
          quote
          firstName
          lastName
          title
          company
          program {
            name
          }
        }
      }
    }
  }
`);

// Same SSR/hydration rationale as `Index/Stats.tsx`'s `formatCount`: the
// visitor's own locale can't be used here since this renders during SSR too.
const formatCount = (value: number) => new Intl.NumberFormat(baseLocale).format(value);

interface Stat {
  value: React.ReactNode;
  label: React.ReactNode;
}

function StatColumn({ stat }: { stat: Stat }) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="2"
      paddingTop="5"
      borderTop="sm"
      borderTopColor="current.border"
    >
      <Box fontSize="6xl" lineHeight="1" fontWeight="800">
        {stat.value}
      </Box>
      <Box fontSize="md" color="gray.700">
        {stat.label}
      </Box>
    </Box>
  );
}

type EvidenceData = ResultOf<typeof EvidenceFragment>;
type TestimonialItem = NonNullable<EvidenceData["cms"]["maintainerTestimonials"]["items"][number]>;

interface FadingTestimonialProps {
  items: TestimonialItem[];
  seed?: any;
  tag: React.ReactNode;
}

function FadingTestimonial({ items, seed, tag }: FadingTestimonialProps) {
  const quotes = useMemo(
    () =>
      shuffle(
        items.filter((t): t is TestimonialItem => !!t?.quote),
        seed,
      ),
    [items, seed],
  );

  const activeIndex = useSlideshow(quotes.length, QUOTE_DURATION_MS);

  // Lags one fade behind `activeIndex`, same as `Index/Quote.tsx` — the
  // outgoing quote fades out, its content swaps while invisible, then the
  // incoming one fades in, rather than cutting straight to the new text.
  const [shownIndex, setShownIndex] = useState(activeIndex);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (activeIndex === shownIndex) return undefined;
    setVisible(false);
    const timeout = setTimeout(() => {
      setShownIndex(activeIndex);
      setVisible(true);
    }, FADE_MS);
    return () => clearTimeout(timeout);
  }, [activeIndex, shownIndex]);

  if (quotes.length === 0) return null;
  const t = quotes[shownIndex];

  return (
    <Box opacity={visible ? 1 : 0} transition={`opacity ${FADE_MS}ms ease-in-out`}>
      <PullQuote
        ramp="blackberry"
        size="feature"
        quote={t.quote}
        quoteFontSize="clamp({fontSizes.lg}, 2.4vw, {fontSizes.2xl})"
        name={[t.firstName, t.lastName].filter(Boolean).join(" ") || undefined}
        role={t.title || undefined}
        project={t.company || t.program?.name || undefined}
        tag={tag}
      />
    </Box>
  );
}

interface EvidenceProps {
  data: FragmentType<typeof EvidenceFragment>;
  seed?: any;
}

export default function Evidence({ data, seed }: EvidenceProps) {
  const { labs, cms } = useFragment(EvidenceFragment, data);

  const stats: Stat[] = [
    {
      value: formatCount(labs.statOutcomes.studentCount),
      label: m.www_microinternship_evidence_stat1_label(),
    },
    {
      value: formatCount(labs.statOutcomes.studentHours),
      label: m.www_microinternship_evidence_stat2_label(),
    },
    {
      value: formatCount(labs.statOutcomes.prCount),
      label: m.www_microinternship_evidence_stat3_label(),
    },
  ];

  return (
    <Box display="flex" flexDirection="column" gap="10">
      <Box display="grid" gridTemplateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap="8">
        {stats.map((stat, i) => (
          <StatColumn key={i} stat={stat} />
        ))}
      </Box>

      <Box display="grid" gridTemplateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap="5">
        <FadingTestimonial
          items={cms.maintainerTestimonials.items.filter((t): t is TestimonialItem => !!t)}
          seed={seed}
          tag={m.www_microinternship_evidence_quote_maintainer_label()}
        />
        <FadingTestimonial
          items={cms.employerTestimonials.items.filter((t): t is TestimonialItem => !!t)}
          seed={seed}
          tag={m.www_microinternship_evidence_quote_employer_label()}
        />
      </Box>
    </Box>
  );
}

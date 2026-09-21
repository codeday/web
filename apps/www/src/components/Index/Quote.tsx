import * as m from "@codeday/i18n/messages";
import { Box } from "@codeday/topo/Atom";
import { PullQuote } from "@codeday/topo/Organism";
import type { Message } from "@codeday/topo/utils";
import shuffle from "knuth-shuffle-seeded";
import React, { useEffect, useMemo, useState } from "react";

import { graphql } from "@/gql";
import { FragmentType, useFragment } from "@/gql/fragment-masking";

import { useSlideshow } from "../../providers";

// A feature-size quote can run several wrapped lines — this holds much
// longer than the logo wall's single-word mark rotation so there's time to
// actually read it before it cycles.
const QUOTE_DURATION_MS = 14_000;
const FADE_MS = 500;

// Rendered as a second citation line below name/role/project, not as the
// `eyebrow` above the quote — see `PullQuote`'s `tag` prop. Shared with
// `MicroInternship/Evidence.tsx`, which uses the same two labels.
const LABEL_BY_TYPE: Record<string, () => Message> = {
  Employer: m.www_microinternship_evidence_quote_employer_label,
  Maintainer: m.www_microinternship_evidence_quote_maintainer_label,
};

export const QuoteFragment = graphql(`
  fragment IndexQuoteComponent on Query {
    cms {
      quoteTestimonials: testimonials(
        where: { featured: true, type_in: ["Employer", "Maintainer"] }
        limit: 20
      ) {
        items {
          quote
          firstName
          lastName
          title
          company
          type
          program {
            name
          }
        }
      }
    }
  }
`);

interface QuoteProps {
  data: FragmentType<typeof QuoteFragment>;
  seed?: any;
  [key: string]: any;
}

export default function Quote({ data, seed, ...props }: QuoteProps) {
  const { cms } = useFragment(QuoteFragment, data);

  const quotes = useMemo(
    () =>
      shuffle(
        (cms.quoteTestimonials?.items || []).filter((t): t is NonNullable<typeof t> => !!t?.quote),
        seed,
      ),
    [cms.quoteTestimonials, seed],
  );

  const activeIndex = useSlideshow(quotes.length, QUOTE_DURATION_MS);

  // Lags one fade behind `activeIndex`: the outgoing quote fades out, its
  // content swaps while invisible, then the incoming one fades in. A
  // feature quote can wrap several lines, so a straight cut on swap would
  // be jarring in a way it isn't for the logo wall's single-mark fade.
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
    <Box
      minHeight="300px"
      opacity={visible ? 1 : 0}
      transition={`opacity ${FADE_MS}ms ease-in-out`}
      {...props}
    >
      <PullQuote
        size="feature"
        ramp="chilioil"
        quote={t.quote}
        quoteFontSize="clamp({fontSizes.lg}, 2.4vw, {fontSizes.2xl})"
        name={[t.firstName, t.lastName].filter(Boolean).join(" ")}
        role={t.title || undefined}
        project={t.company || t.program?.name || undefined}
        tag={t.type ? LABEL_BY_TYPE[t.type]?.() : undefined}
      />
    </Box>
  );
}

import { Box } from "@codeday/topo/Atom";
import { PullQuote, type PullQuoteProps } from "@codeday/topo/Organism";
import shuffle from "knuth-shuffle-seeded";
import React from "react";

import { graphql } from "@/gql";
import { FragmentType, useFragment } from "@/gql/fragment-masking";

const SHOWN = 6;

export const StudentTestimonialFragment = graphql(`
  fragment StudentTestimonialsComponent on CmsTestimonial {
    sys {
      id
    }
    quote
    firstName
    lastName
    groupName
    region {
      name
    }
  }
`);

type StudentTestimonialRef = FragmentType<typeof StudentTestimonialFragment>;

interface StudentTestimonialsProps {
  testimonials: ReadonlyArray<StudentTestimonialRef | null>;
  seed: number;
  ramp: PullQuoteProps["ramp"];
}

export default function StudentTestimonials({
  testimonials,
  seed,
  ramp,
}: StudentTestimonialsProps) {
  const items = useFragment(
    StudentTestimonialFragment,
    testimonials.filter((t): t is StudentTestimonialRef => !!t),
  );
  const shown = shuffle(
    items.filter((t) => t.quote),
    seed,
  ).slice(0, SHOWN);

  if (shown.length === 0) return null;

  return (
    <Box
      as="ul"
      listStyleType="none"
      margin="0"
      padding="0"
      columnCount={{ base: 1, md: 2, lg: 3 }}
      columnGap="8"
    >
      {shown.map((t) => (
        <Box as="li" key={t.sys.id} breakInside="avoid" paddingBottom="8">
          <PullQuote
            size="feature"
            ramp={ramp}
            quote={t.quote}
            quoteFontSize="lg"
            name={
              [t.firstName, t.lastName]
                .map((part) => part?.trim())
                .filter(Boolean)
                .join(" ") ||
              t.groupName ||
              undefined
            }
            role={t.region?.name || undefined}
          />
        </Box>
      ))}
    </Box>
  );
}

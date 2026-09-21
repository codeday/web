import { HistoryRail, type HistoryEvent } from "@codeday/topo/Organism";
import { DateTime } from "luxon";
import React from "react";

import { graphql } from "@/gql";
import { FragmentType, useFragment } from "@/gql/fragment-masking";

export const HistoryFragment = graphql(`
  fragment IndexHistoryComponent on Query {
    cms {
      milestones(order: [date_ASC], limit: 50) {
        items {
          sys {
            id
          }
          title
          date
        }
      }
    }
  }
`);

interface HistoryProps {
  data: FragmentType<typeof HistoryFragment>;
}

export default function History({ data }: HistoryProps) {
  const { cms } = useFragment(HistoryFragment, data);

  const events: HistoryEvent[] = (cms.milestones?.items || [])
    .filter(
      (item): item is typeof item & { title: string; date: string } =>
        !!item?.title && !!item?.date,
    )
    .map((item) => {
      const date = DateTime.fromISO(item.date);
      return { id: item.sys.id, year: date.year, month: date.month, title: item.title };
    });

  // Milestones come back ordered `date_ASC`, so the earliest event sets the
  // rail's own start — there's no fixed "founding year" to fall back to once
  // this is CMS-driven rather than hardcoded.
  const first = events[0];

  if (!first) return null;

  return <HistoryRail startYear={first.year} startMonth={first.month} events={events} />;
}

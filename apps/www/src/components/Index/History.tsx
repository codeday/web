import * as m from "@codeday/i18n/messages";
import { HistoryRail, type HistoryComparison, type HistoryEvent } from "@codeday/topo/Organism";
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

  const first = events[0];

  if (!first) return null;

  const comparisons: HistoryComparison[] = [
    { id: "appstore", year: 2008, title: m.www_home_history_compare_appstore() },
    { id: "cloud", year: 2014, title: m.www_home_history_compare_cloud() },
    { id: "chatgpt", year: 2022, title: m.www_home_history_compare_chatgpt() },
  ];

  return (
    <HistoryRail
      startYear={first.year}
      startMonth={first.month}
      events={events}
      comparisons={comparisons}
    />
  );
}

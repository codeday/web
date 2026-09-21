import * as m from "@codeday/i18n/messages";
import { baseLocale } from "@codeday/i18n/runtime";
import { formatCompactUsd, StatTrio } from "@codeday/topo/Organism";
import React from "react";

import { graphql } from "@/gql";
import { FragmentType, useFragment } from "@/gql/fragment-masking";

export const StatsFragment = graphql(`
  fragment IndexStatsComponent on Query {
    impact {
      studentCount
      studentLowIncomeCount
      eventCount
      economicEstimated
      economicEstimatedCompare
    }
    cms {
      regions(limit: 1) {
        total
      }
    }
  }
`);

interface StatsProps {
  data: FragmentType<typeof StatsFragment>;
}

// `baseLocale`, not the visitor's own locale — this renders during SSR too,
// and a number formatted with the server's locale but the browser's locale
// on the client is exactly the kind of mismatch that breaks hydration (see
// `formatCompactUsd`'s own note on the same problem).
const formatCount = (value: number) => new Intl.NumberFormat(baseLocale).format(value);

export default function Stats({ data }: StatsProps) {
  const { impact, cms } = useFragment(StatsFragment, data);

  return (
    <StatTrio
      maxWidth="container.lg"
      marginX="auto"
      items={[
        {
          id: "alumni",
          value: impact.studentCount,
          format: "integer",
          label: m.www_home_stats_alumni_label(),
          provenance: m.www_home_stats_alumni_provenance({
            eventCount: formatCount(impact.eventCount),
            citiesCount: formatCount(cms.regions?.total ?? 0),
          }),
        },
        {
          id: "low-income",
          value: (impact.studentLowIncomeCount / impact.studentCount) * 100,
          format: "percent",
          label: m.www_home_stats_lowincome_label(),
          provenance: m.www_home_stats_lowincome_provenance(),
        },
        {
          id: "econ-value",
          value: impact.economicEstimated,
          format: "usd-compact",
          label: m.www_home_stats_econvalue_label(),
          provenance: m.www_home_stats_econvalue_provenance({
            otherNonprofits: formatCompactUsd(impact.economicEstimatedCompare, 0),
          }),
        },
      ]}
    />
  );
}

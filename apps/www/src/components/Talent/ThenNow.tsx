import React, { useMemo } from "react";

import { type AlumCard, ThenNowWall, toCard } from "@/components/Index/ThenNow";
import { graphql } from "@/gql";
import { FragmentType, useFragment } from "@/gql/fragment-masking";

export const TALENT_ALUM_COLUMNS: string[][] = [
  ["Sneha De", "Selynna Sun", "Vivian Shen"],
  ["Siham Argaw", "Kelly Dong", "Kshitij Grover"],
  ["Tam (Jay) Nguyen", "Mingjie Jiang", "Marcelo Morales"],
  ["Jessica Nguyen", "Ashley Garcia-Arellano", "Tejas Manohar"],
];

export const TalentThenNowFragment = graphql(`
  fragment TalentThenNowComponent on Query {
    cms {
      talentAlums: alums(where: { name_in: $talentAlumNames }, limit: 50, locale: $locale) {
        items {
          ...IndexThenNowAlumFields
        }
      }
    }
  }
`);

interface TalentThenNowProps {
  data: FragmentType<typeof TalentThenNowFragment>;
}

export default function TalentThenNow({ data }: TalentThenNowProps) {
  const { cms } = useFragment(TalentThenNowFragment, data);

  const columns = useMemo((): AlumCard[][] => {
    const byName = new Map(
      (cms.talentAlums?.items || [])
        .map(toCard)
        .filter((c): c is AlumCard => c !== null)
        .map((card): [string, AlumCard] => [card.name, card]),
    );
    return TALENT_ALUM_COLUMNS.map((names) =>
      names.map((name) => byName.get(name)).filter((c): c is AlumCard => c !== undefined),
    ).filter((column) => column.length > 0);
  }, [cms.talentAlums]);

  return <ThenNowWall slots={columns} />;
}

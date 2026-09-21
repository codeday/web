import { Link, Image } from "@codeday/topo/Atom";
import { dedupeFirstByKey } from "@codeday/utils";
import React from "react";

import { graphql } from "@/gql";
import { FragmentType, useFragment } from "@/gql/fragment-masking";

export const PreviousCoverageLogosFragment = graphql(`
  fragment PreviousCoverageLogosComponent on Query {
    cms {
      coverageLogos: newsCoverages(where: { featured: true }, order: date_DESC, limit: 20) {
        items {
          publicationName
          publicationLogo {
            url(transform: { width: 200 })
          }
          url
        }
      }
    }
  }
`);

interface PreviousCoverageLogosProps {
  data: FragmentType<typeof PreviousCoverageLogosFragment>;
  num?: number;
  [key: string]: any;
}

export default function PreviousCoverageLogos({
  data,
  num = 5,
  ...props
}: PreviousCoverageLogosProps) {
  const {
    cms: { coverageLogos },
  } = useFragment(PreviousCoverageLogosFragment, data);
  const pubs = dedupeFirstByKey(
    coverageLogos.items.filter((pub: any) => pub.publicationLogo),
    "publicationName",
  ).slice(0, num);

  return (
    <>
      {pubs.map((pub: any) => (
        <Link href={pub.url} target="_blank" rel="noopener" key={pub.url}>
          <Image
            src={pub.publicationLogo.url}
            alt={pub.publicationName}
            display="inline-block"
            {...props}
          />
        </Link>
      ))}
    </>
  );
}

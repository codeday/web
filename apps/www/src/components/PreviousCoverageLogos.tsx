import { Link, Image } from "@codeday/topo/Atom";
import React from "react";

import { usePageData } from "@codeday/topo/Theme";
import { dedupeFirstByKey } from "@codeday/utils";

interface PreviousCoverageLogosProps {
  num?: number;
  [key: string]: any;
}

export default function PreviousCoverageLogos({ num = 5, ...props }: PreviousCoverageLogosProps) {
  const {
    cms: { coverageLogos },
  } = usePageData();
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

import * as m from "@codeday/i18n/messages";
import { Box, Eyebrow, Grid, Image } from "@codeday/topo/Atom";
import { CreditLists } from "@codeday/topo/Organism";
import { dedupeFirstByKey } from "@codeday/utils";
import React from "react";

import { graphql } from "@/gql";
import { FragmentType, useFragment } from "@/gql/fragment-masking";

export const CreditsFragment = graphql(`
  fragment IndexCreditsComponent on Query {
    cms {
      majorSponsors: globalSponsors(where: { type: "major" }, order: [sys_firstPublishedAt_ASC]) {
        items {
          name
          link
          type
          logo {
            url(transform: { height: 160, width: 320, resizeStrategy: PAD })
          }
          darkLogo {
            url(transform: { height: 160, width: 320, resizeStrategy: PAD })
          }
        }
      }

      minorSponsors: globalSponsors(where: { type: "minor" }, order: [sys_firstPublishedAt_ASC]) {
        items {
          name
          link
          type
          logo {
            url(transform: { height: 80, width: 160, resizeStrategy: PAD })
          }
          darkLogo {
            url(transform: { height: 80, width: 160, resizeStrategy: PAD })
          }
        }
      }

      pressCoverage: newsCoverages(order: date_DESC, limit: 50) {
        items {
          publicationName
          url
          featured
        }
      }
    }
  }
`);

interface CreditsProps {
  data: FragmentType<typeof CreditsFragment>;
}

export default function Credits({ data }: CreditsProps) {
  const {
    cms: { majorSponsors, minorSponsors, pressCoverage },
  } = useFragment(CreditsFragment, data);
  const funderEntries = [...(majorSponsors?.items || []), ...(minorSponsors?.items || [])].map(
    (sponsor: any) => ({
      name: sponsor.name,
      href: sponsor.link,
      logo: sponsor.logo?.url,
      darkLogo: sponsor.darkLogo?.url,
    }),
  );
  // `pressCoverage` is already `date_DESC`. Sorting featured entries first
  // (stably, so each bucket keeps its date order) then deduping by
  // `publicationName` on first occurrence means each publication's pick is
  // its most recent featured article, or its most recent article at all if
  // it has never been featured.
  const pressEntries = dedupeFirstByKey(
    [...(pressCoverage?.items || [])].sort(
      (a: any, b: any) => Number(b.featured) - Number(a.featured),
    ),
    "publicationName",
  );

  return (
    // The section opens directly on the credit groups, with no "Who pays
    // for this" title or explainer paragraph above them.
    <Box display="flex" flexDirection="column" gap="10" colorPalette="hibiscus">
      <CreditLists
        groups={[
          {
            id: "funders",
            label: m.www_home_credits_group_funders(),
            kind: "logos",
            entries: funderEntries,
          },
        ]}
      />
      <Box>
        <Eyebrow ramp="hibiscus" color="colorPalette.600" display="block" marginBottom="3.5">
          {m.www_home_credits_group_ratings()}
        </Eyebrow>
        <Box display="flex" flexWrap="wrap" alignItems="center" gapX="4">
          <Box
            as="a"
            {...({
              href: "https://www.guidestar.org/profile/shared/88ca3b85-4294-40a3-a922-415c75f0b9e5",
              target: "_blank",
              rel: "noopener",
            } as any)}
          >
            <Image
              src="https://widgets.guidestar.org/TransparencySeal/8867365"
              alt="Candid Platinum Transparency Seal"
              height="32"
            />
          </Box>
          <Box
            as="a"
            {...({
              href: "https://www.charitynavigator.org/ein/264742589",
              target: "_blank",
              rel: "noopener",
            } as any)}
          >
            <Image src="/charity-navigator.png" alt="Charity Navigator" height="32" />
          </Box>
        </Box>
      </Box>
      <Box>
        <Eyebrow ramp="hibiscus" color="colorPalette.600" display="block" marginBottom="3.5">
          {m.www_home_credits_group_press()}
        </Eyebrow>
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
          gapX="8"
          gapY="2"
        >
          {pressEntries.map((entry: any) => (
            <Box
              as="a"
              key={entry.url}
              fontFamily="mono"
              fontSize="xs"
              color="gray.600"
              {...({ href: entry.url, target: "_blank", rel: "noopener" } as any)}
            >
              {entry.publicationName}
            </Box>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

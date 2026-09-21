import * as m from "@codeday/i18n/messages";
import { Box } from "@codeday/topo/Atom";
import { ActionLink, Content } from "@codeday/topo/Molecule";
import { ImpactTicker, type ImpactItem } from "@codeday/topo/Organism";
import { ResultOf } from "@graphql-typed-document-node/core";
import shuffle from "knuth-shuffle-seeded";
import React, { useMemo } from "react";

import { graphql } from "@/gql";
import { FragmentType, useFragment } from "@/gql/fragment-masking";

// Two sources feed the ticker. `showcase.projects` — one of the two sources
// the pre-rewrite `Index/Community` marquee used — renders as the ticker's
// photo-card variant (see `ImpactTicker`'s `PhotoImpactCard`). `labs.
// contributions` is a real accepted open-source PR, rendered as the icon
// variant (repository name, what shipped, and the repo's own impact story).
export const ImpactFragment = graphql(`
  fragment IndexImpactComponent on Query {
    showcase {
      projects(where: { media: IMAGES }, orderBy: NEWEST, take: 20) {
        id
        name
        media(type: IMAGE, topics: [DEMO]) {
          image(width: 320, height: 220, strategy: CROP)
        }
        members {
          account {
            name
            picture(transform: { width: 32, height: 32, fit: CROP })
          }
        }
      }
    }
    labs {
      contributions(take: 20) {
        shortDescription
        prUrl
        repository {
          name
          useDescription
          impactDescription
        }
      }
    }
    impact {
      projectCount
    }
  }
`);

interface ImpactProps {
  data: FragmentType<typeof ImpactFragment>;
  seed?: any;
  /**
   * Default `"mixed"` — the homepage's own showcase photos + open-source PRs,
   * shuffled together. `"contributions"` drops the showcase photo cards
   * entirely and shows only real accepted pull requests — the Micro-
   * Internship page's shipped-work section, which is about code review, not
   * finished projects.
   */
  variant?: "mixed" | "contributions";
}

type ImpactData = ResultOf<typeof ImpactFragment>;
type RawProject = ImpactData["showcase"]["projects"][number];
type RawContribution = ImpactData["labs"]["contributions"][number];

function projectToItem(project: RawProject): ImpactItem | null {
  const photo = project.media?.[0]?.image;
  const author = project.members?.map((member) => member.account).find((account) => account?.name);
  if (!photo || !author) return null;
  return {
    id: `project-${project.id}`,
    photo,
    project: project.name,
    student: author.name || undefined,
    avatar: author.picture,
    href: `https://showcase.codeday.org/project/${project.id}`,
  };
}

function contributionToItem(contribution: RawContribution): ImpactItem | null {
  if (!contribution.repository || !contribution.prUrl) return null;
  const subtext = [
    contribution.repository.useDescription,
    contribution.repository.impactDescription,
  ]
    .filter(Boolean)
    .join(" ");
  return {
    id: contribution.prUrl,
    href: contribution.prUrl,
    project: contribution.repository.name,
    impact: contribution.shortDescription,
    contribution: subtext || undefined,
  };
}

export default function Impact({ data, seed, variant = "mixed" }: ImpactProps) {
  const { showcase, labs } = useFragment(ImpactFragment, data);

  // Shuffled once, with the page's own build-time `seed` — same value on
  // the server render and the client hydration, so the order doesn't
  // mismatch. `ImpactTicker` itself just slices this into two halves, so
  // shuffling here also randomizes which ticker row each item lands in,
  // real showcase projects and real open-source contributions freely mixed
  // across both (when `variant` includes both).
  const items = useMemo(() => {
    const contributions = labs.contributions
      .map(contributionToItem)
      .filter((item): item is ImpactItem => item !== null);
    if (variant === "contributions") return shuffle(contributions, seed);
    return shuffle(
      [
        ...showcase.projects.map(projectToItem).filter((item): item is ImpactItem => item !== null),
        ...contributions,
      ],
      seed,
    );
  }, [showcase, labs, seed, variant]);

  return <ImpactTicker ramp="chilioil" items={items} />;
}

// The "N projects" aggregate footer linking out to the full showcase — the
// homepage's own closing line under its ticker, not part of what `Impact`
// renders: the Micro-Internship page's ticker (`variant="contributions"`)
// counts real PRs, not showcase projects, so it has no use for this footer
// and doesn't render it. Composed by the homepage directly, same as it
// composes its own section headings.
export function ImpactAggregate({ data }: { data: FragmentType<typeof ImpactFragment> }) {
  const { impact } = useFragment(ImpactFragment, data);

  return (
    <Content maxWidth="container.xl" marginBottom="0">
      <Box
        colorPalette="chilioil"
        marginTop="8"
        paddingTop="5"
        borderTop="sm"
        borderTopColor="gray.200"
        display="flex"
        flexDirection={{ base: "column", md: "row" }}
        alignItems={{ base: "flex-start", md: "baseline" }}
        justifyContent={{ base: "flex-start", md: "flex-end" }}
        gap={{ base: "1.5", md: "4" }}
      >
        <Box as="span" fontSize="md" color="black" fontWeight="700">
          {m.www_home_impact_aggregate_label({ count: String(impact.projectCount) })}
        </Box>
        <ActionLink
          label={m.www_home_impact_aggregate_link()}
          href="https://showcase.codeday.org"
        />
      </Box>
    </Content>
  );
}

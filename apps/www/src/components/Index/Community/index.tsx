import { Box, Heading } from "@codeday/topo/Atom";
import { Content } from "@codeday/topo/Molecule";
import shuffle from "knuth-shuffle-seeded";
import { useState, ReactElement } from "react";
import { useInView } from "react-intersection-observer";
import PageVisibility from "react-page-visibility";
import Ticker from "react-ticker";

import { usePageData } from "@codeday/topo/Theme";
import Card from "./Card";

export default function Community({ seed, ...props }: { seed?: any; [key: string]: any }) {
  const [pageIsVisible, setPageIsVisible] = useState(true);
  const { ref, inView } = useInView({ rootMargin: "200px" });

  const {
    showcase,
    cms: { indexCommunityPhotos, stats },
  } = usePageData();

  const studentCount = stats?.items?.reduce(
    (accum: number, e: any) => accum + e.statStudentCount,
    0,
  );
  const studentCountRound = Math.round(studentCount / 10000) * 10000;
  const studentCountPrefix = ["More than", "Nearly"][studentCountRound > studentCount ? 1 : 0];
  const showcaseDemos = showcase.projects
    .map((p: any) => ({
      ...p,
      members: p.members && p.members.map((a: any) => a.account).filter((a: any) => a),
      media:
        (p.media && p.media.filter((m: any) => m.type === "IMAGE" && m.topic !== "TEAM")[0]) ||
        null,
    }))
    .filter((p: any) => p.media && p.members && p.members.length > 0);

  const cards: ReactElement[] = shuffle(
    [
      ...showcaseDemos.map((d: any) => (
        <Card
          key={d.media.image}
          photo={d.media.image}
          projectTitle={d.name}
          authors={d.members}
          {...({ href: `https://showcase.codeday.org/project/${d.id}` } as any)}
        />
      )),
      ...(
        shuffle(indexCommunityPhotos.items, seed).map((p: any) => (
          <Card
            key={p.photo.url}
            photo={p.photo.url}
            eventInfo={{ region: p.region, event: p.event }}
          />
        )) || []
      ).slice(0, 25),
      ...(shuffle(showcase.photos, seed).map((p: any) => (
        <Card key={p.url} photo={p.url} eventInfo={{ region: p.region, program: p.program }} />
      )) || []),
    ],
    seed,
  );
  const rows = [
    cards.slice(0, Math.floor(cards.length / 2)),
    cards.slice(Math.floor(cards.length / 2)),
  ];

  return (
    <PageVisibility onChange={setPageIsVisible}>
      <Box ref={ref} mt={32} mb={32} {...props}>
        <Box key={(rows[0][0] as any).imageUrl}>
          {pageIsVisible && inView ? (
            <Ticker>{({ index }: { index: number }) => rows[0][index % rows[0].length]}</Ticker>
          ) : (
            <Box h={40} />
          )}
        </Box>

        <Content>
          <Heading
            as="h2"
            fontSize="5xl"
            textAlign="center"
            mb={8}
            mt={8}
            lineHeight={1.1}
            fontWeight="bold"
          >
            {studentCountPrefix} {studentCountRound.toLocaleString()} students have created amazing
            projects at CodeDay events.
          </Heading>
        </Content>

        <Box key={(rows[1][0] as any).imageUrl} mb={8}>
          {pageIsVisible && inView ? (
            <Ticker offset={-100}>
              {({ index }: { index: number }) => rows[1][index % rows[0].length]}
            </Ticker>
          ) : (
            <Box h={40} />
          )}
        </Box>
      </Box>
    </PageVisibility>
  );
}

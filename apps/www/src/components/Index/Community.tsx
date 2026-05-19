import { Box, Grid, Image, Text, Heading } from "@codeday/topo/Atom";
import { Content } from "@codeday/topo/Molecule";
import shuffle from "knuth-shuffle-seeded";
import React, { useState, ReactElement } from "react";
import { useInView } from "react-intersection-observer";
import PageVisibility from "react-page-visibility";
import Ticker from "react-ticker";
import truncate from "truncate";

import { usePageData } from "@codeday/topo/Theme";

function PhotoTextCard({ photo, text, authors, wip, href }: any) {
  return (
    <Box
      rounded="md"
      width="sm"
      maxHeight="100%"
      h="100%"
      overflow="hidden"
      as={href ? "a" : undefined}
      {...({ href, target: "_blank" } as any)}
    >
      <Grid templateColumns="3fr 3fr" h="100%">
        <Box
          backgroundImage={`url(${photo})`}
          backgroundPosition="50% 50%"
          backgroundSize="cover"
          backgroundRepeat="no-repeat"
          h="100%"
        />
        <Box p={2} overflow="hidden">
          {authors &&
            authors.length > 0 &&
            (authors.length > 1 ? (
              <Box>
                {authors.map((author: any) => (
                  <Image
                    src={author.picture}
                    float="left"
                    alt=""
                    w={4}
                    h={4}
                    mr={2}
                    rounded="full"
                    key={author.picture}
                  />
                ))}
              </Box>
            ) : (
              <Box>
                <Image
                  src={authors[0].picture}
                  alt=""
                  float="left"
                  w={4}
                  h={4}
                  mr={2}
                  rounded="full"
                />
                <Text mb={0} fontWeight="bold" fontSize="sm">
                  {authors[0].name}
                </Text>
              </Box>
            ))}
          <Text fontSize="sm" mb={0} style={{ clear: "both" }}>
            {truncate(text, 90)}{" "}
            {wip && (
              <Text as="span" fontStyle="italic">
                #work-in-progress
              </Text>
            )}
          </Text>
        </Box>
      </Grid>
    </Box>
  );
}

function PhotoCard({ photo, authors, wip, eventInfo, projectTitle, href }: any) {
  return (
    <Box
      rounded="md"
      backgroundImage={`url(${photo})`}
      backgroundPosition="50% 50%"
      backgroundSize="cover"
      w={64}
      h="100%"
      position="relative"
      as={href ? "a" : undefined}
      {...({ href, target: "_blank" } as any)}
      display="block"
    >
      {authors &&
        authors.length > 0 &&
        (authors.length > 1 ? (
          <Box p={2} backgroundImage="linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))">
            {authors.map((author: any) => (
              <Image
                src={author.picture}
                alt=""
                w={4}
                h={4}
                mr={2}
                float="left"
                rounded="full"
                key={author.picture}
              />
            ))}
            <Text mb={0} fontWeight="bold" fontSize="sm" color="white">
              &nbsp;
            </Text>
          </Box>
        ) : (
          <Box p={2} backgroundImage="linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))">
            <Image src={authors[0].picture} alt="" float="left" w={4} h={4} mr={2} rounded="full" />
            <Text mb={0} fontWeight="bold" fontSize="sm" color="white">
              {authors[0].name}
            </Text>
          </Box>
        ))}
      {!(authors && authors.length > 0) && eventInfo && (
        <Box p={2} backgroundImage="linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))">
          <Text mb={0} fontSize="sm" color="white" fontWeight="bold">
            {eventInfo
              ? [
                  eventInfo.event?.program?.name,
                  eventInfo.program?.name,
                  eventInfo.region?.name,
                ].join(" ")
              : projectTitle}
          </Text>
        </Box>
      )}
      {projectTitle && (
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          p={2}
          backgroundImage="linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,1))"
        >
          <Text mb={0} fontSize="sm" color="white" fontWeight="bold">
            {projectTitle}
          </Text>
        </Box>
      )}

      {wip && (
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          p={2}
          backgroundImage="linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,1))"
        >
          <Text mb={0} fontSize="sm" color="white" fontStyle="italic">
            #work-in-progress
          </Text>
        </Box>
      )}
    </Box>
  );
}

function Card({ photo, text, authors, wip, eventInfo, projectTitle, href }: any) {
  const elem =
    text && text.length > 0 ? (
      <PhotoTextCard
        photo={photo}
        text={text}
        authors={authors}
        wip={wip}
        eventInfo={eventInfo}
        {...({ href: href } as any)}
      />
    ) : (
      <PhotoCard
        photo={photo}
        authors={authors}
        wip={wip}
        eventInfo={eventInfo}
        projectTitle={projectTitle}
        {...({ href: href } as any)}
      />
    );

  return (
    <Box role="figure" height={40} borderWidth={1} overflow="hidden" mr={8} boxShadow="md">
      {elem}
    </Box>
  );
}

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

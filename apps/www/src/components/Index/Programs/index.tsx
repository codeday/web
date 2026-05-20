import { Box, Grid, Button, Image, Text, CodeDay, Link } from "@codeday/topo/Atom";
import { Content } from "@codeday/topo/Molecule";
import { useColorMode, usePageData } from "@codeday/topo/Theme";
import { apiFetch } from "@codeday/topo/utils";
import { print } from "graphql";
import haversine from "haversine-distance";
import React, { useEffect, useState } from "react";

import { GetMyLocation } from "./Programs.gql";
import NextEventDate from "./NextEventDate";
import ProgramCard from "./ProgramCard";
import RegionList from "./RegionList";

export default function Programs() {
  const { colorMode } = useColorMode();
  const {
    cms: { regions, mainPrograms, codeDayProgram, labsProgram },
    clear: { events },
  } = usePageData();
  const [geo, setGeo] = useState<any>();
  const codeDay = codeDayProgram?.items[0];
  const labs = labsProgram?.items[0];
  let programs = codeDay?.linkedFrom?.events?.items;
  mainPrograms?.items?.map(
    (program: any) => (programs = programs.concat(program.linkedFrom?.events?.items)),
  );

  const upcomingWebnames = events.map((e: any) => e.contentfulWebname);
  const registrationOpenWebnames = events
    .filter((e: any) => e.registrationsOpen)
    .map((e: any) => e.contentfulWebname);
  const upcomingNameOverrides = Object.fromEntries(
    events.map((e: any) => [e.contentfulWebname, e.name]),
  );

  useEffect(() => {
    void (async () => {
      if (typeof window === "undefined") return;
      const res = await apiFetch(print(GetMyLocation), {}, {});
      setGeo(res?.geo?.mine);
    })();
  }, [typeof window, setGeo, apiFetch]);

  const sortedRegions = (regions?.items || [])
    .map((r: any) => ({
      ...r,
      open: registrationOpenWebnames.includes(r.webname),
      upcoming: upcomingWebnames.includes(r.webname),
      distance:
        typeof geo?.lat !== "undefined" && typeof geo?.lng !== "undefined"
          ? haversine([r.location.lat, r.location.lon], [geo.lat, geo.lng])
          : undefined,
    }))
    .sort((a: any, b: any) => {
      if (a.open && !b.open) return -1;
      if (b.open && !a.open) return 1;
      if (a.upcoming && !b.upcoming) return -1;
      if (b.upcoming && !a.upcoming) return 1;
      if (a.distance && b.distance) return a.distance < b.distance ? -1 : 1;
      return 0;
    });

  return (
    <Content>
      {/* CodeDay */}
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={8}>
        <Box borderWidth={1} borderRadius={2} p={4} boxShadow="md">
          <CodeDay fontSize="4xl" withText />
          <Text fontSize="md" mt={4} mb={4}>
            {codeDay?.shortDescription}
          </Text>
          <Text mb={4} fontSize="sm">
            (Nothing planned nearby?{" "}
            <Link color="red.600" href="https://event.codeday.org/organize">
              Organize a CodeDay!
            </Link>
            )
          </Text>
          <RegionList
            sortedRegions={sortedRegions}
            registrationOpenWebnames={registrationOpenWebnames}
            upcomingNameOverrides={upcomingNameOverrides}
          />
        </Box>

        {/* More Programs */}
        <Box>
          <Box
            borderWidth={1}
            rounded="sm"
            p={4}
            mb={4}
            display="block"
            as="a"
            {...({ href: labs.url } as any)}
            target="_blank"
            rel="noopener"
            key={labs.name}
          >
            <Box>
              <Box float="left" mt={2} pr={2}>
                <Image src={labs.logo.url} height={8} alt="" />
              </Box>
              <Text fontSize="4xl" mb={0} bold>
                {labs.name}
              </Text>
            </Box>
            <NextEventDate upcoming={labs.linkedFrom?.events?.items} />
            <Text mt={2} style={{ clear: "both" }}>
              {labs.shortDescription}
            </Text>
            <Image
              maxW={64}
              mt={4}
              mb={8}
              src={colorMode === "dark" ? "/labs-dark.png" : "labs-light.png"}
              alt="1 mentor + 3 students + 1 project"
            />
            <Box>
              <Button size="sm">Learn More &raquo;</Button>
            </Box>
          </Box>
          {mainPrograms?.items?.map((program: any) => (
            <ProgramCard key={program.name} program={program} />
          ))}
        </Box>
      </Grid>
    </Content>
  );
}

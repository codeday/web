import { Box } from "@codeday/topo/Atom";
import * as m from "@codeday/i18n/messages";
import { UiStar } from "@codeday/topocons";
import React from "react";

interface RegionListProps {
  sortedRegions: any[];
  registrationOpenWebnames: string[];
  upcomingNameOverrides: Record<string, string>;
}

export default function RegionList({
  sortedRegions,
  registrationOpenWebnames,
  upcomingNameOverrides,
}: RegionListProps) {
  return (
    <>
      <Box borderWidth={1} maxHeight={{ base: "sm", md: "md" }} overflowY="auto">
        {sortedRegions.map((region: any) => (
          <Box
            p={2}
            as="a"
            display="block"
            {...({ href: `https://event.codeday.org/${region.webname}` } as any)}
            target="_blank"
            fontSize="xl"
            borderBottomWidth="1px"
            key={region.webname}
          >
            {upcomingNameOverrides[region.webname] || region.name}
            {region.upcoming && (
              <Box fontSize="sm" ml={2} display="inline-block" color="current.textLight">
                <Box position="relative" top="-0.2em" display="inline-block" mr={2}>
                  <UiStar />
                </Box>
                {registrationOpenWebnames.includes(region.webname) ? m.www_programs_registrations_open() : ``}
              </Box>
            )}
          </Box>
        ))}
      </Box>
      <Box fontSize="sm" mt={4} display="inline-block" color="current.textLight">
        <Box position="relative" top="-0.2em" display="inline-block" mr={2}>
          <UiStar />
        </Box>
        {m.www_programs_event_planned()}
      </Box>
    </>
  );
}

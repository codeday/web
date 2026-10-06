import * as m from "@codeday/i18n/messages";
import { Box } from "@codeday/topo/Atom";
import { GradientField } from "@codeday/topo/Molecule";
import type { Message } from "@codeday/topo/utils";
import { UiCheck } from "@codeday/topocons";
import React from "react";

import { SQUIRCLE, TalentPill } from "@/components/Talent/Pill";

interface ShortlistCandidate {
  id: string;
  initials: string;
  avatarBg: string;
  name: () => Message;
  meta: () => Message;
  achievement: () => Message;
  contributions: () => Message;
  seniorEngineer: () => Message;
  interview: () => Message;
}

const CANDIDATES: ShortlistCandidate[] = [
  {
    id: "maya",
    initials: "MR",
    avatarBg: "figjam.true.600",
    name: m.www_talent_shortlist_maya_name,
    meta: m.www_talent_shortlist_maya_meta,
    achievement: m.www_talent_shortlist_maya_achievement,
    contributions: m.www_talent_shortlist_maya_contributions,
    seniorEngineer: m.www_talent_shortlist_maya_senior,
    interview: m.www_talent_shortlist_maya_interview,
  },
  {
    id: "daniel",
    initials: "DO",
    avatarBg: "hibiscus.true.600",
    name: m.www_talent_shortlist_daniel_name,
    meta: m.www_talent_shortlist_daniel_meta,
    achievement: m.www_talent_shortlist_daniel_achievement,
    contributions: m.www_talent_shortlist_daniel_contributions,
    seniorEngineer: m.www_talent_shortlist_daniel_senior,
    interview: m.www_talent_shortlist_daniel_interview,
  },
  {
    id: "sofia",
    initials: "ST",
    avatarBg: "blackberry.true.600",
    name: m.www_talent_shortlist_sofia_name,
    meta: m.www_talent_shortlist_sofia_meta,
    achievement: m.www_talent_shortlist_sofia_achievement,
    contributions: m.www_talent_shortlist_sofia_contributions,
    seniorEngineer: m.www_talent_shortlist_sofia_senior,
    interview: m.www_talent_shortlist_sofia_interview,
  },
];

export default function Shortlist() {
  return (
    <Box
      as="section"
      aria-label={m.www_talent_shortlist_label()}
      width="full"
      maxWidth="md"
      marginX="auto"
      bg="white"
      borderWidth="1px"
      borderColor="gray.300"
      borderRadius="xl"
      boxShadow="xl"
      overflow="hidden"
    >
      <GradientField ramp="hibiscus" paddingX="5" paddingY="4.5">
        <Box display="flex" alignItems="center" justifyContent="space-between" gap="3">
          <Box display="flex" flexDirection="column" gap="0.5" minWidth="0">
            <Box fontFamily="mono" fontSize="xs" color="whiteAlpha.800">
              {m.www_talent_shortlist_eyebrow()}
            </Box>
          </Box>
          <TalentPill tone="onDark" whiteSpace="nowrap" flexShrink={0}>
            {m.www_talent_shortlist_tier()}
          </TalentPill>
        </Box>
      </GradientField>
      <Box as="ul" listStyleType="none" margin="0" padding="0">
        {CANDIDATES.map((candidate) => (
          <Box
            as="li"
            key={candidate.id}
            display="flex"
            gap="3.5"
            alignItems="flex-start"
            paddingX="5"
            paddingY="4"
            borderBottomWidth="1px"
            borderColor="gray.300"
          >
            <Box
              aria-hidden="true"
              boxSize="11"
              flexShrink={0}
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg={candidate.avatarBg}
              color="trueWhite"
              fontWeight="700"
              {...SQUIRCLE}
            >
              {candidate.initials}
            </Box>
            <Box display="flex" flexDirection="column" gap="2" minWidth="0" flex="1">
              <Box display="flex" flexWrap="wrap" justifyContent="space-between" columnGap="2">
                <Box fontWeight="700">{candidate.name()}</Box>
                <Box fontSize="xs" color="gray.600" alignSelf="center">
                  {candidate.meta()}
                </Box>
              </Box>
              <Box fontSize="sm" fontWeight="600" lineHeight="short">
                {candidate.achievement()}
              </Box>
              <Box display="flex" flexWrap="wrap" gap="1.5">
                <TalentPill tone="neutral">{candidate.contributions()}</TalentPill>
                <TalentPill tone="endorsement">{candidate.seniorEngineer()}</TalentPill>
                <TalentPill tone="positive">{candidate.interview()}</TalentPill>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
      <Box
        display="flex"
        alignItems="center"
        gap="2"
        paddingX="5"
        paddingY="3"
        fontSize="xs"
        color="gray.700"
        bg="hibiscus.50"
      >
        <UiCheck aria-hidden="true" boxSize="3.5" color="green.600" flexShrink={0} />
        <Box as="span">{m.www_talent_shortlist_footer()}</Box>
      </Box>
    </Box>
  );
}

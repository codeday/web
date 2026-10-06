import * as m from "@codeday/i18n/messages";
import { Box } from "@codeday/topo/Atom";
import { GradientField } from "@codeday/topo/Molecule";
import type { Message } from "@codeday/topo/utils";
import React from "react";

import { SQUIRCLE, TalentPill } from "@/components/Talent/Pill";

interface Contribution {
  id: string;
  title: () => Message;
  project: () => Message;
}

const CONTRIBUTIONS: Contribution[] = [
  {
    id: "retries",
    title: m.www_talent_profile_contribution_retries_title,
    project: m.www_talent_profile_contribution_retries_project,
  },
  {
    id: "errors",
    title: m.www_talent_profile_contribution_errors_title,
    project: m.www_talent_profile_contribution_errors_project,
  },
  {
    id: "test",
    title: m.www_talent_profile_contribution_test_title,
    project: m.www_talent_profile_contribution_test_project,
  },
];

const SKILLS = ["TypeScript", "React", "Python", "Git", "Unit testing"];

const BLOCK_HEADING = { as: "h4", margin: "0", fontSize: "md", fontWeight: "700" } as const;

export default function Profile() {
  return (
    <Box
      as="article"
      aria-label={m.www_talent_profile_label()}
      minWidth="0"
      bg="white"
      borderWidth="1px"
      borderColor="gray.300"
      borderRadius="2xl"
      boxShadow="xl"
      overflow="hidden"
    >
      <GradientField ramp="figjam" padding="6">
        <Box display="flex" flexWrap="wrap" alignItems="center" gap="4">
          <Box
            aria-hidden="true"
            boxSize="14"
            flexShrink={0}
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg="gray.true.100"
            color="figjam.true.800"
            fontSize="xl"
            fontWeight="700"
            {...SQUIRCLE}
          >
            {m.www_talent_profile_initials()}
          </Box>
          <Box display="flex" flexDirection="column" gap="1" flex="1" minWidth="48">
            <Box display="flex" flexWrap="wrap" alignItems="center" gap="2.5">
              <Box as="h3" margin="0" fontSize="2xl" fontWeight="700" color="trueWhite">
                {m.www_talent_profile_name()}
              </Box>
              <TalentPill tone="onDark">{m.www_talent_profile_sample()}</TalentPill>
            </Box>
            <Box fontSize="sm" color="whiteAlpha.900">
              {m.www_talent_profile_meta()}
            </Box>
          </Box>
        </Box>
      </GradientField>

      <Box padding="6" display="flex" flexDirection="column" gap="6">
        <Box display="flex" flexDirection="column" gap="2.5">
          <Box
            display="flex"
            flexWrap="wrap"
            justifyContent="space-between"
            alignItems="baseline"
            gap="3"
          >
            <Box {...BLOCK_HEADING}>{m.www_talent_profile_contributions_heading()}</Box>
            <Box fontSize="sm" color="gray.600">
              {m.www_talent_profile_contributions_count()}
            </Box>
          </Box>
          <Box fontSize="sm" color="gray.600">
            {m.www_talent_profile_contributions_note()}
          </Box>
          <Box
            as="ul"
            listStyleType="none"
            margin="0"
            padding="0"
            display="flex"
            flexDirection="column"
            gap="2.5"
          >
            {CONTRIBUTIONS.map((contribution) => (
              <Box
                as="li"
                key={contribution.id}
                display="flex"
                flexDirection="column"
                gap="1"
                paddingX="3.5"
                paddingY="3"
                borderWidth="1px"
                borderColor="gray.300"
                borderRadius="lg"
              >
                <Box fontWeight="600" lineHeight="short">
                  {contribution.title()}
                </Box>
                <Box fontSize="sm" color="gray.700">
                  {contribution.project()}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        <Box display="flex" flexDirection="column" gap="2.5">
          <Box {...BLOCK_HEADING}>{m.www_talent_profile_evaluation_heading()}</Box>
          <Box
            as="blockquote"
            margin="0"
            paddingY="1"
            paddingLeft="4"
            borderLeft="md"
            borderLeftColor="figjam.600"
            lineHeight="moderate"
          >
            &ldquo;{m.www_talent_profile_evaluation_quote()}&rdquo;
          </Box>
        </Box>

        <Box display="flex" flexDirection="column" gap="2.5">
          <Box {...BLOCK_HEADING}>{m.www_talent_profile_interview_heading()}</Box>
          <Box display="flex" flexWrap="wrap" alignItems="flex-start" gap="3">
            <TalentPill tone="positive">{m.www_talent_profile_interview_result()}</TalentPill>
            <Box flex="1" minWidth="56" color="gray.700" lineHeight="moderate">
              {m.www_talent_profile_interview_note()}
            </Box>
          </Box>
        </Box>

        <Box
          as="ul"
          aria-label={m.www_talent_profile_skills_heading()}
          listStyleType="none"
          margin="0"
          padding="0"
          display="flex"
          flexWrap="wrap"
          gap="1.5"
        >
          {SKILLS.map((skill) => (
            <Box as="li" key={skill}>
              <Box
                as="span"
                display="inline-flex"
                alignItems="center"
                height="7"
                paddingX="3"
                borderRadius="full"
                borderWidth="1px"
                borderColor="gray.300"
                fontFamily="mono"
                fontSize="xs"
                color="gray.900"
              >
                {skill}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

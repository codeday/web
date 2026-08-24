import * as m from "@codeday/i18n/messages";
import { Box, Grid, Text } from "@codeday/topo/Atom";
import { useColorMode } from "@codeday/topo/Theme";
import React from "react";

// Veris Insights employer survey (reported by Fortune)
const SHORTLIST_ONLY_BY_YEAR = [
  { year: "2022", value: 17 },
  { year: "2025", value: 26 },
];
const MAX_VALUE = Math.max(...SHORTLIST_ONLY_BY_YEAR.map((d) => d.value));
const CHART_HEIGHT = 160;

function Bar({ value, emphasize }: { value: number; emphasize?: boolean }) {
  const { colorMode } = useColorMode();
  return (
    <Box
      w="100%"
      roundedTop="md"
      height={`${(value / MAX_VALUE) * CHART_HEIGHT}px`}
      bg={emphasize ? "current.primary" : colorMode === "light" ? "gray.300" : "gray.700"}
    />
  );
}

export default function PrestigeGapChart(props: any) {
  const mostRecentYear = SHORTLIST_ONLY_BY_YEAR[SHORTLIST_ONLY_BY_YEAR.length - 1].year;
  return (
    <Box {...props}>
      <Text mb={4} fontSize="md" color="current">
        {m.www_donate_chart_prestige_heading()}
      </Text>

      <Box>
        <Grid templateColumns={`repeat(${SHORTLIST_ONLY_BY_YEAR.length}, 1fr)`} gap={4} pb={1}>
          {SHORTLIST_ONLY_BY_YEAR.map((d) => (
            <Text key={d.year} mb={0} fontSize="sm" fontWeight="bold" textAlign="center">
              {d.value}%
            </Text>
          ))}
        </Grid>

        <Grid
          templateColumns={`repeat(${SHORTLIST_ONLY_BY_YEAR.length}, 1fr)`}
          gap={4}
          h={`${CHART_HEIGHT}px`}
          alignItems="end"
          borderBottomWidth={2}
          borderColor="current.border"
        >
          {SHORTLIST_ONLY_BY_YEAR.map((d) => (
            <Bar key={d.year} value={d.value} emphasize={d.year === mostRecentYear} />
          ))}
        </Grid>

        <Grid templateColumns={`repeat(${SHORTLIST_ONLY_BY_YEAR.length}, 1fr)`} gap={4} pt={1}>
          {SHORTLIST_ONLY_BY_YEAR.map((d) => (
            <Text
              key={d.year}
              mb={0}
              fontSize="sm"
              fontWeight={d.year === mostRecentYear ? "bold" : "normal"}
              textAlign="center"
            >
              {d.year}
            </Text>
          ))}
        </Grid>
      </Box>

      <Text mt={4} mb={0} fontSize="xs" color="current.textLight">
        {m.www_donate_chart_prestige_source()}
      </Text>
    </Box>
  );
}

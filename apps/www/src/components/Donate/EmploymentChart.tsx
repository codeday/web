import * as m from "@codeday/i18n/messages";
import { Box, Grid, Text } from "@codeday/topo/Atom";
import { useColorMode } from "@codeday/topo/Theme";
import React from "react";

// Federal Reserve Bank of New York, "Labor Market for Recent College Graduates."
const CS_UNEMPLOYMENT_BY_YEAR = [
  { year: "2024", value: 3.9},
  { year: "2025", value: 6.1 },
  { year: "2026", value: 7.0 },
];
const ALL_MAJORS_REFERENCE = { year: "2026", value: 4.2, label: "All majors" };
const MAX_VALUE = Math.max(
  ...CS_UNEMPLOYMENT_BY_YEAR.map((d) => d.value),
  ALL_MAJORS_REFERENCE.value,
);
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

export default function EmploymentChart(props: any) {
  const mostRecentYear = CS_UNEMPLOYMENT_BY_YEAR[CS_UNEMPLOYMENT_BY_YEAR.length - 1].year;
  const referenceTop =
    CHART_HEIGHT - (ALL_MAJORS_REFERENCE.value / MAX_VALUE) * CHART_HEIGHT;

  return (
    <Box {...props}>
      <Text mb={4} fontSize="md" color="current">
        {m.www_donate_chart_employment_heading()}
      </Text>

      <Box>
        <Grid
          templateColumns={`repeat(${CS_UNEMPLOYMENT_BY_YEAR.length}, 1fr)`}
          gap={4}
          pb={1}
        >
          {CS_UNEMPLOYMENT_BY_YEAR.map((d) => (
            <Text key={d.year} mb={0} fontSize="sm" fontWeight="bold" textAlign="center">
              {d.value}%
            </Text>
          ))}
        </Grid>

        <Box
          position="relative"
          height={`${CHART_HEIGHT}px`}
          borderBottomWidth={2}
          borderColor="current.border"
        >
          <Grid
            templateColumns={`repeat(${CS_UNEMPLOYMENT_BY_YEAR.length}, 1fr)`}
            gap={4}
            h="100%"
            alignItems="end"
          >
            {CS_UNEMPLOYMENT_BY_YEAR.map((d) => (
              <Bar key={d.year} value={d.value} emphasize={d.year === mostRecentYear} />
            ))}
          </Grid>

          <Box
            position="absolute"
            left={0}
            right={0}
            top={`${referenceTop}px`}
            borderTopWidth={2}
            borderStyle="dashed"
            borderColor="current.text"
          >
            <Text
              position="absolute"
              right={0}
              top={-5}
              mb={0}
              fontSize="xs"
              fontWeight="bold"
              color="current.text"
              whiteSpace="nowrap"
            >
              {ALL_MAJORS_REFERENCE.label}: {ALL_MAJORS_REFERENCE.value}%
            </Text>
          </Box>
        </Box>

        <Grid
          templateColumns={`repeat(${CS_UNEMPLOYMENT_BY_YEAR.length}, 1fr)`}
          gap={4}
          pt={1}
        >
          {CS_UNEMPLOYMENT_BY_YEAR.map((d) => (
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
        {m.www_donate_chart_employment_source()}
      </Text>
    </Box>
  );
}

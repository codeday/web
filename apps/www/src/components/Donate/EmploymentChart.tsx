import * as m from "@codeday/i18n/messages";
import { Box, Grid, Text } from "@codeday/topo/Atom";
import { useColorMode } from "@codeday/topo/Theme";
import React from "react";

// Federal Reserve Bank of New York, "Labor Market for Recent College Graduates" —
// unemployment rate for Computer Science majors, as published in each year's update.
// 2024 and 2025 figures pulled from archived snapshots (web.archive.org) of the
// NY Fed's own outcomes-by-major data file; the Fed does not publish a historical
// by-major series itself, so this reconstructs the trend from what they published
// each year.
const CS_UNEMPLOYMENT_BY_YEAR = [
  { year: "2024", value: 4.3 },
  { year: "2025", value: 6.1 },
  { year: "2026", value: 7.0 },
];
const MAX_VALUE = Math.max(...CS_UNEMPLOYMENT_BY_YEAR.map((d) => d.value));
const CHART_HEIGHT = 160;

// Bars hang down from a shared baseline — a longer drop reads as "things got
// worse" more intuitively than a taller bar climbing up.
function Column({ year, value, emphasize }: { year: string; value: number; emphasize?: boolean }) {
  const { colorMode } = useColorMode();
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Text mb={1} fontSize="sm" fontWeight={emphasize ? "bold" : "normal"}>
        {year}
      </Text>
      <Box
        w="100%"
        roundedBottom="md"
        height={`${(value / MAX_VALUE) * CHART_HEIGHT}px`}
        bg={emphasize ? "current.primary" : colorMode === "light" ? "gray.300" : "gray.700"}
      />
      <Text mt={1} mb={0} fontSize="sm" fontWeight="bold">
        {value}%
      </Text>
    </Box>
  );
}

export default function EmploymentChart(props: any) {
  const mostRecentYear = CS_UNEMPLOYMENT_BY_YEAR[CS_UNEMPLOYMENT_BY_YEAR.length - 1].year;
  return (
    <Box {...props}>
      <Text mb={4} fontSize="sm" fontWeight="bold" color="current.textLight">
        {m.www_donate_chart_heading()}
      </Text>
      <Grid
        templateColumns={`repeat(${CS_UNEMPLOYMENT_BY_YEAR.length}, 1fr)`}
        gap={4}
        alignItems="start"
        borderTopWidth={2}
        borderColor="current.border"
      >
        {CS_UNEMPLOYMENT_BY_YEAR.map((d) => (
          <Column
            key={d.year}
            year={d.year}
            value={d.value}
            emphasize={d.year === mostRecentYear}
          />
        ))}
      </Grid>
      <Text mt={4} mb={0} fontSize="xs" color="current.textLight">
        {m.www_donate_chart_source()}
      </Text>
    </Box>
  );
}

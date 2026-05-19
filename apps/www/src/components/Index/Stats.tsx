import { Text, Grid, Box } from "@codeday/topo/Atom";
import { Content } from "@codeday/topo/Molecule";
import { useColorMode, usePageData } from "@codeday/topo/Theme";
import React from "react";
import CountUp from "react-countup";



function rollup(events: any[]): Record<string, number> {
  const stats: Record<string, number> = {};
  events.forEach((event) => {
    Object.keys(event).forEach((k) => {
      if (!(k in stats)) stats[k] = 0;
      stats[k] += event[k];
    });
  });

  return stats;
}

function StatBox({
  num,
  label,
  unit,
  ...props
}: {
  num: number;
  label: string;
  unit?: string;
  [key: string]: any;
}) {
  return (
    <Box textAlign="center" {...props}>
      <Text fontSize="4xl" bold mb={0}>
        <CountUp start={0} end={num} duration={0.5} separator="," />
        {unit}
      </Text>
      <Text fontSize="md" bold mb={0}>
        {label}
      </Text>
    </Box>
  );
}

export default function Stats(props: any) {
  const { colorMode } = useColorMode();
  const {
    cms: { stats, quoteRegions },
    labs: { statTotalOutcomes },
  } = usePageData();
  const rollupStats = rollup(stats.items);

  const hours = statTotalOutcomes.find((o: any) => o.key === "hoursCount");
  const labsStudentCount = statTotalOutcomes.find((o: any) => o.key === "studentCount");

  return (
    <Content full bg={colorMode === "light" ? "red.50" : "red.900"} pt={4} pb={2} {...props}>
      <Content>
        <Grid
          templateColumns={{ base: "repeat(3, 1fr)", md: "repeat(4, 1fr)", lg: "repeat(5, 1fr)" }}
          gap={4}
        >
          <StatBox
            num={rollupStats.statEventCount}
            label={`In-Person Events in ${quoteRegions?.items?.length} Cities Worldwide`}
            opacity="0.7"
          />
          <StatBox num={rollupStats.statStudentCount} label="Total CodeDay Alumni" opacity="0.7" />
          <StatBox
            num={rollupStats.statLowInterestCount}
            label="High School Students Started Pursuing Tech Because of CodeDay"
            opacity="0.7"
          />
          <StatBox
            num={labsStudentCount?.value}
            label="College Students Became Open Source Software Contributors"
            opacity="0.7"
          />
          <StatBox
            num={rollupStats.statStudentCount * 24 + hours?.value}
            label="Hours Spent Solving Meaningful Problems"
            opacity="0.7"
          />
        </Grid>
      </Content>
    </Content>
  );
}

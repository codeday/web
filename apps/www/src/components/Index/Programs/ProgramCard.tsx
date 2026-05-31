import { Box, Button, Image, Text } from "@codeday/topo/Atom";
import React from "react";

import NextEventDate from "./NextEventDate";

interface ProgramCardProps {
  program: any;
}

export default function ProgramCard({ program }: ProgramCardProps) {
  return (
    <Box
      p={4}
      mb={4}
      display="block"
      as="a"
      {...({ href: program.url } as any)}
      target="_blank"
      rel="noopener"
      key={program.name}
    >
      <Box mb={1}>
        <Box float="left" width={10} pr={4}>
          <Image src={program.logo.url} height={6} alt="" />
        </Box>
        <Text fontSize="lg" mb={0} bold>
          {program.name}
        </Text>
      </Box>
      <NextEventDate upcoming={program.linkedFrom?.events?.items} />
      <Text mt={2} style={{ clear: "both" }}>
        {program.shortDescription}
      </Text>
      <Box>
        <Button size="sm">Learn More &raquo;</Button>
      </Box>
    </Box>
  );
}

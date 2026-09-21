import * as m from "@codeday/i18n/messages";
import { Box } from "@codeday/topo/Atom";
import React from "react";

export interface PartnerPillProps {
  id?: string;
}

// The quiet third option below the two registration paths — shared between
// the landing page's register section and the individual-registration
// subpage's options section, which show the identical pill.
export default function PartnerPill({ id }: PartnerPillProps) {
  return (
    <Box
      id={id}
      scrollMarginTop={id ? "20" : undefined}
      boxSizing="border-box"
      padding="{spacing.5} {spacing.7}"
      borderRadius="2xl"
      border="sm"
      borderColor="current.border"
      display="flex"
      flexDirection={{ base: "column", md: "row" }}
      alignItems={{ base: "flex-start", md: "center" }}
      justifyContent="space-between"
      gap="4"
      fontSize="md"
      color="gray.700"
    >
      <Box as="span">{m.www_microinternship_register_partner_prompt()}</Box>
      <Box
        as="a"
        whiteSpace="nowrap"
        fontWeight="600"
        color="colorPalette.600"
        {...({ href: "/micro-internship/school-partnership" } as any)}
      >
        {m.www_microinternship_register_partner_link()}
      </Box>
    </Box>
  );
}

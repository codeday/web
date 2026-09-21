import * as m from "@codeday/i18n/messages";
import { Box, Eyebrow } from "@codeday/topo/Atom";
import { Wash } from "@codeday/topo/Molecule";
import { UiCheck } from "@codeday/topocons";
import React from "react";

// The hero's right-column field: a merged-PR card and a mentor-meeting card,
// both fixed illustrative examples (bracketed placeholders throughout) rather
// than live data — the real PR ticker with real projects lives further down
// the page. A real Wash `mesh` field, not the mockup's own stacked-radials
// approximation.
export default function HeroField() {
  return (
    <Wash
      ramp="blackberry"
      colorPalette="blackberry"
      shape="rect"
      mesh
      position="relative"
      height={{ base: "xs", md: "xl" }}
      borderRadius={{ base: "40px", md: "72px" }}
    >
      <Box
        position="absolute"
        left={{ base: "5", md: "14" }}
        right={{ base: "5", md: "auto" }}
        top={{ base: "7", md: "18" }}
        width={{ base: "auto", md: "md" }}
        boxSizing="border-box"
        padding={{ base: "{spacing.4.5} {spacing.5}", md: "{spacing.6} {spacing.7}" }}
        background="white"
        borderRadius="3xl"
        boxShadow="0 24px 60px rgba(18,5,16,0.35)"
        display="flex"
        flexDirection="column"
        gap="3"
      >
        <Box display="flex" alignItems="center" justifyContent="space-between" gap="3">
          <Box as="span" fontFamily="mono" fontSize="xs" color="gray.600">
            {m.www_microinternship_hero_card_pr_repo()}
          </Box>
          <Box
            as="span"
            display="inline-flex"
            alignItems="center"
            gap="1.5"
            height="7"
            paddingInline="2.5"
            borderRadius="full"
            bg="green.100"
            color="green.700"
            fontSize="xs"
            fontWeight="700"
            flexShrink={0}
          >
            <UiCheck boxSize="3" />
            {m.www_microinternship_hero_card_pr_status()}
          </Box>
        </Box>
        <Box fontSize={{ base: "lg", md: "xl" }} fontWeight="700" lineHeight="shorter">
          {m.www_microinternship_hero_card_pr_title()}
        </Box>
        <Box fontSize={{ base: "sm", md: "sm" }} lineHeight="moderate" color="gray.700">
          {m.www_microinternship_hero_card_pr_body()}
        </Box>
        <Box
          display="flex"
          alignItems="center"
          gap="2.5"
          paddingTop="2.5"
          borderTop="sm"
          borderTopColor="current.border"
        >
          <Box
            boxSize="7"
            borderRadius="full"
            flexShrink={0}
            backgroundImage="linear-gradient(135deg, {colors.colorPalette.600}, {colors.colorPalette.800})"
          />
          <Box as="span" fontSize="sm" color="gray.700">
            <Box as="strong" color="black">
              {m.www_microinternship_hero_card_pr_student()}
            </Box>{" "}
            {m.www_microinternship_hero_card_pr_attribution()}{" "}
            <Box as="strong" color="black">
              {m.www_microinternship_hero_card_pr_maintainer()}
            </Box>
          </Box>
        </Box>
        <Box display={{ base: "none", md: "flex" }} gap="4" fontFamily="mono" fontSize="xs">
          <Box as="span" color="green.700">
            {m.www_microinternship_hero_card_pr_additions()}
          </Box>
          <Box as="span" color="red.600">
            {m.www_microinternship_hero_card_pr_deletions()}
          </Box>
          <Box as="span" color="gray.600">
            {m.www_microinternship_hero_card_pr_files()}
          </Box>
        </Box>
      </Box>

      <Box
        position="absolute"
        left={{ base: "5", md: "auto" }}
        right={{ base: "5", md: "10" }}
        bottom={{ base: "6", md: "14" }}
        width={{ base: "auto", md: "xs" }}
        boxSizing="border-box"
        padding={{ base: "{spacing.3.5} {spacing.4}", md: "{spacing.4.5} {spacing.5}" }}
        background="white"
        borderRadius="2xl"
        boxShadow="0 18px 44px rgba(18,5,16,0.3)"
        display="flex"
        flexDirection="column"
        gap="1.5"
      >
        <Eyebrow ramp="blackberry" color="colorPalette.600">
          {m.www_microinternship_hero_card_mentor_label()}
        </Eyebrow>
        <Box fontSize={{ base: "sm", md: "md" }} fontWeight="700">
          {m.www_microinternship_hero_card_mentor_name()}
        </Box>
        <Box display={{ base: "none", md: "block" }} fontSize="sm" color="gray.700">
          {m.www_microinternship_hero_card_mentor_agenda()}
        </Box>
      </Box>
    </Wash>
  );
}

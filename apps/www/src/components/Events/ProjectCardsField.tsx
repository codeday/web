import * as m from "@codeday/i18n/messages";
import { Box, Card, CardBody, Eyebrow, Image, Link, Text } from "@codeday/topo/Atom";
import React from "react";

// Self-inverting — paired with plain `white` cards below, so both flip
// together in dark mode and stay contrasted either way.
const INK = "{colors.black}";
const BODY = "{colors.gray.700}";
const CAPTION = "{colors.gray.600}";
const HAIRLINE = "{colors.current.border}";
const ACCENT = "{colors.colorPalette.800}";

export interface HeroProject {
  id: string;
  name: string;
  description?: string | null;
  image?: string | null;
  awardName?: string | null;
  city?: string | null;
  href: string;
}

const TILT_DESKTOP = [
  { left: "8", top: "12", width: "72", rotate: "-4deg", tint: "orange.100" },
  { left: "96", top: "20", width: "72", rotate: "3deg", tint: "cyan.100" },
  { left: "16", top: "80", width: "72", rotate: "2deg", tint: "gray.100" },
  { left: "96", top: "96", width: "72", rotate: "-3deg", tint: "purple.100" },
];

const TILT_MOBILE = [
  { left: "4.5", top: "10", width: "60", rotate: "-4deg", tint: "orange.100" },
  { left: "32", top: "52", width: "60", rotate: "3deg", tint: "cyan.100" },
  { left: "7", top: "96", width: "60", rotate: "-2deg", tint: "purple.100" },
];

function ProjectCard({
  project,
  position,
}: {
  project: HeroProject;
  position: { left: string; top: string; width: string; rotate: string; tint: string };
}) {
  return (
    <Card
      as="a"
      {...({ href: project.href, target: "_blank", rel: "noopener noreferrer" } as any)}
      position="absolute"
      left={position.left}
      top={position.top}
      width={position.width}
      transform={`rotate(${position.rotate})`}
      transition="transform {durations.moderate} ease"
      _hover={{ transform: "rotate(0deg) scale(1.03)", zIndex: 5 }}
      background="white"
      boxShadow="0 18px 40px rgba(18,5,16,0.14)"
      textDecoration="none"
      color={INK}
    >
      <CardBody
        boxSizing="border-box"
        padding="{spacing.3} {spacing.3} {spacing.3.5}"
        display="flex"
        flexDirection="column"
        gap="2.5"
      >
        <Box
          height="36"
          borderRadius="xl"
          background={position.tint}
          display="flex"
          alignItems="center"
          justifyContent="center"
          overflow="hidden"
        >
          {project.image && (
            <Image src={project.image} alt="" width="full" height="full" objectFit="cover" />
          )}
        </Box>
        <Box display="flex" flexDirection="column" gap="1" paddingInline="1">
          <Text as="span" fontSize="lg" fontWeight="700" lineHeight="shorter" margin={0}>
            {project.name}
          </Text>
          {project.description && (
            <Text
              as="span"
              fontSize="sm"
              lineHeight="short"
              color={BODY}
              margin={0}
              css={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {project.description}
            </Text>
          )}
        </Box>
        {(project.awardName || project.city) && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            paddingTop="1.5"
            paddingInline="1"
            borderTop={`{borders.sm} ${HAIRLINE}`}
          >
            <Eyebrow ramp="blackberry">{project.awardName || ""}</Eyebrow>
            <Text as="span" fontSize="xs" color={CAPTION}>
              {project.city || ""}
            </Text>
          </Box>
        )}
      </CardBody>
    </Card>
  );
}

// The hero's right column: a scatter of tilted showcase-project cards (four
// on desktop, three on phones) with a link out to the full showcase below.
export default function ProjectCardsField({ projects }: { projects: HeroProject[] }) {
  return (
    <Box display="flex" flexDirection="column" gap="3.5">
      <Box position="relative" height={{ base: "xl", lg: "2xl" }}>
        {TILT_DESKTOP.map((position, i) =>
          projects[i] ? (
            <Box key={projects[i].id} display={{ base: "none", lg: "block" }}>
              <ProjectCard project={projects[i]} position={position} />
            </Box>
          ) : null,
        )}
        {TILT_MOBILE.map((position, i) =>
          projects[i] ? (
            <Box key={`m-${projects[i].id}`} display={{ base: "block", lg: "none" }}>
              <ProjectCard project={projects[i]} position={position} />
            </Box>
          ) : null,
        )}
      </Box>
      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        flexWrap="wrap"
        gap="1"
        fontSize="sm"
        color={BODY}
        paddingInline="2"
      >
        <Link
          href="https://showcase.codeday.org"
          target="_blank"
          rel="noopener noreferrer"
          fontWeight="600"
          whiteSpace="nowrap"
          color={ACCENT}
        >
          {m.www_events_showcase_link()}
        </Link>
      </Box>
    </Box>
  );
}

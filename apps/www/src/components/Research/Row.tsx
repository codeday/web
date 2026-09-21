import * as m from "@codeday/i18n/messages";
import { Box } from "@codeday/topo/Atom";
import React, { useState } from "react";

import type { Publication } from "../../lib/research/types";
import CitePanel from "./CitePanel";
import { dmMono } from "./fonts";

function rowLabel(pub: Publication): string {
  if (pub.type === "paper") {
    if (pub.kind === "poster") return m.www_research_label_poster();
    if (pub.kind === "journal") return m.www_research_label_journal_paper();
    return m.www_research_label_conference_paper();
  }
  if (pub.type === "preprint") return m.www_research_label_preprint();
  if (pub.type === "report")
    return pub.kind === "independent"
      ? m.www_research_label_independent()
      : m.www_research_label_report();
  if (pub.type === "talk")
    return pub.kind === "panel" ? m.www_research_label_panel() : m.www_research_label_talk();
  return m.www_research_label_dataset();
}

function Pill({
  href,
  label,
  onClick,
  pressed,
}: {
  href?: string;
  label: React.ReactNode;
  onClick?: () => void;
  pressed?: boolean;
}) {
  const content = (
    <Box
      as={href ? "a" : "button"}
      onClick={onClick}
      display="inline-flex"
      alignItems="center"
      gap="1"
      fontFamily={dmMono.style.fontFamily}
      fontSize="xs"
      letterSpacing="wider"
      paddingInline="2.5"
      paddingBlock="1.5"
      borderRadius="full"
      borderWidth="1.5px"
      borderColor={pressed ? "black" : "gray.300"}
      bg={pressed ? "black" : "transparent"}
      color={pressed ? "white" : "gray.700"}
      textDecoration="none"
      cursor="pointer"
      _hover={{ borderColor: "colorPalette.600", color: pressed ? "white" : "colorPalette.600" }}
      {...({
        ...(href
          ? { href, target: "_blank", rel: "noopener" }
          : { type: "button", "aria-pressed": pressed }),
      } as any)}
    >
      {label}
      {href && (
        <Box as="span" aria-hidden="true">
          ↗
        </Box>
      )}
    </Box>
  );
  return content;
}

export default function Row({ publication, first }: { publication: Publication; first?: boolean }) {
  const [citeOpen, setCiteOpen] = useState(false);
  const titleHref = publication.links[0]?.url;
  const panelId = `cite-${publication.id}`;

  return (
    <Box
      display="grid"
      gridTemplateColumns={{ base: "1fr", md: "1fr auto" }}
      columnGap="8"
      paddingBlock="22px 24px"
      borderTop={first ? "0" : "sm"}
      borderTopColor="colorPalette.300"
    >
      <Box>
        <Box
          fontSize="xs"
          color="gray.600"
          display="flex"
          flexWrap="wrap"
          alignItems="center"
          gap="1.5"
        >
          <Box
            as="span"
            fontFamily={dmMono.style.fontFamily}
            fontSize="2xs"
            letterSpacing="0.14em"
            textTransform="uppercase"
            fontWeight="500"
            color="colorPalette.600"
          >
            {rowLabel(publication)}
          </Box>
          <Box as="span" color="gray.500">
            ·
          </Box>
          <Box as="span">{publication.venue}</Box>
        </Box>

        <Box
          as="h3"
          fontSize="xl"
          fontWeight="600"
          lineHeight="shorter"
          maxWidth="46ch"
          marginBlockStart="1.5"
          css={{ textWrap: "pretty" }}
        >
          {titleHref ? (
            <Box
              as="a"
              {...({ href: titleHref, target: "_blank", rel: "noopener" } as any)}
              color="inherit"
              textDecoration="none"
              _hover={{
                textDecoration: "underline",
                textDecorationColor: "colorPalette.600",
                textUnderlineOffset:
                  "3px" /* FIXME: no clean token match (space scale jumps 2px/4px = 0.5/1, both ~33% off) — needs human input */,
              }}
            >
              {publication.title}
            </Box>
          ) : (
            publication.title
          )}
        </Box>

        {publication.authors.length > 0 && (
          <Box fontSize="sm" color="gray.600" marginBlockStart="1.5">
            {publication.authors.map((author) => author.name).join(", ")}
          </Box>
        )}

        {publication.summary && (
          <Box
            fontSize="md"
            lineHeight="moderate"
            color="gray.700"
            maxWidth="prose"
            marginBlockStart="2"
          >
            {publication.summary}
          </Box>
        )}
      </Box>

      <Box
        display="flex"
        flexWrap="wrap"
        alignItems="flex-start"
        gap="2"
        marginBlockStart={{ base: "3", md: "0" }}
      >
        {publication.links.map((link) => (
          <Pill key={link.url} href={link.url} label={link.label} />
        ))}
        <Pill
          label={citeOpen ? m.www_research_cite_close() : m.www_research_cite()}
          pressed={citeOpen}
          onClick={() => setCiteOpen((v) => !v)}
        />
      </Box>

      <Box gridColumn="1 / -1" hidden={!citeOpen} id={panelId} aria-hidden={!citeOpen}>
        {citeOpen && <CitePanel publication={publication} />}
      </Box>
    </Box>
  );
}

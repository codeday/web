import * as m from "@codeday/i18n/messages";
import { Box } from "@codeday/topo/Atom";
import { Wash } from "@codeday/topo/Molecule";
import React, { useState } from "react";

import { acmReference, bibtex } from "../../lib/research/cite";
import type { Publication } from "../../lib/research/types";
import { dmMono } from "./fonts";

async function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {}
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

function CopyPill({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <Box
      as="button"
      onClick={async () => {
        await copyToClipboard(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1400);
      }}
      {...({ type: "button" } as any)}
      fontFamily={dmMono.style.fontFamily}
      fontSize="xs"
      letterSpacing="wider"
      paddingInline="2.5"
      paddingBlock="1.5"
      borderRadius="full"
      borderWidth="1.5px"
      borderColor="gray.300"
      bg="transparent"
      color="gray.700"
      cursor="pointer"
      _hover={{ borderColor: "colorPalette.600", color: "colorPalette.600" }}
    >
      {copied ? m.www_research_cite_copied() : label}
    </Box>
  );
}

export default function CitePanel({ publication }: { publication: Publication }) {
  const reference = acmReference(publication);
  const bibtexEntry = bibtex(publication);

  return (
    <Wash ramp="chilioil" shape="tint" borderRadius="xl" paddingBlock="4" paddingInline="5">
      <Box
        fontFamily={dmMono.style.fontFamily}
        fontSize="2xs"
        letterSpacing="0.14em"
        textTransform="uppercase"
        color="colorPalette.600"
      >
        {m.www_research_cite_acm_label()}
      </Box>
      <Box fontSize="sm" lineHeight="moderate" marginBlockStart="1.5">
        {reference}
      </Box>

      <Box
        fontFamily={dmMono.style.fontFamily}
        fontSize="2xs"
        letterSpacing="0.14em"
        textTransform="uppercase"
        color="colorPalette.600"
        marginBlockStart="4"
      >
        {m.www_research_cite_bibtex_label()}
      </Box>
      <Box
        as="pre"
        fontFamily={dmMono.style.fontFamily}
        fontSize="xs"
        lineHeight="moderate"
        marginBlockStart="1.5"
        whiteSpace="pre-wrap"
        css={{ wordBreak: "break-word" }}
      >
        {bibtexEntry}
      </Box>

      <Box display="flex" justifyContent="flex-end" gap="2" marginBlockStart="3.5">
        <CopyPill text={reference} label={m.www_research_cite_copy_reference()} />
        <CopyPill text={bibtexEntry} label={m.www_research_cite_copy_bibtex()} />
      </Box>
    </Wash>
  );
}

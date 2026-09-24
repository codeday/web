import * as m from "@codeday/i18n/messages";
import { Box, Button } from "@codeday/topo/Atom";
import React, { useEffect, useState } from "react";

import { getEmailTemplates } from "../../lib/schoolPartnership/templates";

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

export default function EmailSample() {
  const templates = getEmailTemplates();
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIndex(Math.floor(Math.random() * templates.length));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const template = templates[index];
  const fullEmail = `Subject: ${template.subject}\n\n${template.body}`;

  return (
    <Box
      boxSizing="border-box"
      padding="{spacing.7}"
      borderRadius="3xl"
      border="1.5px solid"
      borderColor="current.border"
      background="white"
      display="flex"
      flexDirection="column"
      gap="5"
    >
      <Box display="flex" flexDirection="column" gap="1">
        <Box
          fontSize="xs"
          fontWeight="600"
          textTransform="uppercase"
          letterSpacing="0.08em"
          color="colorPalette.600"
        >
          {m.www_schoolpartnership_sample_subject_label()}
        </Box>
        <Box fontSize="lg" fontWeight="700">
          {template.subject}
        </Box>
      </Box>
      <Box
        as="pre"
        fontFamily="inherit"
        fontSize="md"
        lineHeight="moderate"
        whiteSpace="pre-wrap"
        margin="0"
        color="gray.700"
      >
        {template.body}
      </Box>
      <Box display="flex" gap="3" flexWrap="wrap">
        <Button
          variant="primary"
          colorPalette="blackberry"
          onClick={async () => {
            await copyToClipboard(fullEmail);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
          }}
        >
          {copied ? m.www_schoolpartnership_copied() : m.www_schoolpartnership_copy_cta()}
        </Button>
        <Button
          variant="secondary"
          colorPalette="blackberry"
          onClick={() => setIndex((i) => (i + 1) % templates.length)}
        >
          {m.www_schoolpartnership_shuffle_cta()}
        </Button>
      </Box>
    </Box>
  );
}

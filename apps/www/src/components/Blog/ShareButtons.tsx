import * as m from "@codeday/i18n/messages";
import { Box, type BoxProps } from "@codeday/topo/Atom";
import { Email, UiCheck, UiShare } from "@codeday/topocons";
import React, { useEffect, useState } from "react";

const COPIED_MS = 2000;

const ROUND_BUTTON: BoxProps = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  boxSize: "10",
  borderRadius: "full",
  borderWidth: "1px",
  borderColor: "current.border",
  bg: "current.bg",
  color: "hibiscus.800",
  cursor: "pointer",
  fontSize: "lg",
  focusVisibleRing: "outside",
  focusRingColor: "hibiscus.600",
  _hover: { bg: "gray.50", borderColor: "gray.400" },
};

export interface ShareButtonsProps {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return undefined;
    const timeout = setTimeout(() => setCopied(false), COPIED_MS);
    return () => clearTimeout(timeout);
  }, [copied]);

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
  };

  const mailto = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`;

  return (
    <Box display="flex" gap="2" role="group" aria-label={m.www_blog_share_label()}>
      <Box
        as="button"
        {...({ type: "button" } as any)}
        onClick={copy}
        aria-label={copied ? m.www_blog_copy_link_done() : m.www_blog_copy_link()}
        title={m.www_blog_copy_link()}
        {...ROUND_BUTTON}
      >
        {copied ? <UiCheck aria-hidden /> : <UiShare aria-hidden />}
      </Box>
      <Box
        as="a"
        {...({ href: mailto } as any)}
        aria-label={m.www_blog_share_email()}
        title={m.www_blog_share_email()}
        {...ROUND_BUTTON}
      >
        <Email aria-hidden />
      </Box>
      <Box as="span" aria-live="polite" visuallyHidden>
        {copied ? m.www_blog_copy_link_done() : ""}
      </Box>
    </Box>
  );
}

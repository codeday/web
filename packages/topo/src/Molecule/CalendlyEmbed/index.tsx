import { Box } from "@codeday/topo/Atom";
import React, { useEffect, useState, useRef } from "react";

interface CalendlyEmbedProps {
  slug: string;
  meeting?: string;
  calendlyURLParams?: string;
  [key: string]: any;
}

export function CalendlyEmbed({ slug, meeting, calendlyURLParams, ...props }: CalendlyEmbedProps) {
  const holder = useRef<HTMLDivElement>(null);
  const [hasCalendlyLoaded, setHasCalendlyLoaded] = useState(false);

  const typeOfWindow = typeof window; // For static analysis
  const windowCalendly = typeOfWindow !== "undefined" && (window as any)?.Calendly;

  useEffect(() => {
    if (window && !(window as any).Calendly) {
      const script = document.createElement("script");
      script.src = "https://calendly.com/assets/external/widget.js";
      script.addEventListener("load", () => {
        setHasCalendlyLoaded(true);
      });
      document.head.appendChild(script);

      const link = document.createElement("link");
      link.href = "https://calendly.com/assets/external/widget.css";
      link.rel = "stylesheet";
      document.body.appendChild(link);

      return () => {
        document.head.removeChild(script);
        document.body.removeChild(link);
      };
    }
  }, [typeOfWindow]);

  useEffect(() => {
    if (windowCalendly && holder) {
      (window as any).Calendly.initInlineWidget({
        url: `https://calendly.com/${slug}${meeting ? `/${meeting}` : ""}${calendlyURLParams || ""}`,
        parentElement: holder.current,
        prefill: {},
        utm: {},
      });
    }
  }, [windowCalendly, hasCalendlyLoaded, holder, slug, meeting]);

  return <Box w="100%" h="50em" border="none" {...props} ref={holder} />;
}

export type { CalendlyEmbedProps };

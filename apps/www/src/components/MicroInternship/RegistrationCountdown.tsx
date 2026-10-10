import * as m from "@codeday/i18n/messages";
import { getLocale } from "@codeday/i18n/runtime";
import { Box, type BoxProps } from "@codeday/topo/Atom";
import React, { useEffect, useState } from "react";

const UNIT_SECONDS = { day: 86400, hour: 3600, minute: 60, second: 1 } as const;

function formatRemaining(closesAt: number, now: number, locale: string) {
  let remaining = Math.max(0, Math.floor((closesAt - now) / 1000));
  const parts = Object.entries(UNIT_SECONDS).map(([unit, seconds]) => {
    const value = Math.floor(remaining / seconds);
    remaining -= value * seconds;
    return new Intl.NumberFormat(locale, {
      style: "unit",
      unit,
      unitDisplay: "narrow",
      minimumIntegerDigits: unit === "day" ? 1 : 2,
    }).format(value);
  });
  return new Intl.ListFormat(locale, { type: "unit", style: "narrow" }).format(parts);
}

export interface RegistrationCountdownProps extends Omit<BoxProps, "children"> {
  closesAt: string;
}

export default function RegistrationCountdown({ closesAt, ...props }: RegistrationCountdownProps) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const closesAtMs = new Date(closesAt).getTime();

  return (
    <Box display="inline-flex" alignItems="center" gap="2.5" {...props}>
      <Box
        width="2.5"
        height="2.5"
        borderRadius="full"
        bg="orange.600"
        flexShrink={0}
        animation="pulse"
        _motionReduce={{ animation: "none" }}
        aria-hidden
      />
      <Box
        as="span"
        role="timer"
        aria-label={m.www_microinternship_individual_title_countdown_label()}
        fontFamily="mono"
        fontSize="lg"
        fontWeight="700"
        fontVariantNumeric="tabular-nums"
        color="orange.600"
      >
        {formatRemaining(closesAtMs, now ?? closesAtMs, getLocale())}
      </Box>
    </Box>
  );
}

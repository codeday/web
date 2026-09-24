import * as m from "@codeday/i18n/messages";
import { Box, type BoxProps } from "@codeday/topo/Atom";
import React, { useEffect, useState } from "react";

const pad = (n: number) => String(n).padStart(2, "0");

function remaining(closesAt: number, now: number) {
  const total = Math.max(0, Math.floor((closesAt - now) / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: pad(Math.floor((total % 86400) / 3600)),
    minutes: pad(Math.floor((total % 3600) / 60)),
    seconds: pad(total % 60),
  };
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
  const parts = remaining(closesAtMs, now ?? closesAtMs);

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
        {m.www_microinternship_individual_title_countdown(parts)}
      </Box>
    </Box>
  );
}

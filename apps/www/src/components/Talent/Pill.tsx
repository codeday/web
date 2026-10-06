import { Badge, type BadgeProps } from "@codeday/topo/Atom";
import { SQUIRCLE_CORNER_SHAPE } from "@codeday/topo/Theme";
import React from "react";

export const SQUIRCLE = {
  borderRadius: "xl",
  css: { cornerShape: SQUIRCLE_CORNER_SHAPE },
} as const;

export type TalentPillTone = "neutral" | "endorsement" | "positive" | "onDark";

const TONES: Record<TalentPillTone, { bg: string; color: string }> = {
  neutral: { bg: "gray.100", color: "gray.900" },
  endorsement: { bg: "purple.100", color: "purple.900" },
  positive: { bg: "green.100", color: "green.900" },
  onDark: { bg: "whiteAlpha.300", color: "trueWhite" },
};

interface TalentPillProps extends Omit<BadgeProps, "variant"> {
  tone: TalentPillTone;
}

export function TalentPill({ tone, ...props }: TalentPillProps) {
  return <Badge whiteSpace="normal" {...TONES[tone]} {...props} />;
}

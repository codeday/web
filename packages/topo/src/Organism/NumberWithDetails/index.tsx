import { Box, type BoxProps, GradientText } from "@codeday/topo/Atom";
import React from "react";

import { type GradientName } from "../../Theme/vars/colors";

export interface NumberWithDetailsItem {
  id: string;
  number: React.ReactNode;
  heading: React.ReactNode;
  body: React.ReactNode;
}

export interface NumberWithDetailsProps extends Omit<BoxProps, "children"> {
  ramp: GradientName;
  items: NumberWithDetailsItem[];
}

function ItemRow({
  item,
  ramp,
  isLast,
}: {
  item: NumberWithDetailsItem;
  ramp: GradientName;
  isLast: boolean;
}) {
  return (
    <Box
      display="grid"
      gridTemplateColumns={{ base: "1fr", md: "{sizes.3xs} 1fr" }}
      columnGap="8"
      rowGap="3"
      paddingBlock="7"
      borderTop="sm"
      borderTopColor="current.border"
      _last={isLast ? { borderBottom: "sm", borderBottomColor: "current.border" } : undefined}
      alignItems="start"
    >
      <GradientText ramp={ramp} fontSize="6xl" lineHeight="1" fontWeight="800">
        {item.number}
      </GradientText>
      <Box display="flex" flexDirection="column" gap="2" maxWidth="3xl">
        <Box as="h3" margin="0" fontSize="2xl" fontWeight="700">
          {item.heading}
        </Box>
        <Box fontSize="lg" lineHeight="moderate" color="gray.700">
          {item.body}
        </Box>
      </Box>
    </Box>
  );
}

export const NumberWithDetails = React.forwardRef<HTMLDivElement, NumberWithDetailsProps>(
  ({ ramp, items, ...props }, ref) => (
    <Box ref={ref} {...props}>
      {items.map((item, i) => (
        <ItemRow key={item.id} item={item} ramp={ramp} isLast={i === items.length - 1} />
      ))}
    </Box>
  ),
);
NumberWithDetails.displayName = "NumberWithDetails";

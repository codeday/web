import { Box, type BoxProps } from "@codeday/topo/Atom";
import { ActionLink } from "@codeday/topo/Molecule";
import React from "react";

import { type GradientName } from "../../Theme/vars/colors";
import type { Message } from "../../utils";

export type RowListVariant = "waysIn";

export interface RowListAction {
  label: Message;
  href: string;
}

export interface RowListRow {
  id: string;
  lead: Message;
  body: Message;
  actions?: RowListAction[];
}

export interface RowListProps extends Omit<BoxProps, "children"> {
  variant: RowListVariant;
  gradient: GradientName;
  rows: RowListRow[];
}

const GRID_TEMPLATE: Record<RowListVariant, string> = {
  waysIn: "{sizes.52} 1fr {sizes.36}",
};

const CLAMP_TWO_LINES = {
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical" as const,
  overflow: "hidden",
};

function RowListRowView({ row, variant }: { row: RowListRow; variant: RowListVariant }) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="2"
      css={{
        "@media (min-width: 48em)": {
          display: "grid",
          gridTemplateColumns: GRID_TEMPLATE[variant],
          gap: "5",
          alignItems: "baseline",
        },
      }}
      paddingBlock="5"
      borderTop="sm"
      borderTopColor="colorPalette.300"
      _first={{ borderTop: "none" }}
    >
      <Box fontSize="xl" fontWeight="700" color="black">
        {row.lead}
      </Box>
      <Box fontSize="md" color="gray.700" css={CLAMP_TWO_LINES}>
        {row.body}
      </Box>
      {row.actions && row.actions.length > 0 && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          gap="1.5"
          css={{ "@media (min-width: 48em)": { alignItems: "flex-end" } }}
        >
          {row.actions.map((action, i) => (
            <ActionLink
              key={i}
              label={action.label}
              href={action.href}
              {...({ "data-analytics-id": `rowlist-waysin-${row.id}` } as any)}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

export const RowList = React.forwardRef<HTMLDivElement, RowListProps>(
  ({ variant, gradient, rows, ...props }, ref) => (
    <Box ref={ref} colorPalette={gradient} {...props}>
      <Box>
        {rows.map((row) => (
          <RowListRowView key={row.id} row={row} variant={variant} />
        ))}
      </Box>
    </Box>
  ),
);
RowList.displayName = "RowList";

import { Box, Pagination } from "@codeday/topo/Atom";
import { UiArrowLeft, UiArrowRight } from "@codeday/topocons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

const meta: Meta<typeof Pagination.Root> = {
  title: "Atom/Pagination",
  component: Pagination.Root,
};
export default meta;

type Story = StoryObj<typeof Pagination.Root>;

export const Default: Story = {
  name: "Pagination — authored from scratch, current page is the 62% stop",
  render: () => (
    <Box display="flex" flexWrap="wrap" gap={4}>
      <Pagination.Root count={50} pageSize={10} defaultPage={2}>
        <Pagination.PrevTrigger aria-label="Previous page">
          <UiArrowLeft />
        </Pagination.PrevTrigger>
        <Pagination.Items
          render={(page: any) => <Pagination.Item {...page}>{page.value}</Pagination.Item>}
        />
        <Pagination.NextTrigger aria-label="Next page">
          <UiArrowRight />
        </Pagination.NextTrigger>
      </Pagination.Root>
    </Box>
  ),
};

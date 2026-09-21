import { Box, Breadcrumb } from "@codeday/topo/Atom";
import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

const meta: Meta<typeof Breadcrumb.Root> = {
  title: "Atom/Breadcrumb",
  component: Breadcrumb.Root,
};
export default meta;

type Story = StoryObj<typeof Breadcrumb.Root>;

export const Default: Story = {
  name: "Breadcrumb — muted links, last crumb in ink",
  render: () => (
    <Box display="flex" flexWrap="wrap" gap={4}>
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="#">Home</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.Link href="#">Section</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.CurrentLink>Current</Breadcrumb.CurrentLink>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>
    </Box>
  ),
};

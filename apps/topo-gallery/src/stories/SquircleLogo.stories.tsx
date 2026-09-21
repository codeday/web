import { Box, SquircleLogo } from "@codeday/topo/Atom";
import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

const meta: Meta<typeof SquircleLogo> = {
  title: "Atom/SquircleLogo",
  component: SquircleLogo,
};
export default meta;

type Story = StoryObj<typeof SquircleLogo>;

export const ColorOnWhiteAndWhiteOnColor: Story = {
  name: "Colour on white, white on colour — never the other way round",
  render: () => (
    <Box display="flex" flexWrap="wrap" gap={4} alignItems="flex-start">
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <Box
          padding={4}
          bg="white"
          borderWidth="1px"
          borderColor="current.border"
          borderRadius="xl"
        >
          <SquircleLogo boxSize="16" />
        </Box>
        <Box fontSize="sm" color="current.textLight">
          Colour — on white
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <Box padding={4} bg="colorPalette.600" colorPalette="hibiscus" borderRadius="xl">
          <SquircleLogo onWash boxSize="16" />
        </Box>
        <Box fontSize="sm" color="current.textLight">
          White — onWash
        </Box>
      </Box>
    </Box>
  ),
};

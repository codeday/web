import { Box, Button, SquircleLogo } from "@codeday/topo/Atom";
import { Header, HeaderBrand, HeaderLink, HeaderSpacer } from "@codeday/topo/Organism";
import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

const meta: Meta<typeof Header> = {
  title: "Organism/Header",
  component: Header,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Header>;

// Shared link set for both demo headers — a "Programs" link carries
// `items`, so the mobile menu's accordion has something to open. Desktop
// ignores `items` entirely (no dropdown behaviour there).
//
// A plain array of elements, NOT a wrapping component (no `<DemoLinks />`):
// `Header` finds its links by walking `React.Children.toArray(children)`
// and checking each child's own type — a custom component wrapping several
// `HeaderLink`s is one opaque child of that OWN type, not the `HeaderLink`s
// inside it, so nothing would be found. An array of elements, spread
// directly as children, flattens the way `Header` expects.
function demoLinks() {
  return [
    <HeaderLink key="dashboard" href="#" active>
      Dashboard
    </HeaderLink>,
    <HeaderLink
      key="programs"
      href="#"
      items={[
        { label: "CodeDay", href: "#" },
        { label: "Labs", href: "#" },
        { label: "CS Fest", href: "#" },
      ]}
    >
      Programs
    </HeaderLink>,
    <HeaderLink key="events" href="#">
      Events
    </HeaderLink>,
    <HeaderLink key="volunteers" href="#">
      Volunteers
    </HeaderLink>,
  ];
}

export const OnWashAndLightGround: Story = {
  name: "Header — reads the field behind it and flips its own colours",
  render: () => (
    <Box display="flex" flexDirection="column" gap={3} width="full">
      <Header onWash ramp="hibiscus" data-testid="header-on-wash">
        <HeaderBrand>
          <SquircleLogo boxSize="7" />
        </HeaderBrand>
        {demoLinks()}
        <HeaderSpacer />
        <Button size="sm" variant="onColor" color="colorPalette.800">
          Get started
        </Button>
      </Header>
      <Header data-testid="header-light-ground">
        <HeaderBrand>
          <SquircleLogo boxSize="7" />
        </HeaderBrand>
        {demoLinks()}
        <HeaderSpacer />
        <Button size="sm" variant="primary">
          Get started
        </Button>
      </Header>
    </Box>
  ),
};

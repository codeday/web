import { Avatar, Box, Breadcrumb, Pagination, SkipNavLink, Tabs } from "@codeday/topo/Atom";
import React from "react";

import { GalleryPage, Section } from "../components/GalleryLayout";

export default function NavigationPage() {
  return (
    <GalleryPage title="Navigation">
      <Section title="Skip link (visually hidden until focus — tab into the page to see it)">
        <SkipNavLink href="#main">Skip to content</SkipNavLink>
      </Section>

      <Section title="Tabs — 2.5px indicator, inset 8px, in the 62% stop">
        <Tabs.Root defaultValue="one" width="100%">
          <Tabs.List>
            <Tabs.Trigger value="one">One</Tabs.Trigger>
            <Tabs.Trigger value="two">Two</Tabs.Trigger>
            <Tabs.Indicator />
          </Tabs.List>
          <Tabs.Content value="one">Tab one content</Tabs.Content>
          <Tabs.Content value="two">Tab two content</Tabs.Content>
        </Tabs.Root>
      </Section>

      <Section title="Breadcrumb — muted links, last crumb in ink">
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
      </Section>

      <Section title="Pagination — authored from scratch, current page is the 62% stop">
        <Pagination.Root count={50} pageSize={10} defaultPage={2}>
          <Pagination.PrevTrigger>Prev</Pagination.PrevTrigger>
          <Pagination.Items render={(page: any) => <Pagination.Item {...page}>{page.value}</Pagination.Item>} />
          <Pagination.NextTrigger>Next</Pagination.NextTrigger>
        </Pagination.Root>
      </Section>

      <Section title="Avatar — squircle at small sizes">
        <Avatar.Root size="sm" colorPalette="hibiscus">
          <Avatar.Fallback>TM</Avatar.Fallback>
        </Avatar.Root>
        <Avatar.Root colorPalette="figjam">
          <Avatar.Fallback>AB</Avatar.Fallback>
        </Avatar.Root>
      </Section>

      <Box mt={4} fontSize="sm" color="current.textLight">
        Focus-tab from the top of this page to check the skip link appears pinned top-left.
      </Box>
    </GalleryPage>
  );
}

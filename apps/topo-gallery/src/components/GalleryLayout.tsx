import { Box, Heading } from "@codeday/topo/Atom";
import Link from "next/link";
import React from "react";

const ROUTES = [
  ["/", "Index"],
  ["/gradients", "Gradients & fields"],
  ["/buttons-badges", "Buttons & badges"],
  ["/alerts-cards", "Alerts & cards"],
  ["/forms", "Forms"],
  ["/navigation", "Navigation"],
  ["/data", "Data & dashboard"],
  ["/typography", "Typography"],
] as const;

export function GalleryNav() {
  return (
    <Box as="nav" display="flex" gap={4} flexWrap="wrap" p={4} borderBottomWidth={1} mb={8}>
      {ROUTES.map(([href, label]) => (
        <Link key={href} href={href}>
          {label}
        </Link>
      ))}
    </Box>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box mb={12} data-gallery-section={title}>
      <Heading as="h2" fontSize="2xl" mb={4}>
        {title}
      </Heading>
      <Box display="flex" flexWrap="wrap" gap={4} alignItems="flex-start">
        {children}
      </Box>
    </Box>
  );
}

export function GalleryPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box>
      <GalleryNav />
      <Box px={8} pb={16} maxWidth="1000px">
        <Heading as="h1" fontSize="4xl" mb={8}>
          {title}
        </Heading>
        {children}
      </Box>
    </Box>
  );
}

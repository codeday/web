import * as m from "@codeday/i18n/messages";
import { Box, InputGroup, TextInput } from "@codeday/topo/Atom";
import type { Message } from "@codeday/topo/utils";
import { UiSearch } from "@codeday/topocons";
import React from "react";

import { BLOG_CATEGORIES } from "@/lib/blog/categories";

interface FilterPillProps {
  label: Message;
  pressed: boolean;
  onClick: () => void;
}

function FilterPill({ label, pressed, onClick }: FilterPillProps) {
  return (
    <Box
      as="button"
      {...({ type: "button" } as any)}
      aria-pressed={pressed}
      onClick={onClick}
      height="9"
      paddingInline="4"
      borderRadius="full"
      fontSize="sm"
      lineHeight="1"
      cursor="pointer"
      whiteSpace="nowrap"
      focusVisibleRing="outside"
      focusRingColor="hibiscus.600"
      {...(pressed
        ? {
            backgroundImage: "linear-gradient(110deg, {colors.hibiscus.gradient.button})",
            color: "trueWhite",
            fontWeight: "700",
          }
        : {
            bg: "gray.50",
            color: "hibiscus.800",
            fontWeight: "500",
            boxShadow: "inset 0 0 0 1px {colors.current.border}",
            _hover: { bg: "gray.100" },
          })}
    >
      {label}
    </Box>
  );
}

export interface ToolbarProps {
  category: string | null;
  onCategoryChange: (slug: string | null) => void;
  search: string;
  onSearchChange: (value: string) => void;
}

export default function Toolbar({
  category,
  onCategoryChange,
  search,
  onSearchChange,
}: ToolbarProps) {
  return (
    <Box
      display="flex"
      flexDirection={{ base: "column", md: "row" }}
      alignItems={{ base: "stretch", md: "flex-start" }}
      justifyContent="space-between"
      gap="4"
    >
      <Box
        role="group"
        aria-label={m.www_blog_filter_label()}
        display="flex"
        flexWrap="wrap"
        gap="2"
      >
        <FilterPill
          label={m.www_blog_filter_all()}
          pressed={category === null}
          onClick={() => onCategoryChange(null)}
        />
        {BLOG_CATEGORIES.map((c) => (
          <FilterPill
            key={c.slug}
            label={c.label()}
            pressed={category === c.slug}
            onClick={() => onCategoryChange(c.slug)}
          />
        ))}
      </Box>
      <InputGroup
        width={{ base: "full", md: "64" }}
        flexShrink={0}
        startElement={<UiSearch aria-hidden boxSize="4" color="current.textLight" />}
      >
        <TextInput
          type="search"
          autoComplete="off"
          aria-label={m.www_blog_search_label()}
          placeholder={m.www_blog_search_placeholder()}
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
          height="9"
          borderRadius="full"
          fontSize="sm"
          bg="current.bg"
        />
      </InputGroup>
    </Box>
  );
}

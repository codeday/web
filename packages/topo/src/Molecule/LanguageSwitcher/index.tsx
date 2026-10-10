import { Menu, Portal, useBreakpointValue } from "@chakra-ui/react";
import { flagForLocale } from "@codeday/i18n/flags";
import * as m from "@codeday/i18n/messages";
import { baseLocale, getLocale, locales } from "@codeday/i18n/runtime";
import { Box, type BoxProps, Button } from "@codeday/topo/Atom";
import { Globe, UiArrowDown, UiCheck } from "@codeday/topocons";
import { useRouter } from "next/compat/router";
import React, { useState } from "react";

interface LocaleOption {
  locale: string;
  code: string;
  name: string;
  region?: string;
  label: string;
  flag?: string;
}

const LOCALE_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

const capitalize = (text: string, locale: string) =>
  text.charAt(0).toLocaleUpperCase(locale) + text.slice(1);

function buildLocaleOptions(): LocaleOption[] {
  const parsed = locales.map((locale) => {
    const intl = new Intl.Locale(locale);
    return { locale, language: intl.language, region: intl.maximize().region };
  });
  const sharesLanguage = (language: string) =>
    parsed.filter((other) => other.language === language).length > 1;

  const options = parsed.map(({ locale, language, region }) => {
    const name = capitalize(
      new Intl.DisplayNames([locale], { type: "language" }).of(language) ?? language,
      locale,
    );
    const regionName =
      region && sharesLanguage(language)
        ? new Intl.DisplayNames([locale], { type: "region" }).of(region)
        : undefined;
    return {
      locale,
      code: language.toUpperCase(),
      name,
      region: regionName,
      label: regionName ? `${name} (${regionName})` : name,
      flag: flagForLocale(locale),
    };
  });

  const collator = new Intl.Collator("und");
  return options.sort((a, b) =>
    a.locale === baseLocale ? -1 : b.locale === baseLocale ? 1 : collator.compare(a.label, b.label),
  );
}

const LOCALE_OPTIONS = buildLocaleOptions();

function Flag({ src, ...props }: { src?: string } & BoxProps) {
  if (!src) return null;
  return (
    <Box
      as="img"
      {...({ src, alt: "" } as any)}
      aria-hidden="true"
      borderRadius="full"
      flexShrink={0}
      objectFit="cover"
      {...props}
    />
  );
}

// Anchors the mobile menu to the header's padded content box, so it spans the
// viewport minus the header's own gutter instead of hugging the trigger.
function headerContentRect(element: HTMLElement | { getBoundingClientRect(): DOMRect } | null) {
  const header = element instanceof HTMLElement ? element.closest("header") : null;
  if (!element || !header) return null;
  const headerRect = header.getBoundingClientRect();
  const triggerRect = element.getBoundingClientRect();
  const style = getComputedStyle(header);
  const start = parseFloat(style.paddingInlineStart);
  const end = parseFloat(style.paddingInlineEnd);
  return {
    x: headerRect.left + start,
    y: triggerRect.top,
    width: headerRect.width - start - end,
    height: triggerRect.height,
  };
}

export interface LanguageSwitcherProps {
  /** Render for a dark/colored header (light outline) rather than a light one. */
  onColor?: boolean;
}

export function LanguageSwitcher({ onColor = true }: LanguageSwitcherProps) {
  const router = useRouter();
  const [storyLocale, setStoryLocale] = useState<string>(getLocale());
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const isMobile = useBreakpointValue({ base: true, md: false }) ?? false;

  const currentLocale = router ? getLocale() : storyLocale;
  const current =
    LOCALE_OPTIONS.find((option) => option.locale === currentLocale) ?? LOCALE_OPTIONS[0];

  const selectLocale = (locale: string) => {
    if (locale === current.locale) return;
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE_SECONDS}; samesite=lax`;
    if (router) {
      void router.push({ pathname: router.pathname, query: router.query }, router.asPath, {
        locale,
      });
    } else {
      setStoryLocale(locale);
    }
  };

  return (
    <Menu.Root
      open={open}
      onOpenChange={({ open: nextOpen }) => {
        setOpen(nextOpen);
        setHighlighted(nextOpen ? current.locale : null);
      }}
      highlightedValue={highlighted}
      onHighlightChange={({ highlightedValue }) => setHighlighted(highlightedValue)}
      positioning={
        isMobile
          ? { placement: "bottom", sameWidth: true, getAnchorRect: headerContentRect }
          : { placement: "bottom-end" }
      }
    >
      <Menu.Trigger asChild>
        <Button
          variant={onColor ? "onColorOutline" : "secondary"}
          size="sm"
          aria-label={m.topo_languageswitcher_label({ language: current.label })}
          flexShrink={0}
          border="none"
          gap="1.5"
          paddingInline="2.5"
          paddingBlock={{ base: "3", md: "1.5" }}
          minHeight={{ base: "11", md: "auto" }}
          _open={{ bg: onColor ? "whiteAlpha.200" : "colorPalette.100" }}
        >
          <Box position="relative" flexShrink={0}>
            <Globe boxSize="4.5" display="block" />
            <Flag
              src={current.flag}
              position="absolute"
              right="-1"
              bottom="-1"
              boxSize="3"
              border="sm"
              borderColor="trueWhite"
            />
          </Box>
          <Box as="span" marginInlineStart="1" fontSize="sm" fontWeight="600" letterSpacing="wide">
            {current.code}
          </Box>
          <UiArrowDown
            boxSize="3"
            transform={open ? "rotate(180deg)" : undefined}
            transition="transform {durations.fast} ease-out"
          />
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content
            colorPalette="hibiscus"
            bg="bg.panel"
            color="fg"
            border="sm"
            borderColor="gray.200"
            borderRadius={{ base: "2xl", md: "xl" }}
            boxShadow="lg"
            padding="1.5"
            minWidth="0"
            width={{ base: "full", md: "max-content" }}
          >
            <Menu.RadioItemGroup
              value={current.locale}
              onValueChange={({ value }) => selectLocale(value)}
            >
              {LOCALE_OPTIONS.map((option) => {
                const selected = option.locale === current.locale;
                return (
                  <Menu.RadioItem
                    key={option.locale}
                    value={option.locale}
                    display="flex"
                    alignItems="center"
                    gap="3"
                    minHeight={{ base: "12", md: "11" }}
                    paddingInline={{ base: "3", md: "2.5" }}
                    borderRadius={{ base: "xl", md: "lg" }}
                    cursor="pointer"
                    fontSize={{ base: "md", md: "sm" }}
                    fontWeight={selected ? "600" : "400"}
                    bg={selected ? "colorPalette.subtle" : undefined}
                    _highlighted={{ bg: selected ? "colorPalette.subtle" : "bg.subtle" }}
                  >
                    <Flag src={option.flag} boxSize="5" border="sm" borderColor="gray.200" />
                    <Box
                      as="span"
                      {...({ lang: option.locale } as any)}
                      display="flex"
                      alignItems="baseline"
                      gap="1.5"
                    >
                      {option.name}
                      {option.region && (
                        <Box
                          as="span"
                          fontSize={{ base: "sm", md: "xs" }}
                          fontWeight="400"
                          color="fg.muted"
                        >
                          {option.region}
                        </Box>
                      )}
                    </Box>
                    <Menu.ItemIndicator
                      position="static"
                      transform="none"
                      display="flex"
                      marginInlineStart="auto"
                      paddingInlineStart="3"
                    >
                      <UiCheck boxSize={{ base: "5", md: "4.5" }} color="colorPalette.fg" />
                    </Menu.ItemIndicator>
                  </Menu.RadioItem>
                );
              })}
            </Menu.RadioItemGroup>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}

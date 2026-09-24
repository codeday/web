import { Box, type BoxProps, Eyebrow, Image } from "@codeday/topo/Atom";
import React from "react";

import { darkColors, legacyThemeData, useColorMode } from "../../Theme";
import type { Message } from "../../utils";

export interface CreditListsEntry {
  name: string;
  href?: string;
  logo?: string;
  darkLogo?: string;
  mono?: boolean;
  quote?: Message;
}

export interface CreditListsGroup {
  id: string;
  label: Message;
  kind: "logos" | "names" | "press";
  entries: CreditListsEntry[];
}

export interface CreditListsProps extends Omit<BoxProps, "children"> {
  groups: CreditListsGroup[];
}

function LogoMark({ entry }: { entry: CreditListsEntry }) {
  const { colorMode } = useColorMode();
  const src = colorMode === "dark" && entry.darkLogo ? entry.darkLogo : entry.logo;
  const mono = entry.mono && !!src;
  // Resolved to a literal hex rather than passed as the `"gray.700"` token
  // string — see `LogoWall`'s `LogoMark` (`Index/LogoWall.tsx` in `apps/www`)
  // for why: a token (or `useToken`) resolves to
  // `var(--chakra-colors-gray-700)`, and WebKit has been observed to leave
  // this masked layer's `background-color` painted in the *previous* mode's
  // colour when only that variable's value changes underneath it. With
  // `src` now swapping on colour-mode change, the literal hex ensures the
  // masked layer repaints in step with the mark — never leaving the fill
  // in the previous mode's colour.
  const color = colorMode === "dark" ? darkColors.gray[700] : legacyThemeData.colors.gray[700];
  const mark = (
    <Box position="relative" display="inline-block" height="12">
      <Image src={src} alt={entry.name} height="12" width="auto" opacity={mono ? 0 : 1} />
      {mono && (
        <Box
          aria-hidden="true"
          position="absolute"
          inset="0"
          backgroundColor={color}
          css={{
            maskImage: `url(${src})`,
            WebkitMaskImage: `url(${src})`,
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskPosition: "center",
            WebkitMaskPosition: "center",
            maskSize: "contain",
            WebkitMaskSize: "contain",
          }}
        />
      )}
    </Box>
  );
  return entry.href ? (
    <Box as="a" display="inline-block" {...({ href: entry.href } as any)}>
      {mark}
    </Box>
  ) : (
    mark
  );
}

function LogosRow({ entries }: { entries: CreditListsEntry[] }) {
  return (
    <Box
      display="flex"
      flexWrap="wrap"
      alignItems="center"
      css={{ gap: "{spacing.4.5} {spacing.7}" }}
    >
      {entries.map((entry, i) => (
        <LogoMark key={i} entry={entry} />
      ))}
    </Box>
  );
}

function NamesRow({ entries }: { entries: CreditListsEntry[] }) {
  return (
    <Box fontSize="md" color="black">
      {entries.map((entry, i) => {
        const name = entry.href ? (
          <Box as="a" color="inherit" {...({ href: entry.href } as any)}>
            {entry.name}
          </Box>
        ) : (
          entry.name
        );
        return (
          <React.Fragment key={i}>
            {i > 0 && (
              <Box as="span" color="gray.500" marginX="2">
                ·
              </Box>
            )}
            {name}
          </React.Fragment>
        );
      })}
    </Box>
  );
}

function PressList({ entries }: { entries: CreditListsEntry[] }) {
  return (
    <Box display="flex" flexDirection="column" gap="4">
      {entries.map((entry, i) => {
        const body = (
          <>
            <Box fontFamily="mono" fontSize="xs" color="gray.600">
              {entry.name}
            </Box>
            {entry.quote && (
              <Box fontSize="lg" color="black" marginTop="1">
                {entry.quote}
              </Box>
            )}
          </>
        );
        return entry.href ? (
          <Box as="a" key={i} {...({ href: entry.href } as any)}>
            {body}
          </Box>
        ) : (
          <Box key={i}>{body}</Box>
        );
      })}
    </Box>
  );
}

export const CreditLists = React.forwardRef<HTMLElement, CreditListsProps>(
  ({ groups, ...props }, ref) => (
    <Box as="div" ref={ref as any} colorPalette="hibiscus" {...props}>
      <Box display="flex" flexDirection="column" gap="10">
        {groups.map((group) => (
          <Box key={group.id}>
            <Eyebrow ramp="hibiscus" color="colorPalette.600" display="block" marginBottom="3.5">
              {group.label}
            </Eyebrow>
            {group.kind === "logos" && <LogosRow entries={group.entries} />}
            {group.kind === "names" && <NamesRow entries={group.entries} />}
            {group.kind === "press" && <PressList entries={group.entries} />}
          </Box>
        ))}
      </Box>
    </Box>
  ),
);
CreditLists.displayName = "CreditLists";

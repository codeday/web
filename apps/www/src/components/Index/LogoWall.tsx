import { Box, Grid, Image } from "@codeday/topo/Atom";
import { darkColors, legacyThemeData, useColorMode } from "@codeday/topo/Theme";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

import { graphql } from "@/gql";
import { FragmentType, useFragment } from "@/gql/fragment-masking";

const SWAP_INTERVAL_MS = 10_000;
const SWAP_JITTER_MS = 5_000;
const SLOT_COUNT = 12;
const FADE_MS = 400;

export const LogoWallFragment = graphql(`
  fragment IndexLogoWallComponent on Query {
    cms {
      logoWallEmployers: alumEmployers(
        where: { logo_exists: true, name_exists: true }
        order: [sort_ASC]
        limit: 100
      ) {
        items {
          sys {
            id
          }
          name
          legalName
          logo {
            url(transform: { height: 80, width: 160, resizeStrategy: PAD })
          }
          darkLogo {
            url(transform: { height: 80, width: 160, resizeStrategy: PAD })
          }
        }
      }
    }
  }
`);

interface LogoWallProps {
  data: FragmentType<typeof LogoWallFragment>;
  columns?: Record<string, string>;
}

interface EmployerLogo {
  id: string;
  name: string;
  light: string;
  dark: string | null;
}

function toLogo(item: any): EmployerLogo | null {
  if (!item?.logo?.url || !item?.name) return null;
  return {
    id: item.sys.id,
    name: item.name,
    light: item.logo.url,
    dark: item.darkLogo?.url || null,
  };
}

function deal<T>(pool: T[], slotCount: number): T[][] {
  const buckets: T[][] = Array.from({ length: slotCount }, (): T[] => []);
  pool.forEach((item, i) => buckets[i % slotCount].push(item));
  return buckets;
}

function LogoMark({ name, src, color }: { name: string; src: string; color: string }) {
  const [displayed, setDisplayed] = useState({ name, src });
  const [visible, setVisible] = useState(true);
  const pendingRef = useRef<{ name: string; src: string } | null>(null);

  useEffect(() => {
    if (src === displayed.src && name === displayed.name) return undefined;
    pendingRef.current = { name, src };
    setVisible(false);
    const timeout = setTimeout(() => {
      if (pendingRef.current) setDisplayed(pendingRef.current);
      setVisible(true);
    }, FADE_MS);
    return () => clearTimeout(timeout);
  }, [src, name, displayed]);

  return (
    <Box
      position="relative"
      display="inline-block"
      height="8"
      opacity={visible ? 1 : 0}
      transition={`opacity ${FADE_MS}ms ease-in-out`}
    >
      <Image src={displayed.src} alt={displayed.name} height="8" width="auto" opacity={0} />
      <Box
        aria-hidden="true"
        position="absolute"
        inset="0"
        backgroundColor={color}
        css={{
          maskImage: `url(${displayed.src})`,
          WebkitMaskImage: `url(${displayed.src})`,
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center",
          maskSize: "contain",
          WebkitMaskSize: "contain",
        }}
      />
    </Box>
  );
}

// Every logo renders as a single flat grayscale tone (Topo's `gray.700`)
// rather than in each employer's own brand colors — this is a credibility
// wall ("alumni work here"), not a sponsor showcase, so the marks read as one
// calm, consistent row instead of competing for attention. `gray.700` is
// mode-aware — a dark, legible ink (`#524440`) on the light page, a light,
// legible off-white (`#daccc8`) on the dark page — but it's resolved here to
// a literal hex via `legacyThemeData`/`darkColors` and picked with a plain
// `colorMode` branch, rather than passed through as the `"gray.700"` token
// string. A token/`useToken` reference both resolve to the same
// `var(--chakra-colors-gray-700)` — correct once read, but WebKit (including
// iOS Safari) has been observed to leave a `mask-image` layer's
// `background-color` painted in the *previous* mode's colour when only that
// CSS variable's value changes underneath it, with nothing short of an
// unrelated user-triggered repaint (e.g. toggling the mode by hand) fixing
// it. A literal hex value sidesteps the CSS variable — and that whole class
// of bug — entirely: a `colorMode` flip is then an ordinary inline
// `background-color` change, which repaints reliably everywhere. `gray.300`
// is the opposite role in dark mode (a wash tone tuned to sit near the dark
// background) — resolving *that* stop this way would make the logos nearly
// invisible instead of legible, so this only ever resolves `gray.700`.
export default function LogoWall({ data, columns, ...props }: LogoWallProps) {
  const { colorMode } = useColorMode();
  const { cms } = useFragment(LogoWallFragment, data);
  const color = colorMode === "dark" ? darkColors.gray[700] : legacyThemeData.colors.gray[700];

  const logos = useMemo(
    () =>
      (cms.logoWallEmployers?.items || []).map(toLogo).filter((l): l is EmployerLogo => l !== null),
    [cms.logoWallEmployers],
  );

  const slotLists = useMemo((): EmployerLogo[][] => {
    const slotCount = Math.min(SLOT_COUNT, logos.length);
    if (slotCount === 0) return [];
    const initial = logos.slice(0, slotCount);
    const rest = deal(logos.slice(slotCount), slotCount);
    return initial.map((first, i) => [first, ...rest[i]]);
  }, [logos]);

  const [slots, setSlots] = useState<EmployerLogo[]>(() => slotLists.map((list) => list[0]));

  const cursors = useRef<number[]>(slotLists.map(() => 0));

  const { ref: viewRef, inView } = useInView();

  useEffect(() => {
    if (!inView) return undefined;

    const timeoutIds: ReturnType<typeof setTimeout>[] = [];

    slotLists.forEach((list, index) => {
      if (list.length <= 1) return;
      const scheduleNext = () => {
        const delay = SWAP_INTERVAL_MS + (Math.random() * 2 - 1) * SWAP_JITTER_MS;
        timeoutIds[index] = setTimeout(() => {
          cursors.current[index] = (cursors.current[index] + 1) % list.length;
          const logo = list[cursors.current[index]];
          setSlots((prev) => prev.map((p, i) => (i === index ? logo : p)));
          scheduleNext();
        }, delay);
      };
      scheduleNext();
    });

    return () => timeoutIds.forEach((id) => clearTimeout(id));
  }, [slotLists, inView]);

  return (
    <Box ref={viewRef} {...props}>
      <Grid
        templateColumns={
          columns || { base: "repeat(2, 1fr)", md: "repeat(4, 1fr)", lg: "repeat(6, 1fr)" }
        }
        gap={6}
        alignItems="center"
        justifyItems="center"
      >
        {slots.map((logo, index) => (
          <LogoMark
            key={`slot-${index}`}
            name={logo.name}
            src={colorMode === "light" ? logo.light : logo.dark || logo.light}
            color={color}
          />
        ))}
      </Grid>
    </Box>
  );
}

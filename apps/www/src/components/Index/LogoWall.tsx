import { Box, Grid, Image } from "@codeday/topo/Atom";
import { useColorMode } from "@codeday/topo/Theme";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

import { graphql } from "@/gql";
import { FragmentType, useFragment } from "@/gql/fragment-masking";

// A slot swaps roughly every 10s; the jitter keeps slots from ever visibly
// ticking over in lockstep with each other.
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
  /** Overrides the logo grid's column count — narrower when the wall shares a row with another section instead of spanning full-width. */
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

// Deals `pool` out to `slotCount` buckets round-robin — every logo lands in
// at most one bucket, so slots never end up showing the same logo at once.
// `pool` arrives sorted ascending by `sort`, and dealing preserves that
// order within each bucket, so a lower-`sort` logo is always next in line
// to rotate in ahead of a higher-`sort` one.
function deal<T>(pool: T[], slotCount: number): T[][] {
  const buckets: T[][] = Array.from({ length: slotCount }, (): T[] => []);
  pool.forEach((item, i) => buckets[i % slotCount].push(item));
  return buckets;
}

// A consumer that swaps `src`/`name` over time (rotating through employers)
// gets a fade instead of a hard cut: this fades the mark out, swaps its
// content while invisible, then fades back in.
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

  // A single, real `<img>` per logo establishes the accessible name (a real
  // `alt`, the employer's `name`) and the mark's intrinsic aspect ratio. An
  // absolutely-positioned, `aria-hidden` flat-colour copy is layered on top,
  // masked by that same source image via `mask-image` — the only CSS-only way
  // to recolour arbitrary source art (raster or vector) to one exact target
  // colour, matching the technique `CreditLists`' `LogoMark` uses for the same
  // reason.
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

// Every logo renders as a single flat grayscale tone (`gray.700`) rather than
// in each employer's own brand colors — this is a credibility wall ("alumni
// work here"), not a sponsor showcase, so the marks read as one calm,
// consistent row instead of competing for attention. `gray.700` is one of
// Topo's two mode-aware palettes (see `Theme/vars/darkColors.ts`), so a
// single reference already resolves to the right tone in both modes: a dark,
// legible ink (`#524440`) on the light page, and a light, legible off-white
// (`#daccc8`) on the dark page (`#292929`) — no manual `colorMode` branch
// needed. `gray.300`'s dark-mode value is the opposite role (a wash tone
// tuned to sit near the dark background), so branching to it there made the
// logos nearly invisible instead of legible.
export default function LogoWall({ data, columns, ...props }: LogoWallProps) {
  const { colorMode } = useColorMode();
  const { cms } = useFragment(LogoWallFragment, data);
  const color = "gray.700";

  const logos = useMemo(
    () =>
      (cms.logoWallEmployers?.items || []).map(toLogo).filter((l): l is EmployerLogo => l !== null),
    [cms.logoWallEmployers],
  );

  // The lowest-`sort` logos fill the wall immediately. Anything past the
  // first 12 is dealt out into one disjoint rotation list per slot, so a
  // slot with more logos than fit on screen fades between them over time
  // instead of the wall ever needing more than 12 slots at once.
  const slotLists = useMemo((): EmployerLogo[][] => {
    const slotCount = Math.min(SLOT_COUNT, logos.length);
    if (slotCount === 0) return [];
    const initial = logos.slice(0, slotCount);
    const rest = deal(logos.slice(slotCount), slotCount);
    return initial.map((first, i) => [first, ...rest[i]]);
  }, [logos]);

  // Filled with each slot's lowest-`sort` logo — the ones past the first 12
  // only show up once their slot rotates to them.
  const [slots, setSlots] = useState<EmployerLogo[]>(() => slotLists.map((list) => list[0]));

  // Cursor into each slot's own dealt list — rotation only ever cycles
  // within that list, so it can't drift into another slot's logos.
  const cursors = useRef<number[]>(slotLists.map(() => 0));

  // Rotation is paused whenever the wall is scrolled out of view.
  const { ref: viewRef, inView } = useInView();

  useEffect(() => {
    if (!inView) return undefined;

    const timeoutIds: ReturnType<typeof setTimeout>[] = [];

    slotLists.forEach((list, index) => {
      // Nothing else to swap to.
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

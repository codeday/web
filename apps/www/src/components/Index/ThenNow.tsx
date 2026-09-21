import { PortraitWall, type PortraitWallPerson, type PortraitWallSlot } from "@codeday/topo/Organism";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { graphql } from "@/gql";
import { FragmentType, useFragment } from "@/gql/fragment-masking";

// A slot swaps every 10s. The four slots' swaps are evenly staggered across
// that interval (so they never tick over together) rather than jittered —
// which slot gets which point in the stagger is randomized instead, so the
// left-to-right swap order isn't identical on every page load.
const SWAP_INTERVAL_MS = 10_000;
const SLOT_COUNT = 4;
// Each slot's own dealt list caps out at three typical stories to one
// unusual one, so the wall reads as "mostly ordinary paths, occasionally a
// wild one" rather than a highlight reel. The initial paint (all `unusual`)
// doesn't count toward this ratio.
const TYPICAL_PER_SLOT = 3;
const UNUSUAL_PER_SLOT = 1;

export const ThenNowAlumFieldsFragment = graphql(`
  fragment IndexThenNowAlumFields on CmsAlum {
    sys {
      id
    }
    name
    journeyStartProgram {
      name
    }
    journeyStartYear
    journeyStartRegion {
      name
    }
    journeyNow
    photoCutout {
      url(transform: { width: 700, format: PNG })
    }
  }
`);

export const ThenNowFragment = graphql(`
  fragment IndexThenNowComponent on Query {
    cms {
      thenNowUnusual: alums(
        where: {
          unusual: true
          photoCutout_exists: true
          name_exists: true
          journeyNow_exists: true
          journeyStartProgram_exists: true
        }
        limit: 12
        order: [sys_firstPublishedAt_DESC]
      ) {
        items {
          ...IndexThenNowAlumFields
        }
      }
      thenNowTypical: alums(
        where: {
          unusual: false
          photoCutout_exists: true
          name_exists: true
          journeyNow_exists: true
          journeyStartProgram_exists: true
        }
        limit: 24
        order: [sys_firstPublishedAt_DESC]
      ) {
        items {
          ...IndexThenNowAlumFields
        }
      }
    }
  }
`);

interface AlumCard {
  id: string;
  name: string;
  then: string;
  now: string;
  photo: string;
}

function toCard(item: any): AlumCard | null {
  if (!item?.photoCutout?.url || !item?.name || !item?.journeyNow) return null;
  const thenLabel = item.journeyStartYear ? String(item.journeyStartYear) : "Then";
  const thenDetail = item.journeyStartRegion?.name
    ? `${item.journeyStartProgram?.name} in ${item.journeyStartRegion.name}`
    : item.journeyStartProgram?.name;
  return {
    id: item.sys.id,
    name: item.name,
    // oxlint-disable-next-line unicorn/no-thenable -- `then` is AlumCard's field name, not a real thenable
    then: `${thenLabel}: ${thenDetail}`,
    now: `Now: ${item.journeyNow}`,
    photo: item.photoCutout.url,
  };
}

function shuffled<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Deals `pool` out to `slotCount` buckets round-robin, capped at
// `capPerSlot` each — every card lands in at most one bucket, so slots
// never end up showing the same photo. When the pool runs short, later
// buckets simply come up empty or short by one rather than reusing a card
// another slot already has.
//
// Deliberately unshuffled (`pool` is dealt in its incoming order): this
// feeds the slots' initial paint, which is computed during render and so
// has to come out identical on the server and on the client — a
// `Math.random()` call here would make the two disagree and produce a
// hydration mismatch. Rotation order gets its randomness later, from inside
// an effect, where that's safe.
function deal<T>(pool: T[], slotCount: number, capPerSlot: number): T[][] {
  const buckets: T[][] = Array.from({ length: slotCount }, (): T[] => []);
  let i = 0;
  for (let round = 0; round < capPerSlot && i < pool.length; round += 1) {
    for (let slot = 0; slot < slotCount && i < pool.length; slot += 1) {
      buckets[slot].push(pool[i]);
      i += 1;
    }
  }
  return buckets;
}

interface ThenNowProps {
  data: FragmentType<typeof ThenNowFragment>;
}

export default function ThenNow({ data }: ThenNowProps) {
  const { cms } = useFragment(ThenNowFragment, data);

  const unusualCards = useMemo(
    () => (cms.thenNowUnusual?.items || []).map(toCard).filter((c): c is AlumCard => c !== null),
    [cms.thenNowUnusual],
  );
  const typicalCards = useMemo(
    () => (cms.thenNowTypical?.items || []).map(toCard).filter((c): c is AlumCard => c !== null),
    [cms.thenNowTypical],
  );

  // Each slot gets its own dealt-out list — up to one unusual example and
  // up to three typical ones, with no card dealt to more than one slot — so
  // the same photo can never show up in two slots. Dealt once per page
  // load; with today's small alum pool, some slots come up a card or two
  // short rather than reusing a photo another slot already has.
  const slotLists = useMemo((): AlumCard[][] => {
    const targetSlotCount = Math.min(SLOT_COUNT, unusualCards.length + typicalCards.length);
    if (targetSlotCount === 0) return [];
    const unusualDeal = deal(unusualCards, targetSlotCount, UNUSUAL_PER_SLOT);
    const typicalDeal = deal(typicalCards, targetSlotCount, TYPICAL_PER_SLOT);
    return (
      unusualDeal
        // The unusual card leads its slot's list, so the initial paint favors it.
        .map((unusual, i) => [...unusual, ...typicalDeal[i]])
        .filter((list) => list.length > 0)
    );
  }, [unusualCards, typicalCards]);

  // Every card a slot may ever show, converted once to the shape
  // `PortraitWall` renders — it mounts one permanent element per person and
  // only ever toggles which is displayed, so this list has to be stable
  // (not rebuilt with new object identities) across the rotation below.
  const portraitPeopleBySlot = useMemo(
    (): PortraitWallPerson[][] =>
      slotLists.map((list) =>
        list.map(
          (card): PortraitWallPerson => ({
            id: card.id,
            name: card.name,
            // oxlint-disable-next-line unicorn/no-thenable -- `then` is PortraitWallPerson's spec-mandated prop name, not a real thenable
            then: card.then,
            now: card.now,
            photo: card.photo,
            alt: `${card.name} today`,
          }),
        ),
      ),
    [slotLists],
  );

  // Which card id is currently shown per slot — filled with each slot's
  // `unusual` example first, falling back to a typical one only if that
  // slot wasn't dealt an unusual example.
  const [activeIds, setActiveIds] = useState<string[]>(() => slotLists.map((list) => list[0]?.id));

  // Cursor into each slot's own dealt list — rotation only ever cycles
  // within that list, so it can't drift into another slot's cards.
  const cursors = useRef<number[]>(slotLists.map(() => 0));

  useEffect(() => {
    const timeoutIds: ReturnType<typeof setTimeout>[] = [];

    // Evenly spaced points across one interval (0, 1/n, 2/n, ... of the
    // way through), handed out to slots in a shuffled order — every slot
    // still swaps exactly every `SWAP_INTERVAL_MS`, just starting from a
    // different, randomly-assigned point in that cycle, client-side, after
    // the deterministic (SSR-safe) first paint.
    const staggerOffsetsMs = shuffled(
      slotLists.map((_, i) => (i * SWAP_INTERVAL_MS) / slotLists.length),
    );

    slotLists.forEach((list, index) => {
      // Nothing else to swap to.
      if (list.length <= 1) return;
      // The order a slot cycles through its own dealt list is randomized
      // too, independently of the swap-timing stagger above — so different
      // page loads don't all advance through the same sequence.
      const order = [list[0], ...shuffled(list.slice(1))];
      const advance = () => {
        cursors.current[index] = (cursors.current[index] + 1) % order.length;
        const card = order[cursors.current[index]];
        setActiveIds((prev) => prev.map((id, i) => (i === index ? card.id : id)));
        timeoutIds[index] = setTimeout(advance, SWAP_INTERVAL_MS);
      };
      timeoutIds[index] = setTimeout(advance, staggerOffsetsMs[index]);
    });

    return () => timeoutIds.forEach((id) => clearTimeout(id));
  }, [slotLists]);

  if (activeIds.length === 0) return null;

  return (
    <PortraitWall
      maxWidth="container.lg"
      marginX="auto"
      slots={portraitPeopleBySlot.map(
        (people, index): PortraitWallSlot => ({
          id: `slot-${index}`,
          people,
          activeId: activeIds[index],
        }),
      )}
    />
  );
}

import {
  PortraitWall,
  type PortraitWallPerson,
  type PortraitWallSlot,
} from "@codeday/topo/Organism";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

import { graphql } from "@/gql";
import { FragmentType, useFragment } from "@/gql/fragment-masking";

const SWAP_INTERVAL_MS = 10_000;
const SLOT_COUNT = 4;
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

  const slotLists = useMemo((): AlumCard[][] => {
    const targetSlotCount = Math.min(SLOT_COUNT, unusualCards.length + typicalCards.length);
    if (targetSlotCount === 0) return [];
    const unusualDeal = deal(unusualCards, targetSlotCount, UNUSUAL_PER_SLOT);
    const typicalDeal = deal(typicalCards, targetSlotCount, TYPICAL_PER_SLOT);
    return unusualDeal
      .map((unusual, i) => [...unusual, ...typicalDeal[i]])
      .filter((list) => list.length > 0);
  }, [unusualCards, typicalCards]);

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

  const [activeIds, setActiveIds] = useState<string[]>(() => slotLists.map((list) => list[0]?.id));

  const cursors = useRef<number[]>(slotLists.map(() => 0));

  const plan = useRef<{ order: AlumCard[]; remainingMs: number }[]>([]);

  useEffect(() => {
    const staggerOffsetsMs = shuffled(
      slotLists.map((_, i) => (i * SWAP_INTERVAL_MS) / slotLists.length),
    );
    cursors.current = slotLists.map(() => 0);
    plan.current = slotLists.map((list, index) => ({
      order: [list[0], ...shuffled(list.slice(1))],
      remainingMs: staggerOffsetsMs[index],
    }));
  }, [slotLists]);

  const { ref: viewRef, inView } = useInView();
  const [hovered, setHovered] = useState(false);
  const paused = !inView || hovered;

  useEffect(() => {
    if (paused) return undefined;

    const timeoutIds: ReturnType<typeof setTimeout>[] = [];
    const deadlines: number[] = [];

    plan.current.forEach((slot, index) => {
      if (slot.order.length <= 1) return;
      const schedule = (delayMs: number) => {
        deadlines[index] = Date.now() + delayMs;
        timeoutIds[index] = setTimeout(() => {
          cursors.current[index] = (cursors.current[index] + 1) % slot.order.length;
          const card = slot.order[cursors.current[index]];
          setActiveIds((prev) => prev.map((id, i) => (i === index ? card.id : id)));
          schedule(SWAP_INTERVAL_MS);
        }, delayMs);
      };
      schedule(slot.remainingMs);
    });

    return () => {
      timeoutIds.forEach((id) => clearTimeout(id));
      const now = Date.now();
      plan.current.forEach((slot, index) => {
        if (deadlines[index] !== undefined) {
          slot.remainingMs = Math.max(0, deadlines[index] - now);
        }
      });
    };
  }, [slotLists, paused]);

  if (activeIds.length === 0) return null;

  return (
    <PortraitWall
      ref={viewRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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

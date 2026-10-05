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
const MAX_TYPICAL_RUN = 2;

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
        limit: 24
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

// Deals `pool` out to `slotCount` buckets round-robin — every card lands in
// exactly one bucket, so slots never end up showing the same photo.
//
// Deliberately unshuffled (`pool` is dealt in its incoming order): this
// feeds the slots' initial paint, which is computed during render and so
// has to come out identical on the server and on the client — a
// `Math.random()` call here would make the two disagree and produce a
// hydration mismatch. Rotation order gets its randomness later, from inside
// an effect, where that's safe.
function deal<T>(pool: T[], slotCount: number): T[][] {
  const buckets: T[][] = Array.from({ length: slotCount }, (): T[] => []);
  pool.forEach((item, i) => buckets[i % slotCount].push(item));
  return buckets;
}

// Spreads `typical` evenly into the gaps after each `unusual` card. Callers
// cap `typical` at `MAX_TYPICAL_RUN` per unusual card, so the rotation (which
// wraps around) never shows more than that many typical cards in a row.
function interleave(unusual: AlumCard[], typical: AlumCard[]): AlumCard[] {
  return unusual.flatMap((card, i) => [
    card,
    ...typical.slice(
      Math.floor((i * typical.length) / unusual.length),
      Math.floor(((i + 1) * typical.length) / unusual.length),
    ),
  ]);
}

interface Slot {
  unusual: AlumCard[];
  typical: AlumCard[];
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

  const slots = useMemo((): Slot[] => {
    const slotCount = Math.min(SLOT_COUNT, unusualCards.length || typicalCards.length);
    if (slotCount === 0) return [];
    const unusualDeal = deal(unusualCards, slotCount);
    const typicalDeal = deal(typicalCards, slotCount);
    return unusualDeal.map((unusual, i) => ({
      unusual,
      typical:
        unusual.length > 0
          ? typicalDeal[i].slice(0, unusual.length * MAX_TYPICAL_RUN)
          : typicalDeal[i],
    }));
  }, [unusualCards, typicalCards]);

  const slotLists = useMemo(
    (): AlumCard[][] => slots.map((slot) => [...slot.unusual, ...slot.typical]),
    [slots],
  );

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
    plan.current = slots.map(({ unusual, typical }, index) => ({
      order:
        unusual.length > 0
          ? interleave([unusual[0], ...shuffled(unusual.slice(1))], shuffled(typical))
          : [typical[0], ...shuffled(typical.slice(1))],
      remainingMs: staggerOffsetsMs[index],
    }));
  }, [slots, slotLists]);

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

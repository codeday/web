import { DateTime } from "luxon";

export interface AnnouncementCandidate {
  text?: string | null;
  href?: string | null;
  chip?: string | null;
  startsAt?: string | null;
  endsAt?: string | null;
}

export interface DeadlineCandidate {
  deadline?: string | null;
}

export type HomepageAnnouncement =
  | { kind: "announcement"; text: string; href: string; chip: string | null }
  | { kind: "deadline" };

const DEADLINE_WINDOW_DAYS = 30;

function parse(value: string | null | undefined): DateTime | null | undefined {
  if (!value) return undefined;
  const parsed = DateTime.fromISO(value, { zone: "utc" });
  return parsed.isValid ? parsed : null;
}

export function selectHomepageAnnouncement(
  announcements: AnnouncementCandidate[],
  deadlines: DeadlineCandidate[],
  now: DateTime,
): HomepageAnnouncement | null {
  const active = announcements
    .flatMap((a) => {
      const startsAt = parse(a.startsAt);
      const endsAt = parse(a.endsAt);
      if (!a.text || !a.href || startsAt === null || endsAt === null) return [];
      if (startsAt && startsAt > now) return [];
      if (endsAt && endsAt <= now) return [];
      return [{ ...a, text: a.text, href: a.href, startsAt }];
    })
    .sort((a, b) => (b.startsAt?.toMillis() ?? -Infinity) - (a.startsAt?.toMillis() ?? -Infinity));

  if (active.length > 0) {
    const { text, href, chip } = active[0];
    return { kind: "announcement", text, href, chip: chip || null };
  }

  const windowEnd = now.plus({ days: DEADLINE_WINDOW_DAYS });
  const hasDeadline = deadlines.some((d) => {
    const deadline = parse(d.deadline);
    return !!deadline && deadline > now && deadline <= windowEnd;
  });
  return hasDeadline ? { kind: "deadline" } : null;
}

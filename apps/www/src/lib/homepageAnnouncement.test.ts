import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";

import { type AnnouncementCandidate, selectHomepageAnnouncement } from "./homepageAnnouncement";

const NOW = DateTime.fromISO("2026-09-24T12:00:00Z", { zone: "utc" });
const iso = (d: DateTime) => d.toISO()!;

function announcement(overrides: Partial<AnnouncementCandidate> = {}): AnnouncementCandidate {
  return {
    text: "Something new",
    href: "https://example.org/",
    chip: "New",
    startsAt: iso(NOW.minus({ days: 1 })),
    endsAt: iso(NOW.plus({ days: 1 })),
    ...overrides,
  };
}

describe("selectHomepageAnnouncement", () => {
  it("shows an active announcement", () => {
    expect(selectHomepageAnnouncement([announcement()], [], NOW)).toEqual({
      kind: "announcement",
      text: "Something new",
      href: "https://example.org/",
      chip: "New",
    });
  });

  it("falls back to a direct deadline 10 days out", () => {
    const deadlines = [{ deadline: iso(NOW.plus({ days: 10 })) }];
    expect(selectHomepageAnnouncement([], deadlines, NOW)).toEqual({ kind: "deadline" });
  });

  it("ignores a deadline 31 days out", () => {
    const deadlines = [{ deadline: iso(NOW.plus({ days: 31 })) }];
    expect(selectHomepageAnnouncement([], deadlines, NOW)).toBeNull();
  });

  it("ignores a deadline that passed yesterday", () => {
    const deadlines = [{ deadline: iso(NOW.minus({ days: 1 })) }];
    expect(selectHomepageAnnouncement([], deadlines, NOW)).toBeNull();
  });

  it("shows nothing when neither is present", () => {
    expect(selectHomepageAnnouncement([], [], NOW)).toBeNull();
  });

  it("prefers an active announcement over a qualifying deadline", () => {
    const deadlines = [{ deadline: iso(NOW.plus({ days: 3 })) }];
    expect(selectHomepageAnnouncement([announcement()], deadlines, NOW)?.kind).toBe("announcement");
  });

  it("qualifies when any one of several deadlines is in the window", () => {
    const deadlines = [
      { deadline: iso(NOW.minus({ days: 40 })) },
      { deadline: iso(NOW.plus({ days: 20 })) },
      { deadline: iso(NOW.plus({ days: 120 })) },
    ];
    expect(selectHomepageAnnouncement([], deadlines, NOW)).toEqual({ kind: "deadline" });
  });

  it("compares instants across stored offsets", () => {
    // 2026-10-24T07:00-04:00 is 11:00Z — just inside 30 days of NOW (12:00Z + 30d = 10-24T12:00Z).
    const inside = [{ deadline: "2026-10-24T07:00:00.000-04:00" }];
    // 09:00-04:00 is 13:00Z — an hour past the window.
    const outside = [{ deadline: "2026-10-24T09:00:00.000-04:00" }];
    expect(selectHomepageAnnouncement([], inside, NOW)).toEqual({ kind: "deadline" });
    expect(selectHomepageAnnouncement([], outside, NOW)).toBeNull();
  });

  it("picks the most recently started of several active announcements", () => {
    const older = announcement({ text: "older", startsAt: iso(NOW.minus({ days: 5 })) });
    const newer = announcement({ text: "newer", startsAt: iso(NOW.minus({ hours: 1 })) });
    const result = selectHomepageAnnouncement([older, newer], [], NOW);
    expect(result).toMatchObject({ text: "newer" });
  });

  it("treats both date bounds as optional", () => {
    const open = announcement({ startsAt: null, endsAt: null });
    expect(selectHomepageAnnouncement([open], [], NOW)?.kind).toBe("announcement");
  });

  it("skips announcements outside their window or missing text/link", () => {
    const candidates = [
      announcement({ startsAt: iso(NOW.plus({ hours: 1 })) }),
      announcement({ endsAt: iso(NOW) }),
      announcement({ text: "" }),
      announcement({ href: null }),
      announcement({ startsAt: "not a date" }),
    ];
    expect(selectHomepageAnnouncement(candidates, [], NOW)).toBeNull();
  });

  it("leaves the chip unset when the entry has none", () => {
    expect(selectHomepageAnnouncement([announcement({ chip: null })], [], NOW)).toMatchObject({
      chip: null,
    });
  });
});

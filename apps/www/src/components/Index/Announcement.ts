import * as m from "@codeday/i18n/messages";
import { DateTime } from "luxon";

import { graphql } from "@/gql";
import { FragmentType, useFragment } from "@/gql/fragment-masking";

import { selectHomepageAnnouncement } from "../../lib/homepageAnnouncement";

// Aliased because other fragments on this page's query may select
// `cms.announcements`/`cms.events` with different arguments, which GraphQL
// won't merge under one response key.
//
// Date windows are evaluated in `selectHomepageAnnouncement` with luxon, not
// here as `where` filters, so these just bound the candidate set: the 20
// latest-starting public announcements, and the 10 latest `direct`
// deadlines (any upcoming deadline is necessarily among the latest).
export const AnnouncementFragment = graphql(`
  fragment IndexAnnouncementComponent on Query {
    cms {
      homepageAnnouncements: announcements(
        where: { visibility: "Public" }
        order: displayAt_DESC
        limit: 20
      ) {
        items {
          oneline
          link
          type
          displayAt
          endAt
        }
      }
      homepageDeadlineEvents: events(
        where: { program: { webname: "direct" } }
        order: registrationsCloseAt_DESC
        limit: 10
      ) {
        items {
          registrationsCloseAt
        }
      }
    }
  }
`);

export interface HomepageAnnouncementContent {
  text: string;
  href: string;
  chip?: string;
}

/**
 * `now` is the ISO timestamp captured in getStaticProps, not the visitor's
 * clock, so the server render and hydration always agree (no layout shift
 * from a pill that appears or vanishes on mount).
 */
export function useHomepageAnnouncement(
  data: FragmentType<typeof AnnouncementFragment>,
  now: string,
): HomepageAnnouncementContent | null {
  const { cms } = useFragment(AnnouncementFragment, data);
  const selected = selectHomepageAnnouncement(
    (cms.homepageAnnouncements?.items ?? []).flatMap((item) =>
      item
        ? [
            {
              text: item.oneline,
              href: item.link,
              chip: item.type,
              startsAt: item.displayAt,
              endsAt: item.endAt,
            },
          ]
        : [],
    ),
    (cms.homepageDeadlineEvents?.items ?? []).map((event) => ({
      deadline: event?.registrationsCloseAt,
    })),
    DateTime.fromISO(now, { zone: "utc" }),
  );

  if (!selected) return null;
  if (selected.kind === "deadline") {
    return {
      chip: m.www_home_announcement_deadline_chip(),
      text: m.www_home_announcement_deadline_text(),
      href: "/direct",
    };
  }
  return { text: selected.text, href: selected.href, chip: selected.chip ?? undefined };
}

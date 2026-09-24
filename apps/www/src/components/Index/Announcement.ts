import * as m from "@codeday/i18n/messages";
import { DateTime } from "luxon";

import { graphql } from "@/gql";
import { FragmentType, useFragment } from "@/gql/fragment-masking";

import { selectHomepageAnnouncement } from "../../lib/homepageAnnouncement";

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

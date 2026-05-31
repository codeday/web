import { Box, Text, Button, Grid } from "@codeday/topo/Atom";
import { Content } from "@codeday/topo/Molecule";
import { useColorMode, usePageData } from "@codeday/topo/Theme";
import { DateTime } from "luxon";
import React from "react";



const fromIso = (s: string) => {
  var b = s.split(/\D+/).map(Number);
  return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
};

export default function Announcement(props: any) {
  const { colorMode } = useColorMode();
  const {
    cms: { announcements },
    announcementWebinar: { events },
  } = usePageData();

  const now = new Date();
  const webinarAnnouncementEndDate = new Date().setDate(now.getDate() + 2);

  const sortedAnnouncements =
    !announcements?.items || announcements.items.length === 0
      ? []
      : announcements.items.sort((a: any, b: any) =>
          fromIso(a.displayAt) > fromIso(b.displayAt) ? -1 : 1,
        );

  const sortedEvents =
    !events || events.length === 0
      ? []
      : events
          .filter(
            (e: any) =>
              fromIso(e.start).getTime() < webinarAnnouncementEndDate && fromIso(e.end) >= now,
          )
          .sort((a: any, b: any) => fromIso(a.start) > fromIso(b.start));

  let announcement: any;
  if (sortedEvents.length > 0) {
    const event = sortedEvents[0];
    const start = DateTime.fromISO(event.start).toLocaleString({
      day: "numeric",
      month: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
    announcement = {
      link: event.metadata?.preregister ? event.location : `/e/${event.calendarId}/${event.id}`,
      type: "Upcoming Webinar",
      oneline: `${event.title} (${start})`,
      cta: "Register",
    };
  } else if (sortedAnnouncements.length > 0) announcement = sortedAnnouncements[0];
  else return <></>;

  const baseColor: string =
    {
      New: "blue",
      Improved: "yellow",
      Alert: "red",
      "Upcoming Webinar": "indigo",
    }[announcement.type as string] || "blue";

  return (
    <Content {...(props || {})}>
      <Box
        borderWidth={1}
        borderColor={`${baseColor}.500`}
        color={colorMode === "dark" ? `${baseColor}.100` : `${baseColor}.900`}
        bgColor={colorMode === "dark" ? `${baseColor}.900` : `${baseColor}.50`}
        borderRadius={4}
        p={4}
        m={0}
        display="block"
        as={announcement.link ? "a" : "div"}
        {...((announcement.link ? { href: announcement.link, target: "_blank" } : {}) as any)}
      >
        <Grid
          templateColumns={{ base: "1fr", md: "4fr 1fr" }}
          alignItems="center"
          textAlign={{ base: "center", md: "left" }}
        >
          <Box>
            <Text mb={0} display="inline">
              <Text as="span" fontWeight="bold" display={{ base: "none", md: "inline" }}>
                {announcement.type}:{" "}
              </Text>
              {announcement.oneline}
            </Text>
          </Box>
          <Box textAlign="right" display={{ base: "none", md: "block" }}>
            <Button size="sm" colorPalette={baseColor} mb={0}>
              {announcement.cta || "Learn More"}
            </Button>
          </Box>
        </Grid>
      </Box>
    </Content>
  );
}

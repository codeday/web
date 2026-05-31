import { Box, Grid, Text, Heading, Link, Button } from "@codeday/topo/Atom";
import { Html } from "@codeday/topo/Molecule";
import * as m from "@codeday/i18n/messages";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { DateTime } from "luxon";
import React, { useState, useEffect } from "react";

import SubscribeBox from "./SubscribeBox";

const SERVER_TIMEZONE = "America/Los_Angeles";

export default function Event({ event, ...rest }: { event: any; [key: string]: any }) {
  const [timezone, setTimezone] = useState(SERVER_TIMEZONE);
  const [twasStart, setTwasStart] = useState<string | undefined>();
  const [twasEnd, setTwasEnd] = useState<string | undefined>();
  useEffect(() => {
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, [typeof window, Intl.DateTimeFormat().resolvedOptions().timeZone]);

  useEffect(() => {
    try {
      TimeAgo.addDefaultLocale(en);
    } catch {}
  }, [typeof window]);

  const start = DateTime.fromISO(event.start);
  const end = DateTime.fromISO(event.end);
  const now = DateTime.local();
  const startLocal = start.setZone(timezone);
  const endLocal = end.setZone(timezone);
  const almostHasStarted = now > startLocal.minus({ minutes: 45 });
  const hasStarted = now > startLocal;
  const hasEnded = now > endLocal;

  const [, , type, , title] = event.title.match(/^(((\w+ ?){0,3}): )?(.*)$/);

  let relative = m.www_event_starts({ time: twasStart || "" });
  if (hasEnded) relative = m.www_event_ended({ time: twasEnd || "" });
  else if (hasStarted) relative = m.www_event_ends({ time: twasEnd || "" });

  useEffect(() => {
    if (typeof window === "undefined") return () => {};
    const interval = setInterval(() => {
      const timeAgo = new TimeAgo("en-US");
      setTwasStart(timeAgo.format(start.toJSDate()));
      setTwasEnd(timeAgo.format(end.toJSDate()));
    }, 1000);
    return () => clearInterval(interval);
  }, [typeof window]);

  return (
    <Box {...rest}>
      <Grid templateColumns="3fr 2fr" mb={4}>
        <Box>
          <Text mb={0} fontWeight="bold">
            {startLocal.toLocaleString(DateTime.DATETIME_MED)} &mdash;{" "}
            {endLocal.toLocaleString(
              startLocal.startOf("day").toMillis() !== endLocal.startOf("day").toMillis()
                ? DateTime.DATETIME_FULL
                : { hour: "numeric", minute: "2-digit", timeZoneName: "short" },
            )}{" "}
          </Text>
          <Text mb={0}>{relative}</Text>
          {event.metadata?.preregister ? (
            <Text>Requires registration</Text>
          ) : (
            <Text>{event.subscriberCount} subscribed</Text>
          )}
        </Box>
        <Box textAlign="right">
          {type && (
            <Text display="inline-block" p={2} bg="current.border" rounded="sm">
              {type}
            </Text>
          )}
        </Box>
      </Grid>
      <Heading as="h2" fontSize="5xl">
        {title || m.www_event_tba()}
      </Heading>
      {event.metadata?.presenter && (
        <Text fontSize="xl" mt={2}>
          {m.www_event_presented_by({ presenter: event.metadata.presenter })}
        </Text>
      )}
      <Box mt={8}>
        {!hasEnded ? (
          almostHasStarted || event.metadata?.preregister ? (
            <>
              {event.location && (
                <>
                  <Link fontSize="lg" href={event.location} target="_blank" mr={4}>
                    {event.location}
                  </Link>
                  <Button
                    as="a"
                    {...({ href: event.location, target: "_blank" } as any)}
                    colorPalette="blue"
                  >
                    {almostHasStarted ? m.www_event_join() : m.www_event_pre_register()}
                  </Button>
                </>
              )}
            </>
          ) : (
            <SubscribeBox event={event} mt={4} />
          )
        ) : (
          <>
            <Button
              colorPalette="blue"
              as="a"
              {...({ href: "https://www.youtube.com/c/codeday", target: "_blank" } as any)}
            >
              {m.www_event_workshop_recordings()}
            </Button>
            <Text display="inline-block" ml={4} fontStyle="italic">
              {m.www_event_workshop_ended()}
            </Text>
          </>
        )}
      </Box>
      <Html mt={8}>{event.description}</Html>
    </Box>
  );
}

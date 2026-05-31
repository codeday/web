import { Box, Button, TextInput as Input } from "@codeday/topo/Atom";
import * as m from "@codeday/i18n/messages";
import { useToasts, apiFetch } from "@codeday/topo/utils";
import React, { useState } from "react";
import { stringify as urlencode } from "urlencode";
import { DateTime } from "luxon";

import { SubscribeToEvent } from "./EventInfo.gql";

export default function SubscribeBox({ event, ...rest }: { event: any; [key: string]: any }) {
  const { success, error } = useToasts();
  const [destination, setDestination] = useState("");
  const dtFormat = `yyyyLLdd'T'HHmmss`;
  const start = DateTime.fromISO(event.start).toUTC().toFormat(dtFormat);
  const end = DateTime.fromISO(event.end).toUTC().toFormat(dtFormat);
  const addLinkGoogleParams = urlencode({
    action: "TEMPLATE",
    text: event.title,
    dates: `${start}Z/${end}Z`,
    location: event.location,
    sf: "true",
    output: "xml",
  });
  const addLinkGoogle = `https://www.google.com/calendar/render?${addLinkGoogleParams}`;
  return (
    <Box {...rest}>
      <Input
        value={destination}
        onChange={(e: any) => setDestination(e.target.value)}
        placeholder={m.www_subscribe_phone_placeholder()}
        display="inline-block"
        w="sm"
        borderTopRightRadius={0}
        borderBottomRightRadius={0}
      />
      <Button
        borderTopLeftRadius={0}
        borderBottomLeftRadius={0}
        position="relative"
        colorPalette="blue"
        onClick={async () => {
          try {
            await apiFetch(
              SubscribeToEvent,
              { id: event.id, calendarId: event.calendarId, destination },
              {},
            );
            success(m.www_subscribe_success());
          } catch (ex: any) {
            error(ex.toString());
          }
        }}
      >
        {m.www_subscribe_remind_me()}
      </Button>
      <Button as="a" {...({ href: addLinkGoogle, target: "_blank" } as any)} ml={2}>
        {m.www_subscribe_add_to_calendar()}
      </Button>
    </Box>
  );
}

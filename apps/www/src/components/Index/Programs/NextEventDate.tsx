import { Text } from "@codeday/topo/Atom";
import React from "react";

import { nextUpcomingEvent, upcomingEvents, formatInterval } from "../../../utils/time";

export default function NextEventDate({ upcoming }: { upcoming: any[] }) {
  const next = nextUpcomingEvent(upcoming);
  return next ? (
    <Text color="current.textLight" mb={0} fontWeight="bold">
      {upcomingEvents(upcoming)
        .map((e) => formatInterval(e.startsAt, e.endsAt))
        .join("; ")}
    </Text>
  ) : (
    <></>
  );
}

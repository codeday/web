import { Box, type BoxProps, Button, Grid, Text } from "@codeday/topo/Atom";
import { Content } from "@codeday/topo/Molecule";
import { useColorMode } from "@codeday/topo/Theme";
import { useTheme, apiFetch, useLocalStorage } from "@codeday/topo/utils";
import * as m from "@codeday/i18n/messages";
import { UiX as X } from "@codeday/topocons";
import React, { useEffect, useReducer } from "react";
import useSwr from "swr";

const query = (date: string, visibility: any) => `{
  cms {
    announcements(
      where: {
        visibility: "${visibility}",
        displayAt_lte: "${date}",
        endAt_gte: "${date}"
      }
    ) {
      items {
        sys { id }
        title
        oneline
        displayAt
        type
        link
        displayAt
        programs { items { webname } }
      }
    }
  }
}`;

function roundTimeQuarterHour(time: Date) {
  var timeToReturn = new Date(time);
  timeToReturn.setMilliseconds(Math.round(timeToReturn.getMilliseconds() / 1000) * 1000);
  timeToReturn.setSeconds(Math.round(timeToReturn.getSeconds() / 60) * 60);
  timeToReturn.setMinutes(Math.round(timeToReturn.getMinutes() / 15) * 15);
  return timeToReturn;
}

const getDate = () => {
  const d = roundTimeQuarterHour(new Date());
  d.setUTCHours(d.getUTCHours() - 7);
  return d.toISOString();
};

const fromIso = (s: string) => {
  const b = s.split(/\D+/).map((obj) => Number(obj));
  return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
};

interface AnnouncementProps extends BoxProps {
  box?: boolean;
}

function Announcement({ box, ...props }: AnnouncementProps) {
  const { colorMode } = useColorMode();
  const { visibility, programWebname } = useTheme();
  const [date, updateDate] = useReducer(getDate, getDate());
  const { data } = useSwr(query(date, visibility), apiFetch, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    revalidateOnReconnect: false,
  });
  const [dismissedMessages, setDismissedMessages] = useLocalStorage(
    "topoDismissedAnnouncements",
    [],
  );

  const dark = colorMode === "dark";

  const items = data?.cms?.announcements?.items;
  const sortedItems =
    !items || items.length === 0
      ? null
      : items
          .filter(
            (i: { programs: { items: any[] } }) =>
              i.programs.items.length === 0 ||
              i.programs.items.map((p: { webname: any }) => p.webname).includes(programWebname),
          )
          .sort(
            (
              a: { programs: { items: string | any[] }; displayAt: any },
              b: { programs: { items: string | any[] }; displayAt: any },
            ) => {
              if (a.programs.items.length > 0 && b.programs.items.length === 0) return -1;
              return fromIso(a.displayAt) > fromIso(b.displayAt) ? -1 : 1;
            },
          );

  const item = sortedItems ? sortedItems[0] : null;

  useEffect(() => {
    const interval = setInterval(() => updateDate(), 15 * 60 * 1000);
    return () => clearInterval(interval);
  });

  if (!item) return <></>;

  const baseColor = (
    {
      New: "blue",
      Improved: "indigo",
      Alert: "red",
    } as Record<string, string>
  )[item.type];

  if (box) {
    return (
      <Box
        bg={`${baseColor}.${dark ? 900 : 50}`}
        color={`${baseColor}.${dark ? 600 : 800}`}
        borderRadius={4}
        p={4}
        m={0}
        display="block"
        as={item.link ? "a" : "div"}
        href={item.link}
        target={item.link ? "_blank" : null}
        {...(props as any)}
      >
        <Text fontFamily="accent" fontSize="4xl" lineHeight={1.2}>
          {item.title}
        </Text>
        <Text>{item.oneline}</Text>
        <Button size="sm" colorPalette={baseColor} mb={0}>
          {m.topo_announcement_learn_more()}
        </Button>
      </Box>
    );
  }

  if ((dismissedMessages || []).includes(item.sys.id)) return <></>;

  const Close = (
    <Box
      display="inline"
      position="relative"
      top="-2px"
      paddingRight={2}
      onClick={(e: any) => {
        setDismissedMessages([...dismissedMessages, item.sys.id]);
        e.preventDefault();
        e.stopPropagation();
        return false;
      }}
    >
      <X aria-label="Close" />
    </Box>
  );

  return (
    <Box
      bg={`${baseColor}.${dark ? 900 : 50}`}
      color={`${baseColor}.${dark ? 600 : 800}`}
      p={2}
      m={0}
      display="block"
      as={item.link ? "a" : "div"}
      href={item.link}
      target={item.link ? "_blank" : null}
      aria-label="Announcement"
      {...(props as any)}
    >
      <Content wide mb={0}>
        <Box display={{ base: "none", lg: "block" }} mb={0}>
          <Grid templateColumns="4fr 1fr" alignItems="center">
            <Box>
              {Close}
              <Text mb={0} display="inline">
                {item.oneline}
              </Text>
            </Box>
            <Box textAlign="right">
              <Button size="sm" colorPalette={baseColor} mb={0}>
                {m.topo_announcement_learn_more()}
              </Button>
            </Box>
          </Grid>
        </Box>
        <Box display={{ base: "none", md: "block", lg: "none" }} mb={0} textAlign="center">
          {Close}
          {item.oneline}
        </Box>
        <Box display={{ base: "block", md: "none" }} mb={0}>
          <Grid templateColumns="1fr 5fr" alignItems="center">
            <Box>{Close} </Box>
            <Box textAlign="center">{item.title}</Box>
          </Grid>
        </Box>
      </Content>
    </Box>
  );
}

export { Announcement, type AnnouncementProps };

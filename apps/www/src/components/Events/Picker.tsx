import * as m from "@codeday/i18n/messages";
import {
  Badge,
  Box,
  Button,
  Eyebrow,
  Heading,
  InputGroup,
  Link,
  StatusDot,
  Text,
  TextInput,
} from "@codeday/topo/Atom";
import { Calendar, MapLocation, MapNav, UiSearch, UiX } from "@codeday/topocons";
import React, { useMemo, useState } from "react";

import {
  City,
  FOCUS_RING,
  REGION_GROUPS,
  statusCta,
  statusDateLabel,
  statusLabel,
  STATUS_COLOR,
} from "./data";
import { ChevronDownIcon, ChevronRightIcon, ExternalLinkIcon } from "./icons";

// `black`/`white` both invert in dark mode, so every ink/paper pair below
// flips together and stays contrasted either way — a light card with dark
// ink becomes a dark card with light ink, not near-black-on-near-black.
const TEXT = "{colors.black}";
const BODY = "{colors.gray.700}";
const CAPTION = "{colors.gray.600}";
const HAIRLINE = "{colors.current.border}";
const INPUT_BORDER = "{colors.current.border}";
const ACCENT = "{colors.colorPalette.800}";
const TINT = "colorPalette.100";
const TINT_STRONG = "colorPalette.200";

function Dot({ status }: { status: City["status"] }) {
  return (
    <Box
      width="2"
      height="2"
      borderRadius="full"
      display="inline-block"
      flexShrink={0}
      background={STATUS_COLOR[status]}
    />
  );
}

function NearestChip({ compact }: { compact?: boolean }) {
  return (
    <Badge
      variant="solid"
      colorPalette="blackberry"
      fontFamily="heading"
      fontSize="2xs"
      letterSpacing="0.14em"
      textTransform="uppercase"
      fontWeight="500"
      paddingInline={compact ? "2" : "2.5"}
      paddingBlock="1"
    >
      {compact ? m.www_events_nearest_chip() : m.www_events_nearest_to_you_chip()}
    </Badge>
  );
}

export function StatusLegend() {
  return (
    <Box display="flex" gap="5" color={BODY} flexShrink={0} flexWrap="wrap">
      {(["open", "planned", "interest"] as const).map((status) => (
        <StatusDot
          key={status}
          size={2}
          online={status === "open"}
          pending={status === "planned"}
          offline={status === "interest"}
          label={statusLabel(status)}
        />
      ))}
    </Box>
  );
}

function SearchInput({
  query,
  setQuery,
  height,
  fontSize,
  inputId,
}: {
  query: string;
  setQuery: (v: string) => void;
  height: string;
  fontSize: string;
  inputId: string;
}) {
  return (
    <Box flexGrow={1} position="relative">
      <Box as="label" {...({ htmlFor: inputId } as any)} visuallyHidden position="absolute">
        {m.www_events_search_label()}
      </Box>
      <InputGroup
        width="full"
        startElement={<UiSearch boxSize="20px" color={CAPTION} />}
        endElement={
          query ? (
            <Box
              as="button"
              {...({ type: "button" } as any)}
              onClick={() => setQuery("")}
              aria-label={m.www_events_search_clear()}
              width="8"
              height="8"
              borderRadius="full"
              border="0"
              background={TINT_STRONG}
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
              cursor="pointer"
              _focusVisible={FOCUS_RING}
            >
              <UiX boxSize="14px" color={TEXT} />
            </Box>
          ) : undefined
        }
      >
        <TextInput
          id={inputId}
          type="search"
          autoComplete="off"
          placeholder={m.www_events_search_placeholder()}
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
          width="full"
          height={height}
          fontSize={fontSize}
        />
      </InputGroup>
    </Box>
  );
}

function CityResultRow({
  city,
  isCurrent,
  showSubtitleStatus,
  onPick,
}: {
  city: City;
  isCurrent: boolean;
  showSubtitleStatus?: boolean;
  onPick: () => void;
}) {
  return (
    <Box
      as="button"
      {...({ type: "button" } as any)}
      onClick={onPick}
      display="flex"
      alignItems="center"
      gap="3"
      width="full"
      height="14"
      boxSizing="border-box"
      paddingInline="3"
      border="0"
      borderRadius="xl"
      background={isCurrent ? TINT_STRONG : "transparent"}
      textAlign="left"
      cursor="pointer"
      _focusVisible={FOCUS_RING}
      _hover={{ background: TINT_STRONG }}
    >
      <Dot status={city.status} />
      <Box flexGrow={1} display="flex" flexDirection="column" gap="0.5" minWidth={0}>
        <Text as="span" fontSize="md" fontWeight="600" color={TEXT} margin={0}>
          {city.name}
        </Text>
        <Text as="span" fontSize="xs" color={CAPTION} margin={0}>
          {showSubtitleStatus ? `${city.subtitle} · ${statusLabel(city.status)}` : city.subtitle}
        </Text>
      </Box>
      {!showSubtitleStatus && (
        <Text as="span" fontSize="sm" color={BODY} whiteSpace="nowrap">
          {statusLabel(city.status)}
        </Text>
      )}
      <ChevronRightIcon boxSize="18px" color={CAPTION} />
    </Box>
  );
}

function NoResultsCard({ query }: { query: string }) {
  return (
    <Box
      boxSizing="border-box"
      padding="{spacing.4.5} {spacing.4}"
      borderRadius="2xl"
      border={`1.5px dashed ${INPUT_BORDER}`}
      display="flex"
      flexDirection="column"
      gap="1.5"
    >
      <Text fontSize="md" fontWeight="600" margin={0}>
        {m.www_events_no_results_heading({ query })}
      </Text>
      <Text fontSize="sm" lineHeight="moderate" color={BODY} margin={0}>
        {m.www_events_no_results_body_pre()}{" "}
        <Link href="/volunteer" fontWeight="600" color={ACCENT}>
          {m.www_events_no_results_organize_link()}
        </Link>
        .
      </Text>
      <Button
        as="a"
        {...({ href: "/volunteer" } as any)}
        variant="primary"
        alignSelf="flex-start"
        marginTop="1.5"
      >
        {m.www_events_join_interest_list()}
      </Button>
    </Box>
  );
}

function ResultsList({
  results,
  query,
  currentCity,
  onPick,
}: {
  results: City[];
  query: string;
  currentCity: City | null;
  onPick: (id: string) => void;
}) {
  if (results.length === 0) {
    return <NoResultsCard query={query} />;
  }
  return (
    <Box display="flex" flexDirection="column" gap="1">
      <Eyebrow color={CAPTION} paddingInline="3" paddingBottom="1.5">
        {m.www_events_matching_cities()}
      </Eyebrow>
      {results.map((city) => (
        <CityResultRow
          key={city.id}
          city={city}
          isCurrent={currentCity?.id === city.id}
          onPick={() => onPick(city.id)}
        />
      ))}
    </Box>
  );
}

function DetailsPanel({ city, isNearest }: { city: City; isNearest: boolean }) {
  const venue = city.event?.venue;
  return (
    <Box
      boxSizing="border-box"
      padding="{spacing.6} {spacing.7} {spacing.7}"
      background="white"
      border={`1.5px solid ${TEXT}`}
      borderRadius="3xl"
      display="flex"
      flexDirection="column"
      gap="4.5"
    >
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <StatusDot
          size={2}
          color={BODY}
          online={city.status === "open"}
          pending={city.status === "planned"}
          offline={city.status === "interest"}
          label={statusLabel(city.status)}
        />
        {isNearest && <NearestChip />}
      </Box>
      <Heading as="h3" margin={0} fontSize="4xl" lineHeight="1.05" fontWeight="700">
        {m.www_events_detail_heading({ city: city.name })}
      </Heading>

      <Box display="flex" flexDirection="column" gap="2.5">
        <Box
          display="flex"
          gap="3"
          boxSizing="border-box"
          padding="{spacing.3.5} {spacing.4}"
          borderRadius="2xl"
          background={TINT}
        >
          <Box flexShrink={0} marginTop="0.5" color={ACCENT}>
            <Calendar boxSize="22px" />
          </Box>
          <Box display="flex" flexDirection="column" gap="0.5">
            <Text as="span" fontSize="xs" color={CAPTION} margin={0}>
              {m.www_events_detail_when()}
            </Text>
            {city.event ? (
              <>
                <Text as="span" fontSize="md" fontWeight="600" lineHeight="shorter" margin={0}>
                  {statusDateLabel(city.event)}
                </Text>
                {city.event.displayTime && (
                  <Text as="span" fontSize="sm" color={BODY} margin={0}>
                    {city.event.displayTime}
                  </Text>
                )}
              </>
            ) : (
              <Text as="span" fontSize="md" fontWeight="600" lineHeight="shorter" margin={0}>
                {m.www_events_detail_venue_tba()}
              </Text>
            )}
          </Box>
        </Box>
        <Box
          display="flex"
          gap="3"
          boxSizing="border-box"
          padding="{spacing.3.5} {spacing.4}"
          borderRadius="2xl"
          background={TINT}
        >
          <Box flexShrink={0} marginTop="0.5" color={ACCENT}>
            <MapLocation boxSize="22px" />
          </Box>
          <Box display="flex" flexDirection="column" gap="0.5">
            <Text as="span" fontSize="xs" color={CAPTION} margin={0}>
              {m.www_events_detail_where()}
            </Text>
            <Text as="span" fontSize="md" fontWeight="600" lineHeight="shorter" margin={0}>
              {venue?.name || m.www_events_detail_venue_tba()}
            </Text>
            {venue?.addressInline && (
              <Text as="span" fontSize="sm" color={BODY} margin={0}>
                {venue.addressInline}
              </Text>
            )}
          </Box>
        </Box>
      </Box>

      <Box display="flex" flexDirection="column" gap="2.5" paddingTop="1">
        <Button
          as="a"
          {...({ href: city.eventUrl, target: "_blank", rel: "noopener noreferrer" } as any)}
          variant="primary"
          size="lg"
        >
          {statusCta(city.status)}
          <ExternalLinkIcon boxSize="16px" style={{ marginLeft: 8 }} />
        </Button>
        <Text fontSize="sm" lineHeight="moderate" color={CAPTION} textAlign="center" margin={0}>
          {m.www_events_volunteer_line_post({ city: city.name })}
        </Text>
      </Box>
      <Text
        fontSize="sm"
        lineHeight="moderate"
        color={BODY}
        margin={0}
        paddingTop="3.5"
        borderTop={`{borders.sm} ${HAIRLINE}`}
      >
        {m.www_events_volunteer_line_pre({ city: city.name })}{" "}
        <Link href={`/volunteer/${city.id}`} fontWeight="600" color={ACCENT}>
          {m.www_events_volunteer_link()}
        </Link>
        .
      </Text>
    </Box>
  );
}

function groupCities(cities: City[]) {
  return REGION_GROUPS.map((name) => ({
    name,
    cities: cities.filter((c) => c.regionGroup === name),
  })).filter((g) => g.cities.length > 0);
}

function RegionGrid({
  cities,
  currentCity,
  nearestCity,
  onPick,
}: {
  cities: City[];
  currentCity: City | null;
  nearestCity: City | null;
  onPick: (id: string) => void;
}) {
  const groups = useMemo(() => groupCities(cities), [cities]);
  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(3, minmax(0, 1fr))"
      gap="{spacing.7} {spacing.5}"
    >
      {groups.map((group) => (
        <Box
          key={group.name}
          display="flex"
          flexDirection="column"
          gap="0.5"
          paddingTop="3"
          borderTop={`{borders.sm} ${TEXT}`}
        >
          <Box
            display="flex"
            alignItems="baseline"
            justifyContent="space-between"
            paddingInline="2.5"
            paddingBottom="1.5"
          >
            <Heading as="h3" margin={0} fontSize="md" fontWeight="700">
              {group.name}
            </Heading>
            <Eyebrow color={CAPTION}>{group.cities.length}</Eyebrow>
          </Box>
          {group.cities.map((city) => {
            const isCurrent = currentCity?.id === city.id;
            return (
              <Box
                key={city.id}
                as="button"
                {...({ type: "button" } as any)}
                onClick={() => onPick(city.id)}
                display="flex"
                alignItems="center"
                gap="2.5"
                width="full"
                height="10"
                boxSizing="border-box"
                paddingInline="2.5"
                border="0"
                borderRadius="xl"
                background={isCurrent ? TINT_STRONG : "transparent"}
                textAlign="left"
                cursor="pointer"
                _focusVisible={FOCUS_RING}
                _hover={{ background: TINT_STRONG }}
              >
                <Dot status={city.status} />
                <Text
                  as="span"
                  flexGrow={1}
                  fontSize="md"
                  fontWeight={isCurrent ? "700" : "500"}
                  color={TEXT}
                  margin={0}
                >
                  {city.name}
                </Text>
                {nearestCity?.id === city.id && <NearestChip compact />}
              </Box>
            );
          })}
        </Box>
      ))}
    </Box>
  );
}

function RegionAccordion({
  cities,
  currentCity,
  nearestCity,
  onPick,
}: {
  cities: City[];
  currentCity: City | null;
  nearestCity: City | null;
  onPick: (id: string) => void;
}) {
  const groups = useMemo(() => groupCities(cities), [cities]);
  const [openRegion, setOpenRegion] = useState<string | null>(currentCity?.regionGroup ?? null);

  React.useEffect(() => {
    if (currentCity) setOpenRegion(currentCity.regionGroup);
  }, [currentCity?.id]);

  return (
    <Box display="flex" flexDirection="column">
      {groups.map((group) => {
        const isOpen = openRegion === group.name;
        return (
          <Box
            key={group.name}
            display="flex"
            flexDirection="column"
            borderTop={`{borders.sm} ${TEXT}`}
          >
            <Box
              as="button"
              {...({ type: "button", "aria-expanded": isOpen } as any)}
              onClick={() => setOpenRegion(isOpen ? null : group.name)}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              gap="2.5"
              width="full"
              height="14"
              boxSizing="border-box"
              paddingInline="1"
              border="0"
              background="transparent"
              textAlign="left"
              cursor="pointer"
              _focusVisible={FOCUS_RING}
            >
              <Text as="span" fontSize="md" fontWeight="700" color={TEXT} margin={0}>
                {group.name}
              </Text>
              <Box display="inline-flex" alignItems="center" gap="2.5">
                <Eyebrow color={CAPTION}>{group.cities.length} cities</Eyebrow>
                <ChevronDownIcon
                  boxSize="18px"
                  color={TEXT}
                  style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                />
              </Box>
            </Box>
            {isOpen && (
              <Box display="flex" flexDirection="column" paddingBottom="2.5">
                {group.cities.map((city) => {
                  const isCurrent = currentCity?.id === city.id;
                  return (
                    <Box
                      key={city.id}
                      as="button"
                      {...({ type: "button" } as any)}
                      onClick={() => onPick(city.id)}
                      display="flex"
                      alignItems="center"
                      gap="2.5"
                      width="full"
                      height="12"
                      boxSizing="border-box"
                      paddingInline="2"
                      border="0"
                      borderRadius="xl"
                      background={isCurrent ? TINT_STRONG : "transparent"}
                      textAlign="left"
                      cursor="pointer"
                      _focusVisible={FOCUS_RING}
                    >
                      <Dot status={city.status} />
                      <Text
                        as="span"
                        flexGrow={1}
                        fontSize="md"
                        fontWeight={isCurrent ? "700" : "500"}
                        color={TEXT}
                        margin={0}
                      >
                        {city.name}
                      </Text>
                      {nearestCity?.id === city.id && <NearestChip compact />}
                      <Text as="span" fontSize="xs" color={CAPTION} margin={0}>
                        {city.subtitle}
                      </Text>
                    </Box>
                  );
                })}
              </Box>
            )}
          </Box>
        );
      })}
      <Box borderTop={`{borders.sm} ${TEXT}`} />
    </Box>
  );
}

export interface PickerProps {
  cities: City[];
  currentCity: City | null;
  nearestCity: City | null;
  isCurrentNearest: boolean;
  query: string;
  setQuery: (v: string) => void;
  selectCity: (id: string) => void;
  useMyLocation: () => void;
}

export default function Picker({
  cities,
  currentCity,
  nearestCity,
  isCurrentNearest,
  query,
  setQuery,
  selectCity,
  useMyLocation,
}: PickerProps) {
  const q = query.trim().toLowerCase();
  const results = useMemo(
    () => (q ? cities.filter((c) => `${c.name} ${c.subtitle}`.toLowerCase().includes(q)) : []),
    [cities, q],
  );

  return (
    <>
      {/* Desktop / tablet layout */}
      <Box
        display={{ base: "none", lg: "grid" }}
        gridTemplateColumns="repeat(12, minmax(0, 1fr))"
        columnGap="6"
        alignItems="start"
      >
        <Box gridColumn="1 / span 7" display="flex" flexDirection="column" gap="6">
          <Box display="flex" alignItems="center" gap="2.5">
            <SearchInput
              query={query}
              setQuery={setQuery}
              height="14"
              fontSize="lg"
              inputId="city-search"
            />
            <Button
              type="button"
              onClick={useMyLocation}
              variant="secondary"
              size="lg"
              flexShrink={0}
            >
              <MapNav boxSize="18px" />
              {m.www_events_use_my_location()}
            </Button>
          </Box>

          {q ? (
            <ResultsList
              results={results}
              query={query}
              currentCity={currentCity}
              onPick={selectCity}
            />
          ) : (
            <RegionGrid
              cities={cities}
              currentCity={currentCity}
              nearestCity={nearestCity}
              onPick={selectCity}
            />
          )}
        </Box>

        <Box gridColumn="8 / span 5">
          {currentCity && <DetailsPanel city={currentCity} isNearest={isCurrentNearest} />}
        </Box>
      </Box>

      {/* Phone layout */}
      <Box display={{ base: "flex", lg: "none" }} flexDirection="column" gap="4.5">
        <SearchInput
          query={query}
          setQuery={setQuery}
          height="14"
          fontSize="md"
          inputId="city-search-m"
        />
        {q && (
          <ResultsList
            results={results}
            query={query}
            currentCity={currentCity}
            onPick={selectCity}
          />
        )}
        {currentCity && <DetailsPanel city={currentCity} isNearest={isCurrentNearest} />}
        <Box display="flex" flexDirection="column" gap="2.5" paddingTop="2.5">
          <Box display="flex" alignItems="baseline" justifyContent="space-between">
            <Text as="span" fontSize="lg" fontWeight="700" margin={0}>
              {m.www_events_all_cities({ cityCount: cities.length })}
            </Text>
            <StatusLegend />
          </Box>
          <RegionAccordion
            cities={cities}
            currentCity={currentCity}
            nearestCity={nearestCity}
            onPick={selectCity}
          />
        </Box>
      </Box>
    </>
  );
}

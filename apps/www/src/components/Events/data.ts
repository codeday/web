import * as m from "@codeday/i18n/messages";
import haversineDistance from "haversine-distance";
import { DateTime } from "luxon";

export type CityStatus = "open" | "planned" | "interest";

export const REGION_GROUPS = [
  "US West",
  "US Midwest",
  "US South",
  "US East",
  "Canada & Latin America",
  "Europe, Middle East & Africa",
  "Asia-Pacific",
  "Other",
] as const;

export type RegionGroup = (typeof REGION_GROUPS)[number];

// The CMS's `area` field is a free-text string, not a schema enum, so this
// maps its known values onto the display groups above. `Canada`/`LATAM` are
// combined per spec; anything unmapped (typos, new areas) falls into "Other"
// rather than being silently dropped.
const AREA_GROUPS: Record<string, RegionGroup> = {
  "US West": "US West",
  "US Midwest": "US Midwest",
  OCONUS: "US West",
  "US South": "US South",
  "US East": "US East",
  Canada: "Canada & Latin America",
  LATAM: "Canada & Latin America",
  EMEA: "Europe, Middle East & Africa",
  APAC: "Asia-Pacific",
};

function classifyRegionGroup(area: string | null | undefined): RegionGroup {
  return AREA_GROUPS[(area || "").trim()] || "Other";
}

export interface CityEventVenue {
  name?: string | null;
  addressInline?: string | null;
}

export interface CityEvent {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  timezone?: string | null;
  displayDate?: string | null;
  displayTime?: string | null;
  registrationsOpen: boolean;
  venue?: CityEventVenue | null;
}

export interface City {
  id: string;
  name: string;
  subtitle: string;
  countryName: string;
  regionGroup: RegionGroup;
  status: CityStatus;
  event: CityEvent | null;
  lat: number | null;
  lon: number | null;
  eventUrl: string;
}

export interface RawClearEvent {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  timezone?: string | null;
  displayDate?: string | null;
  displayTime?: string | null;
  registrationsOpen: boolean;
  venue?: { name?: string | null; addressInline?: string | null } | null;
}

export interface RawCmsRegion {
  name?: string | null;
  webname?: string | null;
  countryName?: string | null;
  iso3166Alpha2Code?: string | null;
  area?: string | null;
  location?: { lat?: number | null; lon?: number | null } | null;
  clearEvents?: RawClearEvent[] | null;
}

// State/province only shows up for North America — everywhere else the
// spec calls for just the country name, so there's nothing to look up.
function subtitleFor(region: RawCmsRegion, soonestEvent: RawClearEvent | null): string {
  const iso = (region.iso3166Alpha2Code || "").toUpperCase();
  const countryName = (region.countryName || "").replace(/^the /i, "");
  if ((iso === "US" || iso === "CA") && soonestEvent?.venue) {
    const short = iso === "US" ? "USA" : "Canada";
    const address = soonestEvent.venue.addressInline || "";
    const stateMatch = address.match(/,\s*([A-Za-z .]+?)\s+\d{0,6}$/);
    const state = stateMatch?.[1]?.trim();
    return state ? `${state}, ${short}` : short;
  }
  return countryName || region.countryName || "";
}

function deriveStatus(events: RawClearEvent[] | null | undefined): {
  status: CityStatus;
  event: CityEvent | null;
} {
  const now = DateTime.now();
  const upcoming = (events || [])
    .filter((e) => e.startDate && DateTime.fromISO(e.startDate) >= now.minus({ days: 1 }))
    .sort(
      (a, b) => DateTime.fromISO(a.startDate).toMillis() - DateTime.fromISO(b.startDate).toMillis(),
    );

  if (upcoming.length === 0) {
    return { status: "interest", event: null };
  }
  const next = upcoming[0];
  return {
    status: next.registrationsOpen ? "open" : "planned",
    event: {
      id: next.id,
      name: next.name,
      startDate: next.startDate,
      endDate: next.endDate,
      timezone: next.timezone,
      displayDate: next.displayDate,
      displayTime: next.displayTime,
      registrationsOpen: next.registrationsOpen,
      venue: next.venue,
    },
  };
}

export function buildCities(regions: RawCmsRegion[]): City[] {
  return regions
    .filter((r) => r.name && r.webname && r.location?.lat != null && r.location?.lon != null)
    .map((region) => {
      const { status, event } = deriveStatus(region.clearEvents);
      return {
        id: region.webname as string,
        name: region.name as string,
        subtitle: subtitleFor(
          region,
          event ? (region.clearEvents || []).find((e) => e.id === event.id) : null,
        ),
        countryName: (region.countryName || "").replace(/^the /i, ""),
        regionGroup: classifyRegionGroup(region.area),
        status,
        event,
        lat: region.location?.lat ?? null,
        lon: region.location?.lon ?? null,
        eventUrl: `https://event.codeday.org/${region.webname}`,
      };
    });
}

export function findNearestCity(
  cities: City[],
  point: { lat: number; lon: number } | null,
): City | null {
  if (!point) return null;
  let nearest: City | null = null;
  let nearestMeters = Infinity;
  cities.forEach((city) => {
    if (city.lat == null || city.lon == null) return;
    const meters = haversineDistance(
      { lat: point.lat, lon: point.lon },
      { lat: city.lat, lon: city.lon },
    );
    if (meters < nearestMeters) {
      nearestMeters = meters;
      nearest = city;
    }
  });
  return nearest;
}

export function distanceTo(city: City, point: { lat: number; lon: number } | null): number | null {
  if (!point || city.lat == null || city.lon == null) return null;
  return haversineDistance({ lat: point.lat, lon: point.lon }, { lat: city.lat, lon: city.lon });
}

// Miles for US viewers, kilometers elsewhere; rounded to the nearest 10
// once past 100 units so the callout doesn't read like a precise fix.
export function formatDistance(meters: number, viewerIsUs: boolean): string {
  const raw = viewerIsUs ? meters / 1609.344 : meters / 1000;
  const rounded = raw > 100 ? Math.round(raw / 10) * 10 : Math.round(raw);
  const unit = viewerIsUs ? "mi" : "km";
  return `${rounded} ${unit}`;
}

// The spec's one focus-ring color for every interactive element on this
// page, since these are custom-styled buttons/rows rather than topo's own
// recipe-driven ones (which already carry their own focus treatment).
export const FOCUS_RING = { outline: "3px solid {colors.colorPalette.600}", outlineOffset: "0.5" };

export const STATUS_COLOR: Record<CityStatus, string> = {
  open: "status.open",
  planned: "yellow.500",
  interest: "status.interest",
};

export function statusLabel(status: CityStatus): string {
  if (status === "open") return m.www_events_status_open();
  if (status === "planned") return m.www_events_status_planned();
  return m.www_events_status_interest();
}

export function statusCta(status: CityStatus): string {
  if (status === "open") return m.www_events_cta_open();
  if (status === "planned") return m.www_events_cta_planned();
  return m.www_events_cta_interest();
}

export function statusDateLabel(event: CityEvent | null): string {
  if (!event) return "";
  const zone = event.timezone || undefined;
  const start = DateTime.fromISO(event.startDate, { zone });
  const end = DateTime.fromISO(event.endDate, { zone });
  if (start.hasSame(end, "day")) {
    return start.toFormat("ccc, MMM d");
  }
  return `${start.toFormat("ccc, MMM d")}–${end.toFormat("ccc, MMM d")}`;
}

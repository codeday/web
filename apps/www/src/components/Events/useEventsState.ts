import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";

import { City, distanceTo, findNearestCity } from "./data";

export interface GeoPoint {
  lat: number;
  lon: number;
}

export function useEventsState(cities: City[], serverPoint: GeoPoint | null) {
  const router = useRouter();
  const [point, setPoint] = useState<GeoPoint | null>(serverPoint);
  const [query, setQuery] = useState("");

  const requestLocation = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setPoint({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => {},
      { timeout: 8000, maximumAge: 10 * 60 * 1000 },
    );
  }, []);

  useEffect(() => {
    requestLocation();
  }, []);

  const nearestCity = useMemo(() => findNearestCity(cities, point), [cities, point]);
  const nearestDistanceMeters = useMemo(
    () => (nearestCity ? distanceTo(nearestCity, point) : null),
    [nearestCity, point],
  );

  const selectedCityId = typeof router.query.city === "string" ? router.query.city : undefined;
  const selectedCity = selectedCityId ? cities.find((c) => c.id === selectedCityId) || null : null;
  const fallbackCity = useMemo(
    () => cities.find((c) => c.status === "open") || cities[0] || null,
    [cities],
  );
  const currentCity = selectedCity || nearestCity || fallbackCity;

  const setUrlCity = useCallback(
    (id: string | undefined) => {
      const nextQuery: Record<string, any> = { ...router.query };
      if (id) nextQuery.city = id;
      else delete nextQuery.city;
      router.replace({ pathname: router.pathname, query: nextQuery }, undefined, {
        shallow: true,
        scroll: false,
      });
    },
    [router],
  );

  const selectCity = useCallback(
    (id: string) => {
      setQuery("");
      setUrlCity(id);
    },
    [setUrlCity],
  );

  const useMyLocation = useCallback(() => {
    setQuery("");
    setUrlCity(undefined);
    requestLocation();
  }, [setUrlCity, requestLocation]);

  return {
    point,
    nearestCity,
    nearestDistanceMeters,
    currentCity,
    isCurrentNearest: !!currentCity && !!nearestCity && currentCity.id === nearestCity.id,
    selectCity,
    useMyLocation,
    query,
    setQuery,
  };
}

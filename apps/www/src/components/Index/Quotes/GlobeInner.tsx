import { useTheme } from "@codeday/topo/utils";
import { debug } from "@codeday/utils";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Globe from "react-globe.gl";

const DEBUG = debug(["www", "components", "Quotes", "GlobeInner"]);

const DEFAULT_POV = { lat: 38.0, lng: -88.0, altitude: 2.5 };
const FOCUS_ALTITUDE = 2.5;
const TRANSITION_MS = 1000;
const AUTO_ROTATE_SPEED = 0.4;

interface GlobeInnerProps {
  regions: any[];
  testimonial: any;
  width: number;
  height: number;
}

export default function GlobeInner({ regions, testimonial, width, height }: GlobeInnerProps) {
  const { colors } = useTheme();
  const globeRef = useRef<any>(null);
  const [ready, setReady] = useState(false);

  // Configure controls and initial POV once the ref is populated.
  useEffect(() => {
    const globe = globeRef.current;
    if (!globe || typeof globe.controls !== "function") return;
    const controls = globe.controls();
    if (controls) {
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.enableRotate = false;
      controls.autoRotate = true;
      controls.autoRotateSpeed = AUTO_ROTATE_SPEED;
    }
    globe.pointOfView(DEFAULT_POV, 0);
    setReady(true);
    DEBUG("globe initialized");
  }, [globeRef.current]);

  // Animate to the testimonial's region when it changes, pausing
  // auto-rotate during the transition so the camera lands on the target.
  useEffect(() => {
    if (!ready) return;
    const globe = globeRef.current;
    if (!globe) return;
    const controls = globe.controls?.();

    if (controls) controls.autoRotate = false;

    if (testimonial?.region) {
      globe.pointOfView(
        {
          lat: testimonial.region.location.lat,
          lng: testimonial.region.location.lon + 4,
          altitude: FOCUS_ALTITUDE,
        },
        TRANSITION_MS,
      );
    } else {
      globe.pointOfView(DEFAULT_POV, TRANSITION_MS);
    }

    const t = setTimeout(() => {
      if (controls) controls.autoRotate = true;
    }, TRANSITION_MS);
    return () => clearTimeout(t);
  }, [testimonial, ready]);

  const pointsData = useMemo(
    () =>
      regions?.map((r) => ({
        lat: r.location.lat,
        lng: r.location.lon,
        color:
          testimonial?.region?.webname === r.webname
            ? (colors as any).red[600]
            : (colors as any).white,
        radius: testimonial?.region?.webname === r.webname ? 1.2 : 0.9,
        altitude: 0.01,
      })) ?? [],
    [regions, testimonial, colors],
  );

  return (
    <Globe
      ref={globeRef}
      globeImageUrl="/globe.jpg"
      backgroundColor="rgba(0,0,0,0)"
      showAtmosphere={true}
      atmosphereAltitude={0.15}
      pointsData={pointsData}
      pointLat="lat"
      pointLng="lng"
      pointColor="color"
      pointRadius="radius"
      pointAltitude="altitude"
      pointLabel={() => ""}
      pointsMerge={true}
      enablePointerInteraction={false}
      animateIn={false}
      width={width}
      height={height}
    />
  );
}

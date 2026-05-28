import { Box } from "@codeday/topo/Atom";
import { useTheme } from "@codeday/topo/utils";
import dynamic from "next/dynamic";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useInView } from "react-intersection-observer";

const GlobeGl = dynamic(() => import("react-globe.gl"), { ssr: false });

const DEFAULT_POV = { lat: 38.0, lng: -88.0, altitude: 2.5 };
const FOCUS_ALTITUDE = 2.5;
const TRANSITION_MS = 1000;

function InnerGlobe({ regions, testimonial }: { regions: any[]; testimonial: any }) {
  const { colors } = useTheme();
  const globeRef = useRef<any>(null);
  const [lastTestimonialHadRegion, setLastTestimonialHadRegion] = useState(false);

  // Disable zoom and auto-rotate via orbit controls once the globe is ready
  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;
    const controls = globe.controls();
    if (controls) {
      controls.enableZoom = false;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.4;
    }
    globe.pointOfView(DEFAULT_POV, 0);
  }, [globeRef.current]);

  // Animate to the testimonial's region when it changes
  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;
    if (!lastTestimonialHadRegion && !testimonial?.region) return;

    setLastTestimonialHadRegion(Boolean(testimonial?.region));

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
  }, [testimonial]);

  const pointsData = useMemo(
    () =>
      regions?.map((r) => ({
        lat: r.location.lat,
        lng: r.location.lon,
        color:
          testimonial?.region?.webname === r.webname
            ? (colors as any).red[600]
            : (colors as any).white,
        radius: testimonial?.region?.webname === r.webname ? 0.4 : 0.25,
        altitude: 0.01,
      })) ?? [],
    [regions, testimonial, colors],
  );

  return (
    <GlobeGl
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
    />
  );
}

interface GlobeProps {
  testimonial: any;
  regions: any[];
}

export default function Globe({ testimonial, regions }: GlobeProps) {
  if (typeof window === "undefined") {
    return null;
  }

  const { ref, inView } = useInView({ rootMargin: "500px" });
  const [hasLoaded, setHasLoaded] = useState(false);
  useEffect(() => {
    if (inView) {
      setHasLoaded(true);
    }
  }, [inView]);

  return (
    <Box ref={ref} height="100%" width="100%">
      {hasLoaded && <InnerGlobe regions={regions} testimonial={testimonial} />}
    </Box>
  );
}

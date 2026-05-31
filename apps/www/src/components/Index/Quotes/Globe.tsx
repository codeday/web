import { Box } from "@codeday/topo/Atom";
import dynamic from "next/dynamic";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useInView } from "react-intersection-observer";

// Dynamically import the inner component (which statically imports
// react-globe.gl) so the ref binds directly to the real Globe instance.
const GlobeInner = dynamic(() => import("./GlobeInner").then((m) => m.default), {
  ssr: false,
});

interface GlobeProps {
  testimonial: any;
  regions: any[];
}

export default function Globe({ testimonial, regions }: GlobeProps) {
  if (typeof window === "undefined") {
    return null;
  }

  const { ref: inViewRef, inView } = useInView({ rootMargin: "500px" });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [size, setSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  useEffect(() => {
    if (inView) setHasLoaded(true);
  }, [inView]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [hasLoaded]);

  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      containerRef.current = node;
      inViewRef(node);
    },
    [inViewRef],
  );

  return (
    <Box ref={setRefs} height="100%" width="100%">
      {hasLoaded && size.w > 0 && size.h > 0 && (
        <GlobeInner regions={regions} testimonial={testimonial} width={size.w} height={size.h} />
      )}
    </Box>
  );
}

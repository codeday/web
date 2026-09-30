import { useColorModeValue } from "@codeday/topo/Theme";
import { useRouter } from "next/compat/router";
import React, { useEffect, useState } from "react";

import colors from "../../Theme/vars/colors";
import darkColors from "../../Theme/vars/darkColors";
import { Box } from "../Box";

const HUES = ["red", "orange", "yellow", "green", "blue", "purple"] as const;
const SHOW_DELAY_MS = 120;

export interface PageLoadingBarProps {
  loading?: boolean;
}

function useRouteLoading(): boolean {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!router) return undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const start = (_url: string, { shallow }: { shallow: boolean }) => {
      if (shallow) return;
      clearTimeout(timer);
      timer = setTimeout(() => setLoading(true), SHOW_DELAY_MS);
    };
    const stop = () => {
      clearTimeout(timer);
      setLoading(false);
    };
    router.events.on("routeChangeStart", start);
    router.events.on("routeChangeComplete", stop);
    router.events.on("routeChangeError", stop);
    return () => {
      stop();
      router.events.off("routeChangeStart", start);
      router.events.off("routeChangeComplete", stop);
      router.events.off("routeChangeError", stop);
    };
  }, [router]);

  return loading;
}

export function PageLoadingBar({ loading }: PageLoadingBarProps) {
  const routeLoading = useRouteLoading();
  const stops = useColorModeValue(
    HUES.map((hue) => colors[hue][500]),
    HUES.map((hue) => darkColors[hue][600]),
  );

  if (!(loading ?? routeLoading)) return null;

  return (
    <Box
      aria-hidden
      position="fixed"
      top="0"
      insetInline="0"
      height="1"
      zIndex="max"
      pointerEvents="none"
      backgroundSize="200% 100%"
      animation="page-loading-bar 1.2s linear infinite"
      css={{
        backgroundImage: `linear-gradient(90deg, ${[...stops, stops[0]].join(", ")})`,
        "@media (prefers-reduced-motion: reduce)": { animationDuration: "4s" },
      }}
    />
  );
}
PageLoadingBar.displayName = "PageLoadingBar";

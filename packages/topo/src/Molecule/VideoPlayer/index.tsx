import { Box } from "@codeday/topo/Atom";
import dynamic from "next/dynamic";
import React, { useEffect, useRef } from "react";

//@ts-ignore
const Hls = dynamic(() => import("hls.js/dist/hls.light.js"), { ssr: false });

interface VideoPlayerProps {
  url?: string;
  poster?: string;
  autoPlay?: boolean;
  volume?: number;
  [key: string]: any;
}

export function VideoPlayer({ url, poster, autoPlay, volume, ...props }: VideoPlayerProps) {
  const player = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (typeof window === "undefined" || typeof player === "undefined") return;
    if (url?.split(".").pop() !== "m3u8") return;
    if (!(Hls as any).isSupported()) return;

    const hls = new (Hls as any)();
    hls.loadSource(url);
    hls.attachMedia(player);
  }, [typeof window, player, url]);

  return (
    <Box {...props}>
      <video
        ref={player}
        poster={poster}
        controls={true}
        preload="auto"
        autoPlay={autoPlay || false}
        src={url}
        {...((volume !== undefined ? { volume } : {}) as any)}
        width="100%"
        height="100%"
      ></video>
    </Box>
  );
}

export type { VideoPlayerProps };

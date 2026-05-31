import { Box } from "@codeday/topo/Atom";
import { MediaPlay } from "@codeday/topocons";
import React from "react";

import { VideoLink } from "@codeday/topo/Molecule";

interface VideoTestimonialThumbnailProps {
  video: any;
  [key: string]: any;
}

export default function VideoTestimonialThumbnail({
  video,
  ...props
}: VideoTestimonialThumbnailProps) {
  return (
    <VideoLink url={video.video.url} poster={video.largeImage?.url} autoPlay>
      <Box
        width="100%"
        p={0}
        aria-label={`Video quote from ${video.firstName || video.groupName}`}
        rounded="sm"
        textAlign="center"
        color="white"
        fontSize="4xl"
        boxShadow="md"
        position="relative"
        backgroundImage={`url(${video.testimonialPlayerThumb?.url})`}
        backgroundSize="cover"
        backgroundPosition="50% 50%"
        backgroundRepeat="no-repeat"
        height={40}
        {...props}
      >
        <Box display="inline" position="absolute" top="calc(50% - 0.5em)" left="calc(50% - 0.5em)">
          <MediaPlay />
        </Box>
      </Box>
    </VideoLink>
  );
}

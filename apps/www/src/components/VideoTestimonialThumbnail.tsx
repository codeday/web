import { Box } from "@codeday/topo/Atom";
import { VideoLink } from "@codeday/topo/Molecule";
import { MediaPlay } from "@codeday/topocons";
import React from "react";

import { graphql } from "@/gql";
import { FragmentType, useFragment } from "@/gql/fragment-masking";

export const VideoTestimonialThumbnailFragment = graphql(`
  fragment VideoTestimonialThumbnailComponent on CmsTestimonial {
    testimonialPlayerThumb: image {
      url(transform: { width: 400, height: 220 })
    }
    video {
      url
    }
    firstName
    groupName
  }
`);

interface VideoTestimonialThumbnailProps {
  video: FragmentType<typeof VideoTestimonialThumbnailFragment>;
  [key: string]: any;
}

export default function VideoTestimonialThumbnail({
  video: videoRef,
  ...props
}: VideoTestimonialThumbnailProps) {
  const video = useFragment(VideoTestimonialThumbnailFragment, videoRef);
  return (
    <VideoLink url={video.video.url} poster={undefined} autoPlay>
      <Box
        width="full"
        p={0}
        aria-label={`Video quote from ${video.firstName || video.groupName}`}
        rounded="sm"
        textAlign="center"
        color="trueWhite"
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

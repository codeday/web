import { Box, Text } from "@codeday/topo/Atom";
import React from "react";

import { graphql } from "@/gql";
import { FragmentType, useFragment } from "@/gql/fragment-masking";

export const PhotoFragment = graphql(`
  fragment PressPhotoComponent on CmsPressPhoto {
    tags
    photo {
      title
      description
      original: contentfulBaseUrl
      preview: url(transform: { width: 400, height: 250, resizeStrategy: FILL })
    }
    event {
      startsAt
      program {
        name
      }
    }
    subProgram {
      name
    }
    region {
      name
    }
  }
`);

interface PhotoProps {
  photo: FragmentType<typeof PhotoFragment>;
  [key: string]: any;
}

export default function Photo({ photo: photoRef, ...props }: PhotoProps) {
  const photo = useFragment(PhotoFragment, photoRef);
  return (
    <Box
      as="a"
      display="block"
      {...({ href: photo.photo.original } as any)}
      target="_blank"
      rel="noopener"
      backgroundImage={`url(${photo.photo.preview})`}
      backgroundSize="cover"
      backgroundPosition="50% 50%"
      backgroundRepeat="no-repeat"
      position="relative"
      {...props}
    >
      <Box
        opacity={0}
        _hover={{ opacity: 1 }}
        transition="opacity 0.5s"
        bg="blackAlpha.700"
        color="trueWhite"
        position="absolute"
        top="0"
        right="0"
        bottom="0"
        left="0"
        p={4}
      >
        <Text fontWeight="bold">
          {[
            photo.event?.program?.name,
            photo.region?.name,
            photo.event?.startsAt?.substring(0, 4),
          ].join(" ")}
        </Text>
        {photo.photo.description && <Text>{photo.photo.description}</Text>}
      </Box>
    </Box>
  );
}

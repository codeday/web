import { Grid } from "@codeday/topo/Atom";
import { Content } from "@codeday/topo/Molecule";
import shuffle from "knuth-shuffle-seeded";
import React, { useState } from "react";

import { graphql } from "@/gql";
import { FragmentType, useFragment } from "@/gql/fragment-masking";

import Photo, { PhotoFragment } from "./Photo";
import PhotoTagPicker from "./PhotoTagPicker";

export const PhotoGalleryFragment = graphql(`
  fragment PressPhotoGalleryComponent on Query {
    cms {
      pressPhotos {
        items {
          tags
          ...PressPhotoComponent
        }
      }
    }
  }
`);

interface PhotoGalleryProps {
  data: FragmentType<typeof PhotoGalleryFragment>;
  seed?: any;
  [key: string]: any;
}

export default function PhotoGallery({ data, seed, ...props }: PhotoGalleryProps) {
  const [filter, setFilter] = useState<string | null>(null);
  const {
    cms: { pressPhotos },
  } = useFragment(PhotoGalleryFragment, data);
  const photos = shuffle(pressPhotos?.items || [], seed);

  return (
    <Content wide {...props}>
      <PhotoTagPicker mb={8} photos={photos} onChange={setFilter} />
      <Grid
        templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" }}
        gap={4}
      >
        {photos
          .filter((photo) => !filter || photo.tags?.includes(filter))
          .map((photo, i) => (
            <Photo key={i} rounded={2} height={40} photo={photo} />
          ))}
      </Grid>
    </Content>
  );
}

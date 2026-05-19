import { Grid } from "@codeday/topo/Atom";
import { Content } from "@codeday/topo/Molecule";
import shuffle from "knuth-shuffle-seeded";
import React, { useState } from "react";

import { usePageData } from "@codeday/topo/Theme";
import Photo from "./Photo";
import PhotoTagPicker from "./PhotoTagPicker";

interface PhotoGalleryProps {
  seed?: any;
  [key: string]: any;
}

export default function PhotoGallery({ seed, ...props }: PhotoGalleryProps) {
  const [filter, setFilter] = useState<string | null>(null);
  const {
    cms: { pressPhotos },
  } = usePageData();
  const photos = shuffle(
    (pressPhotos?.items || []).map((m: any) => m),
    seed,
  );

  return (
    <Content wide {...props}>
      <PhotoTagPicker mb={8} photos={photos} onChange={setFilter} />
      <Grid
        templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" }}
        gap={4}
      >
        {photos
          .filter((photo: any) => !filter || photo.tags?.includes(filter))
          .map((photo: any) => (
            <Photo key={photo.id} rounded={2} height={40} photo={photo} />
          ))}
      </Grid>
    </Content>
  );
}

import { Box, Grid, Text, Image } from "@codeday/topo/Atom";

import { graphql } from "@/gql";
import { FragmentType, useFragment } from "@/gql/fragment-masking";

export const VolunteerPhotoGalleryFragment = graphql(`
  fragment VolunteerPhotoGallery on Query {
    cms {
      volunteerPhotoGallery: pressPhotos(where: { tags_contains_some: ["volunteer"] }) {
        items {
          photo {
            url(transform: { width: 600, height: 400, resizeStrategy: FILL })
          }
          region {
            name
          }
          event {
            title
            program {
              name
            }
          }
        }
      }
    }
  }
`);

interface PhotoGalleryProps {
  data: FragmentType<typeof VolunteerPhotoGalleryFragment>;
  [key: string]: any;
}

export default function PhotoGallery({ data, ...props }: PhotoGalleryProps) {
  const { cms } = useFragment(VolunteerPhotoGalleryFragment, data);
  const volunteerPhotoGallery = cms?.volunteerPhotoGallery?.items || [];

  return (
    <Grid
      templateColumns={{
        base: "repeat(2, 1fr)",
        md: "repeat(3, 1fr)",
        lg: "repeat(3, 1fr)",
        xl: "repeat(5, 1fr)",
      }}
      gap={8}
      {...props}
    >
      {volunteerPhotoGallery.map((vol: any, i: number) => (
        <Box
          key={vol.photo.url}
          display={{
            base: i >= 4 * 2 ? "none" : "block",
            md: i >= 3 * 3 ? "none" : "block",
            lg: i >= 3 * 3 ? "none" : "block",
            xl: i >= 3 * 5 ? "none" : "block",
          }}
        >
          <Image src={vol.photo.url} rounded="sm" alt="" />
          <Text fontSize="xs" mb={0} color="current.textLight">
            {vol.event.title}
            {vol.region?.name && ", "}
            {vol.region.name}
          </Text>
        </Box>
      ))}
    </Grid>
  );
}

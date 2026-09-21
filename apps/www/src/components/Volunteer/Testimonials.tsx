import { Box, Grid, Text, Image } from "@codeday/topo/Atom";
import shuffle from "knuth-shuffle-seeded";

import { graphql } from "@/gql";
import { FragmentType, useFragment } from "@/gql/fragment-masking";

import { useSlideshow } from "../../providers";

const QUOTE_DURATION = 10000;

export const VolunteerTestimonialsFragment = graphql(`
  fragment VolunteerTestimonials on Query {
    cms {
      volunteerTestimonials: testimonials(
        where: { image_exists: true, featured: true }
        limit: 10
      ) {
        items {
          quote
          firstName
          lastName
          experience
          title
          company
          type
          program {
            name
          }
          image {
            url(transform: { resizeStrategy: FILL, width: 64, height: 64 })
          }
        }
      }
    }
  }
`);

interface TestimonialsProps {
  data: FragmentType<typeof VolunteerTestimonialsFragment>;
  seed?: any;
  [key: string]: any;
}

export default function Testimonials({ data, seed, ...props }: TestimonialsProps) {
  const { cms } = useFragment(VolunteerTestimonialsFragment, data);
  const testimonials = shuffle(
    (cms?.volunteerTestimonials?.items || []).filter(
      (t: any) => t.quote.split(" ").length <= 6 * 8,
    ),
    seed,
  );
  const i = useSlideshow(testimonials.length, QUOTE_DURATION);

  return (
    <Box pl={8} borderLeftWidth={2} position="relative" h={{ base: 64, sm: 56, lg: 48 }} {...props}>
      {testimonials.map((t: any, j: number) => (
        <Grid
          h={{ base: 64, sm: 56, lg: 48 }}
          alignItems="center"
          position="absolute"
          top={0}
          key={t.quote}
        >
          <Box opacity={j === i ? 1 : 0} transition="all 1s ease-in-out">
            <Text fontSize="lg" fontStyle="italic" mb={1}>
              &ldquo;{t.quote}&rdquo;
            </Text>
            <Grid templateColumns="1fr {sizes.full}" alignItems="center" mt={4} gap={4}>
              <Box rounded="full" overflow="hidden" w={8} h={8} backgroundColor="gray.100">
                <Image src={t.image?.url} alt="" w="full" />
              </Box>
              <Text mb={0}>
                {t.firstName} {t.lastName}
                <br />
                {t.title && t.company ? (
                  <>
                    {t.title}, {t.company}
                    <br />
                  </>
                ) : (
                  <>
                    {t.type || "Participant"}, {t.program?.name || "CodeDay"}
                  </>
                )}
              </Text>
            </Grid>
          </Box>
        </Grid>
      ))}
    </Box>
  );
}

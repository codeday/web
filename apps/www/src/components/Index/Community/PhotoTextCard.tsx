import { Box, Grid, Image, Text } from "@codeday/topo/Atom";
import truncate from "truncate";

export default function PhotoTextCard({ photo, text, authors, wip, href }: any) {
  return (
    <Box
      rounded="md"
      width="sm"
      maxHeight="100%"
      h="100%"
      overflow="hidden"
      as={href ? "a" : undefined}
      {...({ href, target: "_blank" } as any)}
    >
      <Grid templateColumns="3fr 3fr" h="100%">
        <Box
          backgroundImage={`url(${photo})`}
          backgroundPosition="50% 50%"
          backgroundSize="cover"
          backgroundRepeat="no-repeat"
          h="100%"
        />
        <Box p={2} overflow="hidden">
          {authors &&
            authors.length > 0 &&
            (authors.length > 1 ? (
              <Box>
                {authors.map((author: any) => (
                  <Image
                    src={author.picture}
                    float="left"
                    alt=""
                    w={4}
                    h={4}
                    mr={2}
                    rounded="full"
                    key={author.picture}
                  />
                ))}
              </Box>
            ) : (
              <Box>
                <Image
                  src={authors[0].picture}
                  alt=""
                  float="left"
                  w={4}
                  h={4}
                  mr={2}
                  rounded="full"
                />
                <Text mb={0} fontWeight="bold" fontSize="sm">
                  {authors[0].name}
                </Text>
              </Box>
            ))}
          <Text fontSize="sm" mb={0} style={{ clear: "both" }}>
            {truncate(text, 90)}{" "}
            {wip && (
              <Text as="span" fontStyle="italic">
                #work-in-progress
              </Text>
            )}
          </Text>
        </Box>
      </Grid>
    </Box>
  );
}

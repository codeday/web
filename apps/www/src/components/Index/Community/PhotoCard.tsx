import { Box, Image, Text } from "@codeday/topo/Atom";

export default function PhotoCard({ photo, authors, wip, eventInfo, projectTitle, href }: any) {
  return (
    <Box
      rounded="md"
      backgroundImage={`url(${photo})`}
      backgroundPosition="50% 50%"
      backgroundSize="cover"
      w={64}
      h="100%"
      position="relative"
      as={href ? "a" : undefined}
      {...({ href, target: "_blank" } as any)}
      display="block"
    >
      {authors &&
        authors.length > 0 &&
        (authors.length > 1 ? (
          <Box p={2} backgroundImage="linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))">
            {authors.map((author: any) => (
              <Image
                src={author.picture}
                alt=""
                w={4}
                h={4}
                mr={2}
                float="left"
                rounded="full"
                key={author.picture}
              />
            ))}
            <Text mb={0} fontWeight="bold" fontSize="sm" color="white">
              &nbsp;
            </Text>
          </Box>
        ) : (
          <Box p={2} backgroundImage="linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))">
            <Image src={authors[0].picture} alt="" float="left" w={4} h={4} mr={2} rounded="full" />
            <Text mb={0} fontWeight="bold" fontSize="sm" color="white">
              {authors[0].name}
            </Text>
          </Box>
        ))}
      {!(authors && authors.length > 0) && eventInfo && (
        <Box p={2} backgroundImage="linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))">
          <Text mb={0} fontSize="sm" color="white" fontWeight="bold">
            {eventInfo
              ? [
                  eventInfo.event?.program?.name,
                  eventInfo.program?.name,
                  eventInfo.region?.name,
                ].join(" ")
              : projectTitle}
          </Text>
        </Box>
      )}
      {projectTitle && (
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          p={2}
          backgroundImage="linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,1))"
        >
          <Text mb={0} fontSize="sm" color="white" fontWeight="bold">
            {projectTitle}
          </Text>
        </Box>
      )}

      {wip && (
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          p={2}
          backgroundImage="linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,1))"
        >
          <Text mb={0} fontSize="sm" color="white" fontStyle="italic">
            #work-in-progress
          </Text>
        </Box>
      )}
    </Box>
  );
}

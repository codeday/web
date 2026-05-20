import { Box } from "@codeday/topo/Atom";
import PhotoTextCard from "./PhotoTextCard";
import PhotoCard from "./PhotoCard";

export default function Card({ photo, text, authors, wip, eventInfo, projectTitle, href }: any) {
  const elem =
    text && text.length > 0 ? (
      <PhotoTextCard
        photo={photo}
        text={text}
        authors={authors}
        wip={wip}
        eventInfo={eventInfo}
        {...({ href: href } as any)}
      />
    ) : (
      <PhotoCard
        photo={photo}
        authors={authors}
        wip={wip}
        eventInfo={eventInfo}
        projectTitle={projectTitle}
        {...({ href: href } as any)}
      />
    );

  return (
    <Box role="figure" height={40} borderWidth={1} overflow="hidden" mr={8} boxShadow="md">
      {elem}
    </Box>
  );
}

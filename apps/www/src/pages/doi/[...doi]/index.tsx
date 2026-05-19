import {
  Text,
  Link,
  Heading,
  Skelly,
  Spinner,
  Box,
  Grid,
  Divider,
  HStack,
  Image,
  Button,
} from "@codeday/topo/Atom";
import { Content } from "@codeday/topo/Molecule";
import { apiFetch } from "@codeday/topo/utils";
import {
  FileDb as FileDbIcon,
  FileDoc as FileDocIcon,
  FilePdf as FilePdfIcon,
  FileSlides as FileSlidesIcon,
  FileImage as FileImageIcon,
  FileMusic as FileMusicIcon,
  FileVideo as FileVideoIcon,
} from "@codeday/topocons";
import { print } from "graphql";
import { sign } from "jsonwebtoken";
import { DateTime } from "luxon";
import { GetStaticProps, GetStaticPaths } from "next";
import { useRouter } from "next/router";
import Markdown from "react-markdown";

import Page from "../../../components/Page";
import { usePageData } from "@codeday/topo/Theme";
import Error404 from "../../404";
import { PublicationQuery, ListPublicationsQuery } from "./index.gql";

function getCitation(publication: any): string | undefined {
  const citationAuthors = publication.contributors
    .map((c: any) => `${c.familyName}, ${c.givenName}`)
    .join("; ");
  if (publication.type === "dataset") {
    return `${citationAuthors}, ${DateTime.fromISO(publication.publicationDate).toFormat(
      "yyyy",
    )}, "${publication.title.replace(/"/g, "'")}", https://doi.org/${process.env.NEXT_PUBLIC_DOI_PREFIX}/${
      publication.doiSuffix
    }, CodeDay`;
  } else if (publication.type === "presentation") {
    return `${citationAuthors}, ${DateTime.fromISO(publication.publicationDate).toFormat(
      "yyyy",
    )}, "${publication.title.replace(/"/g, "'")}", https://doi.org/${process.env.NEXT_PUBLIC_DOI_PREFIX}/${
      publication.doiSuffix
    }, CodeDay`;
  } else if (publication.type === "proposal") {
    return `${citationAuthors}, ${DateTime.fromISO(publication.publicationDate).toFormat(
      "yyyy",
    )}, "${publication.title.replace(/"/g, "'")}", https://doi.org/${process.env.NEXT_PUBLIC_DOI_PREFIX}/${
      publication.doiSuffix
    }, CodeDay`;
  } else if (publication.type === "other") {
    return `${citationAuthors}, ${DateTime.fromISO(publication.publicationDate).toFormat(
      "yyyy",
    )}, "${publication.title.replace(/"/g, "'")}", https://doi.org/${process.env.NEXT_PUBLIC_DOI_PREFIX}/${
      publication.doiSuffix
    }, CodeDay`;
  }
}

interface FileIconProps {
  file: any;
}

function FileIcon({ file }: FileIconProps) {
  if (file.fileName.endsWith(".pdf")) {
    return <FilePdfIcon />;
  }
  if (file.fileName.endsWith(".pptx")) {
    return <FileSlidesIcon />;
  }
  if (
    file.fileName.endsWith(".png") ||
    file.fileName.endsWith(".jpg") ||
    file.fileName.endsWith(".jpeg")
  ) {
    return <FileImageIcon />;
  }
  if (file.fileName.endsWith(".mp3")) {
    return <FileMusicIcon />;
  }
  if (file.fileName.endsWith(".mp4")) {
    return <FileVideoIcon />;
  }
  if (file.fileName.endsWith(".csv") || file.fileName.endsWith(".json")) {
    return <FileDbIcon />;
  }
  return <FileDocIcon />;
}

export default function Home() {
  const { cms } = usePageData();
  const { query } = useRouter();

  if (!cms) {
    return (
      <Page slug={`/doi/${query.doi}`}>
        <Content>
          <Skelly h={12} mb={4} />
          <Spinner />
        </Content>
      </Page>
    );
  }

  if (cms?.publications?.items.length < 1) {
    return <Error404 />;
  }

  const {
    title,
    venue,
    type,
    description,
    contributors,
    files,
    doiSuffix,
    publicationDate,
    license,
    funderName,
  } = cms.publications.items[0];

  return (
    <Page slug={`/doi/${query.doi}`} title={title}>
      <Content mt={-8} mb={2}>
        <Text
          display="inline-block"
          fontSize="xs"
          textTransform="uppercase"
          mb={2}
          fontWeight="bold"
          fontStyle="italic"
        >
          {type === "other" ? "" : type}
          {[
            "preprint",
            "working_paper",
            "letter",
            "dissertation",
            "report",
            "review",
            "presentation",
            "proposal",
            "other",
          ].includes(type)
            ? `${type !== "other" ? " - " : ""}not formally published`
            : ""}
        </Text>
        <Heading as="h2" fontSize={{ base: "2xl", md: "4xl" }} mb={4} lineHeight="1.2">
          {title}
        </Heading>
      </Content>
      <Content>
        <Grid templateColumns={{ base: "1fr", md: "3fr 1fr" }} gap={4}>
          <Box>
            <Box display={{ base: "block", md: "flex" }} gap={{ base: 0, md: 6 }} mb={6}>
              {contributors.map((c: any) => (
                <Box key={c.username} mb={4}>
                  <Box fontSize="md" fontWeight="bold" mb={0}>
                    {c.name}
                    {c.orcid && (
                      <Link
                        position="relative"
                        top={0.5}
                        display="inline-block"
                        ml={2}
                        mb={0}
                        {...({ href: `https://orcid.org/${c.orcid}` } as any)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Image src="/orcid.svg" h="16px" />
                      </Link>
                    )}
                  </Box>
                  <Text fontSize="xs" mt={-1} mb={0}>
                    {c.affiliation || "CodeDay"}
                  </Text>
                </Box>
              ))}
            </Box>

            <Box mb={12}>
              <Heading fontSize="lg" mb={2}>
                {type === "dataset" ? "Description" : "Abstract"}
              </Heading>
              <Text fontSize="lg">
                <Markdown>{description}</Markdown>
              </Text>
            </Box>

            {files.items.length === 1 ? (
              <>
                <Button
                  as="a"
                  display="inline-block"
                  colorPalette="blue"
                  size="lg"
                  {...({ href: files.items[0].contentfulBaseUrl } as any)}
                >
                  <Text mb={0} mt={1.5}>
                    Download
                  </Text>
                  <Text fontSize="xs" mt={0} mb={0}>
                    <FileIcon file={files.items[0]} /> {files.items[0].fileName}
                  </Text>
                </Button>
              </>
            ) : (
              <Box>
                <Heading fontSize="lg" mb={2}>
                  Files
                </Heading>
                <Grid
                  autoFlow="column"
                  templateRows={{
                    base: `repeat(${files.items.length}, 1fr)`,
                    md: `repeat(${Math.ceil(files.items.length / 2)}, 1fr)`,
                  }}
                  templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                  gap={2}
                >
                  {files.items.map((f: any) => (
                    <Box key={f.contentfulBaseUrl}>
                      <Box as="a" {...({ href: f.contentfulBaseUrl } as any)}>
                        <HStack>
                          <Box fontSize="2xl" position="relative" top={1}>
                            <FileIcon file={f} />
                          </Box>
                          <Box>
                            <Link as="p" fontSize="sm" fontWeight="bold" mb={0}>
                              {f.title}
                            </Link>
                            <Text fontSize="xs" fontFamily="monospace" mb={0}>
                              {f.fileName}
                            </Text>
                          </Box>
                        </HStack>
                      </Box>
                    </Box>
                  ))}
                </Grid>
              </Box>
            )}
          </Box>
          <Box>
            <Box borderWidth={1} borderRadius="md" p={4}>
              <Heading fontSize="sm" mb={0}>
                DOI
              </Heading>
              <Link
                {...({
                  href: `https://doi.org/${process.env.NEXT_PUBLIC_DOI_PREFIX}/${doiSuffix}`,
                } as any)}
                fontSize="2xs"
                fontFamily="monospace"
                mb={2}
              >
                doi.org/{process.env.NEXT_PUBLIC_DOI_PREFIX}/{doiSuffix}
              </Link>
              <Divider mb={2} />
              <Heading fontSize="sm" mb={0}>
                Published
              </Heading>
              <Text fontSize="2xs" fontFamily="monospace" mb={2}>
                {DateTime.fromISO(publicationDate).toFormat("yyyy-MM-dd")}
              </Text>
              <Divider mb={2} />
              {venue && (
                <>
                  <Heading fontSize="sm" mb={0}>
                    Venue
                  </Heading>
                  <Text fontSize="2xs" fontFamily="monospace" mb={2}>
                    {venue}
                  </Text>
                  <Divider mb={2} />
                </>
              )}
              <Heading fontSize="sm" mb={0}>
                License
              </Heading>
              <Text fontSize="2xs" fontFamily="monospace" mb={2}>
                {license}
              </Text>
              <Divider mb={2} />
              {funderName && (
                <>
                  <Heading fontSize="sm" mb={0}>
                    Funder
                  </Heading>
                  <Text fontSize="2xs" fontFamily="monospace" mb={2}>
                    {funderName}
                  </Text>
                  <Divider mb={2} />
                </>
              )}
              <Heading fontSize="sm" mb={0}>
                Citation
              </Heading>
              <Text fontSize="2xs" fontFamily="monospace" mb={2}>
                {getCitation(cms.publications.items[0])}
              </Text>
            </Box>
          </Box>
        </Grid>
      </Content>
    </Page>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const query = await apiFetch(print(ListPublicationsQuery), {}, {});

  return {
    paths:
      query?.cms?.publications?.items?.map((i: any) => ({
        params: {
          doi: [process.env.NEXT_PUBLIC_DOI_PREFIX, i.doiSuffix],
        },
      })) || [],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const doi = params?.doi as string[];
  const token = sign({ scopes: "read:users" }, process.env.ACCOUNT_SECRET!, { expiresIn: "3m" });
  return {
    props: {
      query: await apiFetch(
        print(PublicationQuery),
        { doiSuffix: doi.slice(1).join("/") },
        {
          Authorization: `Bearer ${token}`,
        },
      ),
    },
    revalidate: 300,
  };
};

import { Presence } from "@chakra-ui/react";
import { Box, CodeDay, Button, Text, Heading } from "@codeday/topo/Atom";
import { Content } from "@codeday/topo/Molecule";
import { Header, SiteLogo, Main, Menu, Footer } from "@codeday/topo/Organism";
import { DefaultSeo } from "next-seo";
import Head from "next/head";
import React, { ReactNode } from "react";

import { useFundraise } from "../providers";
import { usePageData } from "@codeday/topo/Theme";

const DOMAIN = "https://www.codeday.org";
const FUNDRAISE_UP_BUTTON_ID = "XBSBRRMF";

interface PageProps {
  children?: ReactNode;
  title?: string;
  darkHeader?: boolean;
  slug?: string;
  seo?: any;
  fun?: boolean;
  [key: string]: any;
}

export default function Page({ children, title, darkHeader, slug, seo }: PageProps) {
  const { cms } = usePageData();
  const { mission } = cms || {};
  const { isFundraiseLoaded } = useFundraise();
  const disclaimerTexts = (cms?.globalSponsors?.items || [])
    .flatMap((sponsor: any) => sponsor.legalDisclaimer.split(`\n`))
    .filter(Boolean);

  return (
    <Box overflow="hidden">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      {seo ?? (
        <DefaultSeo
          title={title ? `${title} ~ CodeDay` : "CodeDay"}
          description={mission?.items[0]?.value}
          canonical={`${DOMAIN}${slug}`}
          openGraph={{
            type: "website",
            locale: "en_US",
            site_name: "CodeDay",
            url: `${DOMAIN}${slug}`,
          }}
          twitter={{
            handle: "@codeday",
            site: "@codeday",
            cardType: "summary_large_image",
          }}
        />
      )}
      <Box position="relative">
        <Header darkBackground={darkHeader} gradAmount={darkHeader && "lg"} underscore>
          <SiteLogo>
            <a href="/">
              <CodeDay withText />
              <Box as="h1" visuallyHidden>
                CodeDay
              </Box>
            </a>
          </SiteLogo>
          <Menu>
            <Button
              as="a"
              fontSize="md"
              fontWeight="600"
              variant="ghost"
              mr={2}
              {...({ href: "/contact" } as any)}
            >
              Contact
            </Button>
            <Button
              as="a"
              fontSize="md"
              fontWeight="600"
              variant="ghost"
              mr={2}
              {...({ href: "/volunteer" } as any)}
            >
              Volunteer
            </Button>
            <Button
              as="a"
              fontSize="md"
              fontWeight="600"
              variant="ghost"
              mr={2}
              {...({ href: "/press" } as any)}
            >
              Press
            </Button>

            <Box mt={-4} display="inline-block" minW="129px" maxH="48px">
              <Presence
                present={isFundraiseLoaded}
                animationName={{ _open: "fade-in", _closed: "fade-out" }}
              >
                <Box>
                  <a {...({ href: `#${FUNDRAISE_UP_BUTTON_ID}` } as any)} />
                </Box>
              </Presence>
            </Box>
          </Menu>
        </Header>
        <Main>{children}</Main>
        <Box mt={16}>
          {disclaimerTexts && disclaimerTexts.length > 0 && (
            <Content>
              <Box
                pl="4"
                pr="4"
                color="current.textLight"
                fontSize="2xs"
                borderWidth="1px"
                borderRadius="sm"
                bg="current.bgLight"
              >
                <Heading as="h3" fontSize="xs" mb={1} mt={2}>
                  Funding Statements and Disclaimers
                </Heading>
                {disclaimerTexts.map((text: string) => (
                  <Text mb={4} key={text}>
                    {text}
                  </Text>
                ))}
              </Box>
            </Content>
          )}
          <Footer repository="web" branch="master" domainName="www.codeday.org">
            {""}
          </Footer>
        </Box>
      </Box>
    </Box>
  );
}

import { Box, CodeDay } from "@codeday/topo/Atom";
import { Header, SiteLogo, Main, Menu, Footer } from "@codeday/topo/Organism";
import * as m from "@codeday/i18n/messages";
import { DefaultSeo } from "next-seo";
import Head from "next/head";
import React, { ReactNode } from "react";

import { useFundraise } from "../../providers";
import { usePageData } from "@codeday/topo/Theme";
import DisclaimerFooter from "./DisclaimerFooter";
import NavMenu from "./NavMenu";

const DOMAIN = "https://www.codeday.org";

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
          title={title ? `${title} ~ ${m.www_page_site_name()}` : m.www_page_site_name()}
          description={mission?.items[0]?.value}
          canonical={`${DOMAIN}${slug}`}
          openGraph={{
            type: "website",
            locale: "en_US",
            site_name: m.www_page_site_name(),
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
            <NavMenu isFundraiseLoaded={isFundraiseLoaded} />
          </Menu>
        </Header>
        <Main>{children}</Main>
        <Box mt={16}>
          <DisclaimerFooter disclaimerTexts={disclaimerTexts} />
          <Footer repository="web" branch="master" domainName="www.codeday.org">
            {""}
          </Footer>
        </Box>
      </Box>
    </Box>
  );
}

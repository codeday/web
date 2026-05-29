import { Grid, Heading, Link, Box, Text, Image } from "@codeday/topo/Atom";
import { Content } from "@codeday/topo/Molecule";
import * as m from "@codeday/i18n/messages";
import { useColorMode, usePageData } from "@codeday/topo/Theme";
import React from "react";


import PreviousCoverageLogos from "../PreviousCoverageLogos";

export default function Sponsors(props: any) {
  const { colorMode } = useColorMode();
  const {
    cms: { majorSponsors, minorSponsors },
  } = usePageData();
  return (
    <Content {...props}>
      <Grid templateColumns={{ base: "1fr", md: "1fr 4fr" }} gap={4}>
        <Box>
          <Text fontSize="xl" display="inline-block" color="current.textLight" mb={4} bold>
            {m.www_sponsors_recognized_by()}
          </Text>
          <Grid templateColumns={{ base: "1fr 1fr", md: "1fr" }} gap={2}>
            <Link
              href="https://www.guidestar.org/profile/shared/88ca3b85-4294-40a3-a922-415c75f0b9e5"
              target="_blank"
            >
              <Image src="https://widgets.guidestar.org/TransparencySeal/8867365" maxHeight={32} />
            </Link>
            <Link href="https://www.charitynavigator.org/ein/264742589" target="_blank">
              <Image src="/charity-navigator.png" maxHeight={32} />
            </Link>
          </Grid>
        </Box>

        <Box>
          <Text fontSize="xl" display="inline-block" color="current.textLight" mb={4} bold>
            {m.www_sponsors_as_seen_in()}
          </Text>
          <PreviousCoverageLogos num={5} h={8} mr={4} ml={0} mb={2} />
          <Heading as="h2" color="current.textLight" fontSize="xl" mt={12} mb={2} fontWeight="bold">
            {m.www_sponsors_with_support_from()}
          </Heading>
          <Grid
            templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)", lg: "repeat(6, 1fr)" }}
            gap={6}
          >
            {[...(majorSponsors?.items || []), ...(minorSponsors?.items || [])]?.map(
              (sponsor: any) => (
                <Link
                  href={sponsor.link}
                  target="_blank"
                  rel="noopener"
                  key={sponsor.link}
                  backgroundImage={`url(${colorMode === "light" ? sponsor.logo?.url || sponsor.darkLogo?.url : sponsor.darkLogo?.url || sponsor.logo?.url})`}
                  backgroundSize="contain"
                  backgroundPosition="50% 50%"
                  backgroundRepeat="no-repeat"
                  minHeight={16}
                  style={{ backgroundOrigin: "content-box" }}
                  aria-label={sponsor.name}
                />
              ),
            )}
          </Grid>
        </Box>
      </Grid>
    </Content>
  );
}

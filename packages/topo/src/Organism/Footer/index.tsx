import { chakra } from "@chakra-ui/react";
import * as m from "@codeday/i18n/messages";
import { baseLocale, getLocale } from "@codeday/i18n/runtime";
import {
  Box,
  CodeDay,
  CopyText,
  Flex,
  Grid,
  Heading,
  Link,
  List,
  ListItem,
  Skelly,
  Text,
  type BoxProps,
  type HeadingProps,
} from "@codeday/topo/Atom";
import { CONTENT_INSET, Content, GithubAuthors } from "@codeday/topo/Molecule";
import { useRegion } from "@codeday/topo/Region";
import { useCmp } from "@codeday/topo/Theme";
import { useApi } from "@codeday/topo/utils";
import { fixLocaleCasing } from "@codeday/utils";
import React, { useId, type ReactNode } from "react";

const query = `
query CmsConfigQuery ($locale: String!, $region: String!) {
  cms {
    sites(where: { type: "Public", display_contains_all: "Footer" }, locale: $locale) {
      items {
        sys {
          id
        }
        title
        link
      }
    }

    localizationConfigs(where:{ id: $region }, locale: $locale) {
      items {
        name
        contactDefaultType
        contactDefaultValue
        legalEntity {
          legalName
          identifierName
          identifier
        }
      }
    }
  }
}`;

const COMMUNITY_HREFS = [
  "/blog",
  "https://shop.codeday.org/",
  "https://app.dover.com/jobs/codeday",
];
const SUPPORT_HREFS = ["/help", "/conduct", "https://account.codeday.org/"];

const DOODLE_INK = { base: "hibiscus.true.800", _dark: "hibiscus.true.300" };
const DOODLE_ACCENT = { base: "orange.true.500", _dark: "orange.600" };

interface SiteLink {
  title: string;
  link: string;
  sys: { id: string };
}

export function FooterHeading(props: HeadingProps) {
  return (
    <Heading
      as="h2"
      fontFamily="body"
      fontSize="xs"
      fontWeight="bold"
      textTransform="uppercase"
      letterSpacing="widest"
      lineHeight="normal"
      color="fg.muted"
      mb={3}
      {...props}
    />
  );
}

function FooterLinkList({ children }: { children: ReactNode }) {
  return (
    <List listStyleType="none" display="flex" flexDirection="column" gap={2} fontSize="md">
      {children}
    </List>
  );
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  const isExternal = /^https?:\/\//.test(href);
  return (
    <ListItem>
      <Link
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener" : undefined}
        color="black"
        textDecoration="none"
        _hover={{ color: "hibiscus.600", textDecoration: "underline" }}
      >
        {children}
      </Link>
    </ListItem>
  );
}

function SiteLinks({ links }: { links?: SiteLink[] }) {
  if (!links) {
    return (
      <FooterLinkList>
        {[0, 1, 2].map((i) => (
          <ListItem key={i}>
            <Skelly />
          </ListItem>
        ))}
      </FooterLinkList>
    );
  }
  return (
    <FooterLinkList>
      {links.map(({ title, link, sys }) => (
        <FooterLink key={sys.id} href={link}>
          {title}
        </FooterLink>
      ))}
    </FooterLinkList>
  );
}

function groupSiteLinks(links: SiteLink[] | undefined, domainName: string | undefined) {
  if (!links) return { community: undefined, support: undefined };
  const relative = links.map((l) => {
    const prefix =
      domainName &&
      [`https://${domainName}`, `http://${domainName}`].find((p) => l.link.startsWith(p));
    return { ...l, link: prefix ? l.link.slice(prefix.length) || "/" : l.link };
  });
  const rank = (order: string[]) => (l: SiteLink) => {
    const i = order.indexOf(l.link);
    return i === -1 ? order.length : i;
  };
  const byRank = (order: string[]) => (a: SiteLink, b: SiteLink) => rank(order)(a) - rank(order)(b);
  return {
    community: relative
      .filter((l) => COMMUNITY_HREFS.includes(l.link))
      .sort(byRank(COMMUNITY_HREFS)),
    support: relative.filter((l) => !COMMUNITY_HREFS.includes(l.link)).sort(byRank(SUPPORT_HREFS)),
  };
}

function WavyDivider() {
  const patternId = `wave${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <chakra.svg aria-hidden="true" display="block" width="full" height="3" color="hibiscus.300">
      <defs>
        <pattern id={patternId} width="120" height="12" patternUnits="userSpaceOnUse">
          <path
            d="M0 6 C4 6 10 2 18 3 S30 9 40 8 S54 2 64 4 S78 10 90 8 S106 3 114 5 S118 6 120 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </chakra.svg>
  );
}

function DoodleLayer({ src, color }: { src: string; color: typeof DOODLE_INK }) {
  const mask = {
    maskImage: `url(${src})`,
    maskRepeat: "repeat-x",
    maskPosition: "center top",
    maskSize: "auto",
    WebkitMaskImage: `url(${src})`,
    WebkitMaskRepeat: "repeat-x",
    WebkitMaskPosition: "center top",
    WebkitMaskSize: "auto",
  };
  return <Box position="absolute" inset="0" bg={color} css={mask} />;
}

export interface FooterScene {
  ink: string;
  accent: string;
}

export interface FooterProps extends BoxProps {
  repository?: string;
  owner?: string;
  branch?: string;
  domainName?: string;
  scene?: FooterScene;
  children?: ReactNode;
}

const Footer = ({
  children,
  repository,
  owner,
  branch,
  domainName,
  scene,
  ref,
  ...props
}: FooterProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { ucUi, isCmpBlocked } = useCmp();
  const locale = getLocale();
  const region = useRegion();
  const { data: cmsData } = useApi({
    query,
    variables: { locale: fixLocaleCasing(locale), region },
  });
  const localization = cmsData?.cms?.localizationConfigs?.items?.[0];
  const { community, support } = groupSiteLinks(cmsData?.cms?.sites?.items, domainName);

  const repoUrl = `https://github.com/${owner || "codeday"}/${repository}`;
  const prsWelcome = m.topo_footer_prs_welcome();
  const showPrsWelcome =
    repository &&
    (locale === baseLocale || prsWelcome !== m.topo_footer_prs_welcome({}, { locale: baseLocale }));

  const isMainSite = domainName === "www.codeday.org";
  const mainSitePrefix = isMainSite ? "" : `https://${domainName}`;
  const legalLinks = [
    { href: "/legal/tos", label: m.topo_footer_terms_of_service() },
    { href: "/legal/privacy", label: m.topo_footer_privacy_policy() },
    { href: "/legal/cookies", label: m.topo_footer_cookie_policy() },
    { href: "/legal/disclaimer", label: m.topo_footer_disclaimer() },
    { href: "/privacy/controls", label: m.topo_footer_ccpa() },
  ];
  const legalLinkStyle = {
    color: "inherit",
    textDecoration: "none",
    _hover: { color: "hibiscus.600", textDecoration: "underline" },
  };

  return (
    <Box
      ref={ref}
      as="footer"
      role="contentinfo"
      bg={{ base: "hibiscus.true.50", _dark: "current.bg" }}
      borderTop="sm"
      borderTopColor="current.border"
      color="black"
      fontFamily="body"
      {...(props as any)}
    >
      <Box paddingInline={CONTENT_INSET} paddingBlockStart={{ base: 10, md: 14 }}>
        <Content mb={0}>
          <Grid templateColumns={{ base: "1fr", lg: "5fr 7fr" }} gap={{ base: 10, lg: 12 }}>
            <Box>
              <Box
                as="a"
                display="inline-block"
                fontSize="2xl"
                aria-label="CodeDay"
                color="black"
                {...({ href: "/" } as any)}
              >
                <CodeDay withText />
              </Box>
              {repository && (
                <Box mt={4} fontSize="sm">
                  <GithubAuthors
                    repository={repository}
                    owner={owner}
                    branch={branch}
                    title={m.topo_footer_maintained_by()}
                    color="fg.muted"
                  />
                  {showPrsWelcome && (
                    <Flex alignItems="flex-end" gap={1} mt={1}>
                      <chakra.svg
                        aria-hidden="true"
                        viewBox="0 0 40 32"
                        width="8"
                        height="6"
                        flexShrink={0}
                        color={DOODLE_INK}
                        display={{ base: "none", sm: "block" }}
                      >
                        <path
                          d="M36 28 C24 29 12 24 9 6 M3 12 L9 4 L15 11"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </chakra.svg>
                      <Link
                        href={repoUrl}
                        target="_blank"
                        rel="noopener"
                        fontFamily="handwriting"
                        fontWeight="medium"
                        fontSize="xl"
                        lineHeight="short"
                        color={DOODLE_INK}
                        textDecoration="none"
                        transform="rotate(-3deg)"
                        _hover={{ textDecoration: "underline" }}
                        _focusVisible={{ textDecoration: "underline" }}
                      >
                        {prsWelcome}
                      </Link>
                    </Flex>
                  )}
                </Box>
              )}
            </Box>

            <Grid
              as="nav"
              aria-label={m.topo_footer_navigation()}
              templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}
              gap={8}
            >
              <Box>
                <FooterHeading>{m.topo_footer_community()}</FooterHeading>
                <SiteLinks links={community} />
              </Box>
              <Box>
                <FooterHeading>{m.topo_footer_support()}</FooterHeading>
                <SiteLinks links={support} />
              </Box>
              <Box>
                <FooterHeading>{m.topo_footer_organization()}</FooterHeading>
                <Box display="flex" flexDirection="column" gap={2} fontSize="md">
                  <Text>{m.topo_footer_nonprofit()}</Text>
                  {localization?.legalEntity && (
                    <Box>
                      <CopyText
                        fontFamily="mono"
                        fontSize="sm"
                        color="black"
                        label={`${localization.name} ${localization.legalEntity.identifierName}: `}
                      >
                        {localization.legalEntity.identifier}
                      </CopyText>
                    </Box>
                  )}
                  {localization?.contactDefaultValue && (
                    <FooterLinkList>
                      <FooterLink
                        href={
                          localization.contactDefaultType === "whatsapp"
                            ? `https://api.whatsapp.com/send?phone=${localization.contactDefaultValue.replace(/[^0-9]/g, "")}`
                            : `tel:${localization.contactDefaultValue.replace(/[^0-9+]/g, "")}`
                        }
                      >
                        {localization.contactDefaultValue}
                      </FooterLink>
                    </FooterLinkList>
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>

          {children && <Box mt={{ base: 10, md: 12 }}>{children}</Box>}

          <Box mt={{ base: 10, md: 12 }}>
            <WavyDivider />
            <Flex
              direction={{ base: "column", md: "row" }}
              justifyContent="space-between"
              alignItems={{ base: "flex-start", md: "center" }}
              gap={{ base: 3, md: 6 }}
              mt={4}
              fontSize="sm"
              color="fg.muted"
            >
              <Text>
                {m.topo_footer_copyright({
                  currentYear: String(new Date().getFullYear()),
                  entityName: localization?.legalEntity?.legalName ?? "CodeDay",
                })}
              </Text>
              <Flex as="ul" listStyleType="none" wrap="wrap" columnGap={4} rowGap={1}>
                {legalLinks.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={`${mainSitePrefix}${href}`}
                      target={isMainSite ? undefined : "_blank"}
                      rel="noopener"
                      {...legalLinkStyle}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
                {!isCmpBlocked && (
                  <li>
                    <Link
                      as="button"
                      id="usercentrics-psl"
                      cursor="pointer"
                      onClick={() => ucUi?.showSecondLayer()}
                      {...legalLinkStyle}
                    >
                      {m.topo_footer_privacy_settings()}
                    </Link>
                  </li>
                )}
              </Flex>
            </Flex>
          </Box>
        </Content>
      </Box>

      {scene ? (
        <Box aria-hidden="true" position="relative" height="80" mt={6} overflow="hidden">
          <DoodleLayer src={scene.ink} color={DOODLE_INK} />
          <DoodleLayer src={scene.accent} color={DOODLE_ACCENT} />
        </Box>
      ) : (
        <Box height="10" />
      )}
    </Box>
  );
};
export { Footer };

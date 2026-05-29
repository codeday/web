import { childrenOfType, makePureBox, type ComponentWithAs } from "@codeday/topo/_utils";
import {
  Box,
  CopyText,
  Grid,
  Heading,
  ListItem,
  Link,
  List,
  Skelly,
  Text,
  type BoxProps,
} from "@codeday/topo/Atom";
import { Content, GithubAuthors } from "@codeday/topo/Molecule";
import { useCmp, useQuery } from "@codeday/topo/Theme";
import * as m from "@codeday/i18n/messages";
import React, { type ReactNode } from "react";

export const CustomLinks: ComponentWithAs<"div", BoxProps> = makePureBox("Custom Links");
export const CustomText: ComponentWithAs<"div", BoxProps> = makePureBox("CustomText");

const StandardLinks = ({ domainName }: { domainName?: string }) => {
  const links = useQuery<{ sys: { id: string }; link: string; title: string }[] | undefined>(
    "cms.sites.items",
  );

  return (
    <List fontSize="md">
      {!links ? (
        <>
          <ListItem>
            <Skelly />
          </ListItem>
          <ListItem>
            <Skelly />
          </ListItem>
          <ListItem>
            <Skelly />
          </ListItem>
        </>
      ) : (
        links.map(({ title, link, sys }: any) => {
          const isExternalLink =
            !domainName ||
            (!link.startsWith(`https://${domainName}`) && !link.startsWith(`http://${domainName}`));
          return (
            <ListItem listStyleType="none" key={sys.id}>
              <Link
                href={
                  isExternalLink ? link : link.slice(link.indexOf(domainName) + domainName.length)
                }
                target={isExternalLink ? "_blank" : undefined}
                rel={isExternalLink ? "noopener" : undefined}
                key={link}
              >
                {title}
              </Link>
            </ListItem>
          );
        })
      )}
    </List>
  );
};

export interface FooterProps extends BoxProps {
  repository?: string;
  owner?: string;
  branch?: string;
  children: ReactNode;
  domainName?: string;
}

const Footer = (
  ({ children, repository, owner, branch, domainName, ref, ...props }: FooterProps & { ref?: React.Ref<any> }) => {
    const { ucUi } = useCmp();
    const ccpaLink = m.topo_footer_ccpa();
    const resourcesHeading = m.topo_footer_resources();
    const customHeading = m.topo_footer_custom_links();
    const copyright = m.topo_footer_copyright({ currentYear: String(new Date().getFullYear()) });
    const nonprofit = m.topo_footer_nonprofit();
    const maintainedBy = m.topo_footer_maintained_by();

    const localizationContact = useQuery<
      { contactDefaultType: string; contactDefaultValue: string } | undefined
    >("cms.localizationConfig");

    const customLinks = childrenOfType(children, CustomLinks);
    const customText = childrenOfType(children, CustomText);

    const isMainSite = domainName === "www.codeday.org";
    const mainSitePrefix = isMainSite ? "" : `https://${domainName}`;

    return (
      <Content
        fontSize="sm"
        ref={ref as React.MutableRefObject<any>}
        role="contentinfo"
        {...(props as any)}
      >
        {repository && (
          <Box mb={4}>
            <GithubAuthors
              repository={repository}
              owner={owner}
              branch={branch}
              title={maintainedBy}
            />
          </Box>
        )}
        <Grid templateColumns={{ base: "1fr", md: "6fr 3fr 3fr" }} color="current.textLight">
          <Box fontFamily="body" gridRow={{ base: 3, md: 1 }} marginTop={{ base: 6, md: 0 }}>
            <Box>
              {customText.length > 0 ? (
                customText
              ) : (
                <Text>
                  {typeof copyright === "string"
                    ? copyright.replace("{currentYear}", new Date().getFullYear().toString())
                    : copyright}
                  <br />
                  {nonprofit}{" "}
                  <CopyText fontFamily="monospace" label="US EIN: ">
                    26-4742589
                  </CopyText>
                  <br />
                  {localizationContact &&
                    (localizationContact.contactDefaultValue === "whatsapp" ? (
                      <Link
                        href={`https://api.whatsapp.com/send?phone=${localizationContact.contactDefaultValue.replace(
                          /[^0-9]/g,
                          "",
                        )}`}
                      >
                        {localizationContact.contactDefaultValue}
                      </Link>
                    ) : (
                      <Link
                        href={`tel:${localizationContact.contactDefaultValue.replace(
                          /[^0-9]/g,
                          "",
                        )}`}
                      >
                        {localizationContact.contactDefaultValue}
                      </Link>
                    ))}
                </Text>
              )}
            </Box>
            <Box marginTop={4}>
              <Link
                href={`${mainSitePrefix}/legal/tos`}
                target={isMainSite ? undefined : "_blank"}
                rel="noopener"
              >
                {m.topo_footer_terms_of_service()}
              </Link>
              <br />
              <Link
                href={`${mainSitePrefix}/legal/privacy`}
                target={isMainSite ? undefined : "_blank"}
                rel="noopener"
              >
                {m.topo_footer_privacy_policy()}
              </Link>
              <br />
              <Link
                href={`${mainSitePrefix}/legal/cookies`}
                target={isMainSite ? undefined : "_blank"}
                rel="noopener"
              >
                {m.topo_footer_cookie_policy()}
              </Link>
              <br />
              <Link
                href={`${mainSitePrefix}/legal/disclaimer`}
                target={isMainSite ? undefined : "_blank"}
                rel="noopener"
              >
                {m.topo_footer_disclaimer()}
              </Link>
              <br />
              <Link
                href={`${mainSitePrefix}/privacy/controls`}
                target={isMainSite ? undefined : "_blank"}
                rel="noopener"
              >
                {ccpaLink}
              </Link>
              <br />
              <Link as="a" onClick={() => ucUi?.showSecondLayer()} id="usercentrics-psl">
                {m.topo_footer_privacy_settings()}
              </Link>
            </Box>
          </Box>
          <Box
            gridRow={{ base: 2, md: 1 }}
            marginTop={{ base: customLinks.length > 0 ? 6 : "", md: 0 }}
          >
            {customLinks.length > 0 && (
              <Heading as="h2" fontSize="xl">
                {customHeading}
              </Heading>
            )}
            {customLinks}
          </Box>
          <Box>
            <Heading as="h2" fontSize="xl">
              {resourcesHeading}
            </Heading>
            <StandardLinks domainName={domainName} />
          </Box>
        </Grid>
      </Content>
    );
  }
);
export { Footer };

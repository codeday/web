import * as m from "@codeday/i18n/messages";
import { Box, Button, SquircleLogo } from "@codeday/topo/Atom";
import {
  Header,
  HeaderBrand,
  HeaderLink,
  HeaderSpacer,
  Main,
  Footer,
} from "@codeday/topo/Organism";
import { DefaultSeo } from "next-seo";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { ReactNode, useRef } from "react";

import { graphql } from "@/gql";
import { FragmentType, useFragment } from "@/gql/fragment-masking";

import DisclaimerFooter from "./DisclaimerFooter";

export const PageFragment = graphql(`
  fragment PageComponent on Query {
    cms {
      mission: strings(where: { key: "common.mission" }) {
        items {
          value
        }
      }
      globalSponsors(where: { legalDisclaimer_exists: true }) {
        items {
          legalDisclaimer
        }
      }
    }
  }
`);

const DOMAIN = "https://www.codeday.org";

// The specific embedded-button ID FundraiseUp's own script looks for —
// distinct from the account-level widget ID in `Fundraise.tsx`. Their
// script REPLACES this anchor in place with a real, cross-origin
// `<iframe title="Donate Button">` fixed at 130×56px via inline styles
// marked `!important` (confirmed by inspection) — not just a click
// listener on the original element, so a synthetic `.click()` on a saved
// ref can end up targeting a node that's no longer in the tree, and even
// when it is, a JS click can't reach inside a cross-origin iframe's own
// content anyway. The size is locked too — no external stylesheet rule
// can resize or reposition it, inline `!important` always wins that fight.
//
// The correct way to put a custom-styled trigger in front of a third-party
// widget iframe is the reverse of "hide it and click it": make the REAL
// iframe invisible-but-interactive (`opacity: 0`, done globally in
// `Fundraise.tsx`) and stack our own visible button on top of it. A real
// mouse click lands on the true (invisible) widget surface and triggers
// FundraiseUp's actual behaviour; what the user sees is our button.
//
// The iframe's own 130×56px is too large for a header action, and content
// clipped by an `overflow: hidden` ancestor isn't just invisible, it's
// also un-hit-testable (confirmed by inspection) — so the mount point is
// wrapped in a box clipped down to whatever size our own button actually
// renders at. That size isn't measured or hardcoded anywhere: the CLIPPING
// box is `position: absolute; inset: 0` against its own sibling, the
// button, and an absolutely-positioned element never contributes to its
// parent's auto ("shrink-to-fit") sizing — so the OUTER wrapper's size is
// driven by the button alone, every render, automatically staying correct
// if the button's copy, font, or padding ever changes, with no observer or
// JS measurement needed. `onClick` on the button also best-effort replays
// a click on the mount node directly — mainly for keyboard/AT activation,
// which the overlay alone doesn't cover.
const FUNDRAISE_UP_BUTTON_ID = "XBSBRRMF";

interface PageProps {
  children?: ReactNode;
  title?: string;
  slug?: string;
  seo?: any;
  /** Overrides the CMS `mission` fallback for the meta/OG description — for a page whose description is fixed copy rather than editorial content. */
  description?: string;
  /**
   * Undefined on pages that don't compose `PageFragment` into their query
   * yet — the disclaimer footer and CMS-sourced meta description simply
   * no-op in that case, same as they always have.
   */
  data?: FragmentType<typeof PageFragment>;
  /**
   * The hidden "CodeDay" logo text is an `h1` by default, since most pages
   * have no other heading acting as the document's title. A page whose own
   * content supplies its own real `h1` (e.g. a hero heading) needs this
   * demoted to `span` instead, or the page ends up with two `h1`s.
   */
  logoHeadingLevel?: "h1" | "span";
  /**
   * Whether the header sits over its own colourful gradient field (the
   * design system's `onWash` treatment) rather than a plain light bar.
   * Defaults on — this is the header's normal state, not a special case.
   */
  onWash?: boolean;
  fun?: boolean;
  /**
   * Extra disclaimer paragraphs to append after the CMS-sourced global
   * sponsor disclaimers — e.g. the alum-employer trademark disclaimer a page
   * rendering `LogoWall` computes for the logos it actually shows. Each
   * entry renders as its own paragraph, same as a sponsor disclaimer.
   */
  fundingDisclaimers?: string[];
  [key: string]: any;
}

export default function Page({
  children,
  title,
  slug,
  seo,
  description,
  logoHeadingLevel = "h1",
  onWash = true,
  data,
  fundingDisclaimers = [],
}: PageProps) {
  const cms = useFragment(PageFragment, data)?.cms;
  const { mission } = cms || {};
  const donateAnchorRef = useRef<HTMLAnchorElement | null>(null);
  const router = useRouter();
  const isResearchActive = router.pathname === "/research";
  const isMicroInternshipActive = router.pathname.startsWith("/micro-internship");
  const isEventsActive = router.pathname === "/events";
  const isContactActive = router.pathname === "/contact";
  const isVolunteerActive = router.pathname.startsWith("/volunteer");
  const isPressActive = router.pathname === "/press";
  const disclaimerTexts = [
    ...(cms?.globalSponsors?.items || [])
      .flatMap((sponsor: any) => sponsor.legalDisclaimer.split(`\n`))
      .filter(Boolean),
    ...fundingDisclaimers,
  ];

  return (
    // `overflow-x: clip` (not `overflow: hidden`) — `hidden` on either axis
    // makes this box a CSS "scroll container", which breaks `position:
    // sticky` for every descendant (the header, the research filter bar)
    // even though this box never actually scrolls itself (the real page
    // scroll happens on `<html>`). `clip` still stops horizontal bleed from
    // decorative Wash/mesh elements without creating that scroll container.
    <Box overflowX="clip" overflowY="visible">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      {seo ?? (
        <DefaultSeo
          title={title ? `${title} ~ ${m.www_page_site_name()}` : m.www_page_site_name()}
          description={description ?? mission?.items[0]?.value}
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
        {/* The header itself is `position: sticky`, but its surrounding
            top/bottom margin was plain in-flow spacing — once stuck,
            page content scrolled right up against it with no gap and no
            backdrop. Moving that spacing onto THIS wrapper (as padding,
            not margin) and making the wrapper the sticky element instead
            means the gap scrolls (and sticks) together with the header,
            with a background so content doesn't visually collide with it.
            The header no longer sticks on its own — `position="relative"`
            below hands stickiness to this wrapper so the two don't fight
            over the same `top: 0`. It has to stay `relative` rather than
            `static`, though: Header's own onWash grain canvas is
            `position: absolute; inset: 0`, which anchors to the nearest
            *positioned* ancestor — `static` would skip right past Header
            and let the canvas anchor to (and bleed across) this wrapper's
            whole padded band instead of staying clipped to the header
            pill itself. Full-bleed width (no `maxWidth` here) so the
            background spans edge to edge on both mobile and desktop; the
            header's own `maxWidth`/`marginX="auto"` still centers its
            content the same way it always did. */}
        <Box
          position="sticky"
          top="0"
          zIndex="30"
          paddingTop={{ base: "0", md: "8" }}
          paddingBottom="4"
          backgroundImage="linear-gradient(180deg, {colors.current.bg} 0%, {colors.current.bg} 80%, transparent 100%)"
        >
          <Header
            onWash={onWash}
            maxWidth="container.lg"
            marginX="auto"
            position="relative"
            borderTopRadius={{ base: "0", md: "xl" }}
          >
            <HeaderBrand>
              <Box as="a" display="block" {...({ href: "/" } as any)}>
                {/* Always the full-colour mark in the header — deliberately
                  NOT following `onWash` here, unlike the header's links/
                  action, which do still flip white-on-wash. */}
                <SquircleLogo boxSize="7" onWash={false} />
              </Box>
            </HeaderBrand>
            <HeaderLink href="/events" active={isEventsActive}>
              {m.www_navmenu_events()}
            </HeaderLink>
            <HeaderLink href="/micro-internship" active={isMicroInternshipActive}>
              {m.www_navmenu_microinternship()}
            </HeaderLink>
            {/* The separator is a `_before` pseudo-element floated into the
              flex `gap` before this link, not a real border/padding on the
              link's own box — the active-state bar (rendered inside
              `HeaderLink` when `active`) spans `left: 0; right: 0` of that
              box, so widening the box with padding would stretch the bar
              into the gap along with it. A pseudo-element adds no layout
              width, so it doesn't touch that box, and — like the rest of
              `HeaderLink`'s own props — only ever renders in the desktop
              bucket: the mobile menu rebuilds each link from scratch
              (`MobileMenuLink`) reading only `href`/`active`/`items`/
              `children` off it, so this stays invisible on mobile too. */}
            <HeaderLink
              href="/research"
              active={isResearchActive}
              _before={{
                content: '""',
                position: "absolute",
                insetInlineStart: "-3",
                insetBlock: "1",
                width: "1px",
                bg: "currentColor",
                opacity: 0.6,
              }}
            >
              {m.www_navmenu_research()}
            </HeaderLink>
            <HeaderLink href="/contact" active={isContactActive}>
              {m.www_navmenu_contact()}
            </HeaderLink>
            <HeaderLink href="/volunteer" active={isVolunteerActive}>
              {m.www_navmenu_volunteer()}
            </HeaderLink>
            <HeaderLink href="/press" active={isPressActive}>
              {m.www_navmenu_press()}
            </HeaderLink>
            <HeaderSpacer />
            {/* Auto-sized to the button alone (see the constant's comment
              above) — no hardcoded dimensions, no measurement. */}
            <Box position="relative" display="inline-block" flexShrink={0}>
              <Button
                variant="onColor"
                color="colorPalette.true.800"
                size="sm"
                pointerEvents="none"
                onClick={() => donateAnchorRef.current?.click()}
              >
                {m.www_navmenu_donate()}
              </Button>
              {/* Absolutely positioned — excluded from the outer box's
                auto-sizing, and `inset="0"` fills exactly whatever size
                that ends up being (the button's). The mount point inside
                stays `position: static` (FundraiseUp forces that with
                `!important`), which is fine: "static" just means static
                relative to THIS box, and this box's own overflow clips its
                excess exactly like before. */}
              <Box position="absolute" inset="0" overflow="hidden">
                <a ref={donateAnchorRef} {...({ href: `#${FUNDRAISE_UP_BUTTON_ID}` } as any)} />
              </Box>
            </Box>
          </Header>
        </Box>

        {/* The page's semantic title — rendered once here, not inside
            `HeaderBrand` above: `Header` renders its children TWICE (once
            for the desktop row, once for the mobile closed bar), so
            anything placed inside `HeaderBrand` itself would exist twice in
            the DOM (both real nodes, one CSS-hidden per breakpoint, not
            actually removed) — two hidden `h1`s instead of one. */}
        <Box as={logoHeadingLevel} visuallyHidden>
          CodeDay
        </Box>

        <Main>{children}</Main>
        <Box mt={16}>
          <Footer repository="web" branch="master" domainName="www.codeday.org">
            {""}
          </Footer>
          <DisclaimerFooter disclaimerTexts={disclaimerTexts} />
        </Box>
      </Box>
    </Box>
  );
}

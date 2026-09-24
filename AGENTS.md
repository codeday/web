# AGENTS.md

This file provides guidance to coding agents when working with code in this repository.

## Repository

pnpm/turborepo monorepo for CodeDay's web applications and shared packages.

- `apps/www` — main CodeDay website (Next.js 16, Pages Router)
- `apps/topo-gallery` — Storybook gallery for `packages/topo` (one story per component), verified with Playwright against the built static Storybook
- `packages/topo` — shared design system: Chakra UI v3 components (`Atom`/`Molecule`/`Organism`), theming, region detection
- `packages/i18n` — shared internationalization (Paraglide JS messages + runtime)
- `packages/utils` — shared utilities (GraphQL fetch, debug, etc.)
- `packages/topocons` — icon library (icons are generated from the `packages/topocons/svg` git submodule, not hand-authored)
- `packages/tsconfig` — shared TypeScript configuration

## Commands

Run from repo root (turborepo fans out to workspaces):

```sh
pnpm install
pnpm run build        # turbo build (all apps/packages, respects dependency graph)
pnpm run dev          # turbo dev (persistent, runs codegen first)
pnpm run lint         # oxlint . (type-aware; see .oxlintrc.json)
pnpm run lint:fix      # oxlint --fix --fix-suggestions .
pnpm run format:fix    # oxfmt . (formatter, also sorts imports)
pnpm run codegen       # turbo codegen — regenerates GraphQL types from gql`...` tags in .ts/.tsx files
```

Per-app, run from the app directory (or via `turbo run <script> --filter=<pkg>`):

```sh
pnpm --filter @codeday/www test              # Playwright against a prod build; see apps/www/playwright.config.ts
pnpm --filter @codeday/topo-gallery test     # builds the static Storybook, then Playwright against it
pnpm --filter @codeday/topo-gallery dev      # Storybook dev server on :3100
```

**Linting/formatting**: this repo uses **oxlint** and **oxfmt**, not eslint/prettier. Always use the `lint`/`format` scripts above, not `eslint`/`prettier` directly. oxlint is type-aware (`typeAware`/`typeCheck` in `.oxlintrc.json`), so it needs a build (`^build`) to have run first — this is wired into `turbo.json`'s `//#lint` task dependency. oxfmt also sorts imports — see "Import order" below; don't hand-order them.

## Architecture

### GraphQL data fetching

- The API is a single GraphQL endpoint at `https://graph.codeday.org/` (see `packages/topo/src/utils.ts` — `apiFetch`, `useApi`).
- Queries/fragments are `gql` template-literal tags co-located in the `.tsx` file that uses them. Use the generated `graphql()` tag from `@/gql` (path-aliased to `apps/www/src/gql/`, see `apps/www/tsconfig.json`):

  ```tsx
  import { graphql } from "@/gql";
  import { FragmentType, useFragment } from "@/gql/fragment-masking";

  export const StatsFragment = graphql(`
    fragment IndexStatsComponent on Query {
      impact { studentCount }
    }
  `);

  function Stats({ data }: { data: FragmentType<typeof StatsFragment> }) {
    const { impact } = useFragment(StatsFragment, data);
    ...
  }
  ```

- `graphql-codegen`'s **client preset** (`apps/www/codegen.yml`) scans `src/**/*.{ts,tsx}` for `graphql(...)` tags against the live schema and emits typed helpers into `src/gql/` (`gql.ts`, `graphql.ts`, `fragment-masking.ts`, `index.ts` — gitignored, generated). Run `pnpm codegen` (or `pnpm dev`/`build`, which depend on it) after adding/changing a `graphql(...)` tag.
- **Fragment naming drives composition**: name a component-level fragment `<Page><Component>Component` (e.g. `IndexStatsComponent`, `IndexLogoWallComponent`, `PageComponent`). A page's root query then just spreads `...IndexStatsComponent` etc. — codegen resolves the fragment wherever it's declared in the project, so the page doesn't need to import the child fragment consts to compose them (see `apps/www/src/pages/index.tsx`). Use `useFragment`/`FragmentType` (fragment masking) so a component only has type access to the fields its own fragment selected, not the whole page query.
- Use `ResultOf<typeof SomeQuery>` (from `@graphql-typed-document-node/core`) to type a query's result shape, e.g. for a page's `props.query`.
- **Not all data comes from a traditional API/database.** A large portion of the schema is content pulled live from CodeDay's Contentful CMS, exposed through the `cms { ... }` namespace on `Query` (see e.g. the `PageComponent` fragment in `apps/www/src/components/Page/index.tsx`). Fields under `cms` (e.g. `strings`, `asset`, `programs`, `events`, `testimonials`, `newsCoverages`, `pressPhotos`, `globalSponsors`, `faqs`, `forms`, `regions`, `tickets`, `projects`, `mentors`, `publications`) are Contentful content types/entries, typically queried with a `where` filter and returning `{ items { ... } }`. Copy strings in particular are modeled as CMS entries keyed by a dotted `key` (e.g. `strings(where: { key: "common.mission" })`) rather than hardcoded in `packages/i18n` — when hunting for where a piece of site copy or an image/asset comes from, check the relevant component's `graphql(...)` fragment for a `cms` block before assuming it's a local constant.

### Internationalization — two independent layers

1. **Locale** (UI language) — `packages/i18n`, powered by Paraglide JS. Message files: `packages/i18n/messages/{locale}.json`, keys prefixed by package (`topo_*`, `www_*`). Use via `import * as m from "@codeday/i18n/messages"` → `m.some_key({ args })`.
   - Every URL includes a locale prefix (`/en/about`). Next.js's Pages Router requires a `defaultLocale`, so this repo uses `"_default"` as a sentinel non-locale — bare paths resolve to `_default`, which `apps/www/src/proxy.ts` (this Next version's replacement for `middleware.ts`) detects and redirects to a real locale based on the `NEXT_LOCALE` cookie or `Accept-Language`.
   - Get locale: `getLocale()` (client, `@codeday/i18n/runtime`) or `getLocaleFromContext(ctx)` (server, `@codeday/i18n/next-pages`). For `m.*()` calls inside `getStaticProps`/`getServerSideProps`, wrap the function with `withLocaleStaticProps`/`withLocaleServerSideProps`.
   - Adding a language: add the locale code to `packages/i18n/project.inlang/settings.json`, add `packages/i18n/messages/{locale}.json`, then add the locale to each app's `next.config.ts` (`i18n.locales`) and `AVAILABLE_LOCALES` in its proxy/middleware.
   - This is a separate mechanism from Contentful content localization: some `cms { ... }` fields (see "GraphQL data fetching" above) take their own `locale` argument resolved server-side by Contentful (e.g. `cms.localizationConfigs(where: { id: $region }, locale: $locale)` in `apps/www/src/pages/contact.tsx`, `cms.legal.terms(locale: "en-US")` in `apps/www/src/pages/legal/[policy].tsx`). When a page needs localized CMS content, thread the Paraglide locale through as a GraphQL variable rather than assuming `m.*()` covers it — most `cms` queries in this repo don't pass `locale` at all and just return the default (English) entry.

2. **Region** (domain-specific data — phone numbers, emails, legal) — resolved from the **TLD of the visitor's hostname**, independent of locale (e.g. `codeday.fr` → region `eu`, UI can still be English). Provided by `@codeday/topo/Region`.
   - `@codeday/topo/Region/config` is dependency-free (no React) so it can run in the Edge runtime (proxy/middleware); `@codeday/topo/Region` adds `RegionProvider`/`useRegion()`/`getRegionFromContext()` for React/server use.
   - New TLD → add an entry to `TLD_REGION_MAP` in `packages/topo/src/Region/config.ts`; nothing else needs to change. Full-domain overrides can be passed at call sites via an `overrides` map (checked before TLD-map lookup).

### Design system (`packages/topo`)

Chakra UI v3 based, organized by atomic-design tier: `Atom` (context-free primitives — Box, Button, Text, Input, ...), `Molecule` (small reusable combinations of a couple of Atoms — Band, Wash, Section, ActionLink, MarqueeRow, Markdown, VideoPlayer, CognitoForm, ContentfulRichText, ...), `Organism` (complete, distinct page sections, typically used once per page — Header, Footer, Announcement, MailingListSubscribe, HistoryRail, ImpactTicker, CreditLists, FormatCards, StatementBlock, RowList, PullQuote, PortraitWall, StatTrio). Theme/data context lives in `packages/topo/src/Theme` and `utils.ts` (`ThemeDataProvider`, `useThemeData`/`useTheme`, `usePageData`).

Everything used to get dumped straight into `Atom` regardless of shape — by mid-2026 it held full page sections (a 623-line nav header, an animated stats ticker, a credits/press-logos block, etc.) alongside genuine primitives, which these got audited and moved out of. When adding a new component, don't default to `Atom`: a single-purpose primitive with no composition of sibling components belongs in `Atom`; a small reusable combination of a couple of Atoms (a layout wrapper, an icon+link combo) belongs in `Molecule`; a complete, content-specific section that would only ever appear once per page belongs in `Organism`. If a component's file has its own local sub-components and is only ever imported by one page, it's Organism-shaped even if it happens to live under 200 lines.

**Adding/changing an Atom component** touches up to three places:

- `packages/topo/src/Atom/<Name>/index.tsx` — the component itself.
- `packages/topo/src/Theme/vars/recipes/<name>.ts` — its optional Chakra recipe (variants/sizes/slots), registered in `recipes/index.ts`.
- `apps/topo-gallery/src/stories/<Name>.stories.tsx` — a Storybook story exercising its variants/sizes/states; this is what the gallery's Playwright test renders and screenshots. `apps/topo-gallery/.storybook/preview.tsx` wires up only the Chakra provider, color-mode, legacy `ThemeDataProvider`, and brand fonts — deliberately not the full app `ThemeProvider` (no Cognito Forms script tag, no cookie-consent banner) — a story that needs `usePageData()`/`ThemeDataProvider` context should supply its own decorator, not assume every app-level provider is present.
- For localized copy required by a component's props, type it as `Message` (from `@codeday/topo/utils`, aliased from Paraglide's `LocalizedString`) rather than `string` — this makes passing a raw string literal a type error, enforcing "no copy outside the message catalogue" at compile time.

**All sizes and colors must come from theme tokens, not hardcoded literals.** Never write a raw `"16px"`, `"1.5rem"`, `"50%"`, etc. into a style prop or `css={{...}}` block — use the matching Chakra token instead (`mb={4}` or `mb="4"` for the space scale, `borderRadius="md"` for radii, `fontSize="lg"` for font sizes, `"1/2"`/`"full"` for proportional widths, and so on). Bare numeric Chakra props like `mb={4}` already index the space token scale and are correct as-is — the rule targets string literal CSS lengths that bypass tokens entirely. Inside a `css={{...}}` block or a CSS string (`clamp(...)`, `linear-gradient(...)`, `boxShadow`), reference a token with `{category.token}` interpolation, e.g. `fontSize="clamp({fontSizes.4xl}, 5.4vw, {fontSizes.6xl})"` (see `packages/topo/src/Theme/vars/recipes/button.ts` for existing examples of this syntax). This repo's actual token scale is Chakra v3's defaults (space/sizes/radii/fontSizes/borders/letterSpacings/lineHeights/durations/blurs/aspectRatios/zIndex — see `node_modules/@chakra-ui/react/dist/*/theme/tokens/*` for ground truth, don't rely on memory) plus this repo's own `sizes.container.{sm,md,lg,xl}` (640/768/1024/1280px, `packages/topo/src/Theme/vars/index.ts`) and colors/fonts/gradients. If a design genuinely needs a size with no close existing token (e.g. a large decorative border-radius well past `4xl`=32px) add a new token to the theme (or a semantic one, following the pattern in `Theme/vars/index.ts`) only with permission from the user. Generated code is exempt: don't hand-edit `packages/topocons/src/Icon/*` (SVG icon sizing like `width="1em"` is the standard icon-scaling technique, not a hardcoded size) or the token-definition files themselves (`Theme/vars/colors.ts`, `darkColors.ts`, `gradients.ts`, `fonts.ts`, `cornerShape.ts`, `grain.tsx`, `utils.ts`'s `defaultSpace`/`defaultRadii`/`defaultFontSizes` tables).

**Avoid transparent colors.** They do not work well with dark vs light mode.

**Never reference a colour token via a raw `var(--chakra-colors-*)` CSS custom property** (e.g. embedded in a `linear-gradient(...)` string inside a `css={{...}}` block). `@chakra-ui/react` ships its own flat, non-mode-aware stock colour scale under the exact same `--chakra-colors-<hue>-<stop>` custom property name for every hue this repo also defines (gray/red/orange/yellow/green/teal/blue/purple/pink/cyan) — that stock value wins over this repo's semantic override at that property, in both light and dark mode (verified empirically: computed-style checks on `gray-700`, `gray-50`, `red-600`, `yellow-200`, and `yellow-500` all returned Chakra's stock hex, never this repo's, regardless of `.dark`). This directly caused a shipped bug (`Atom/Highlight`'s dark-mode band silently using Chakra's stock yellow instead of this repo's own). Use a Chakra token prop/recipe value instead (`bg: "gray.50"`, which goes through Chakra's own build-time token resolution and correctly prefers this repo's override), or `useColorModeValue` reading `colors.ts`/`darkColors.ts` directly when a raw hex is unavoidable (composing a `linear-gradient(...)` string, for instance — see `Atom/Highlight`, `Organism/CreditLists`). Enforced by the `codeday-colors/no-raw-chakra-color-var` oxlint rule (`.oxlint/`).

**Testing dark mode**: this app has no manual light/dark toggle — `Theme/Provider.tsx` configures `next-themes` with `storage="none"`, `defaultTheme="system"`, `followSystem`; colour mode is derived entirely from the OS `prefers-color-scheme` media query. Toggling the `.dark` class on `<html>` by hand (or setting `localStorage`) updates CSS-based styling but does **not** update React state, so anything driven by `useColorMode`/`useColorModeValue` won't respond to it — a real test (Playwright or otherwise) needs to emulate the media query itself (e.g. Playwright's `colorScheme: "dark"` context/page option), not fake the class.

When editing Topo, refer to the Chakra documentation:

- [Complete documentation](https://chakra-ui.com/llms-full.txt): The complete Chakra UI v3 documentation including all components, styling and theming
- [Components](https://chakra-ui.com/llms-components.txt): Documentation for all components in Chakra UI v3.
- [Charts](https://chakra-ui.com/llms-charts.txt): Documentation for the charts in Chakra UI v3.
- [Styling](https://chakra-ui.com/llms-styling.txt): Documentation for the styling system in Chakra UI v3.
- [Theming](https://chakra-ui.com/llms-theming.txt): Documentation for theming Chakra UI v3.

### Component composition — one purpose per component

A component should either (a) be genuinely reusable — used in 2+ places, or built for a design-system tier (`Atom`/`Molecule`/`Organism`) where reuse is the point — or (b) contain real logic (data transforms, GraphQL fragments with fields it actually uses, state/effects, conditional structure). If a component is neither, don't create it — write the markup directly at the call site instead.

**Don't wrap a single child call in its own component just to give it a name.** A component whose entire body is one call to another component, fed only static values or `m.*()` message-catalog strings, and which is only ever imported in one place, adds a file and an indirection without adding reuse or logic. Inline it at the call site instead. Before extracting a new one-off "section" component in `apps/www/src/components/**` (e.g. for a page section), ask whether it's more than a single-use pass-through — if not, write the JSX directly in the page.

**A section component renders the thing, not the section.** The page owns the section lead — the `StatementBlock`, or `Heading as="h1"/"h2"` plus its intro `Text` — and renders it directly in the page file (`apps/www/src/pages/**`), then renders the component beside it. The component renders only what sits below the lead: the grid, the cards, the rows, the ticker. This holds whether the heading would arrive as a prop _or_ be hardcoded from `m.*()` inside the component — both are the same bundling. Heading level is the test: `h1`/`h2` title a page or a section and belong in the page; `h3` and below title an item inside the thing and belong in the component. Nothing under `apps/www/src/components/**` renders `<StatementBlock>`, `<Heading as="h1"|"h2">`, or `<Box as="h1"|"h2">` — the `codeday/no-section-lead-in-component` oxlint rule (`.oxlint/`) enforces this and runs on every edit; `components/Page/**` is the sole exception (the document's own hidden `h1`). The section's outer wrapper (`<Section>`, `<Box as="section">`) is page layout too, so the page renders it.

**Corollary: don't bundle unrelated concerns into one component's props or body.** A component describes one thing — not "the thing, plus a heading above it, plus a call-to-action below it" assembled for a single caller. If a caller needs a footer, aside, or CTA next to the thing, the caller composes it in the page (reusing `ActionLink`, `StatementBlock`, `Button`, etc.) rather than the component growing a `lead`/`aggregate`/`variant`-style knob to render or suppress it. `lead: { heading, body }` (formerly on `ImpactTicker`/`RowList`/`FormatCards`) and the `variant="mixed"` aggregate footer (formerly inside `Index/Impact`) were both this anti-pattern and have been removed; don't reintroduce either shape. The reverse still applies: a prop pattern deliberately shared across sibling `Atom`s for visual consistency is intentional, tested reuse — don't split it into ad hoc per-caller markup.

**If removing the lead leaves a component with no logic, inline it.** Once a section component stops rendering its heading, ask again whether what's left earns a file: static markup fed only by `m.*()` strings and used once belongs directly in the page (see "Don't wrap a single child call"). A component earns its file by having real logic (data transforms, GraphQL fragments, state/effects, a loop or conditional over data) or genuine reuse. When auditing: `grep -r` the component name for usage count, and read for logic beyond forwarding props.

### `apps/www` page structure

Pages router under `src/pages`. Notable dynamic routes:

- `e/[calendarId]/[eventId]` — event pages
- `f/[slug]` — generic form pages (Cognito forms)
- `help/[program]/[audience]`, `help/article/[article]` — help center
- `legal/[policy]`, `email/[slug]`, `m/[...slug]`, `doi/[...doi]` (and `doi/crossref/[...doi]`) — DOI resolution
- `volunteer/[region]`, `volunteer/labs`, `volunteer/share`

`src/proxy.ts` runs on every request except `/_next`, API routes, and files with an extension — it only handles locale-prefix redirection.

### Icons (`packages/topocons`)

Icon source SVGs live in the `packages/topocons/svg` git submodule (`git@github.com:codeday/TopoconsSvg.git`), not in this repo directly — run `git submodule update --init` if icons are missing. Icons are generated (svgo optimize → `create-chakra-icons` → post-processing replacements) via the package's `pregenerate-icons`/`generate-icons`/`postgenerate-icons` scripts; don't hand-edit generated files under `src/Icon`.

## Code style

- **Import order** is enforced by `oxfmt` (run `pnpm format:fix` rather than hand-ordering) — three blank-line-separated groups: external packages (alphabetized by package name), then `@/`-aliased imports, then relative (`./`, `../`) imports.
- **Use comments very rarely.** Comments should only be used where information cannot be easily inferred from the code.
- Avoid `any`/untyped props on new code — the pre-migration components still using `[key: string]: any`-style props are legacy, not the pattern to copy.

## Testing

- `apps/www`: `pnpm --filter @codeday/www test` runs Playwright (`apps/www/tests/*.spec.ts`) against a **production** build — the config does not start the server for you (a full CMS-backed SSG build takes minutes); build and start it yourself first (`pnpm --filter @codeday/www build && pnpm --filter @codeday/www start -- -p 4400`, matching `apps/www/playwright.config.ts`'s `baseURL`).
- `apps/topo-gallery`: `pnpm --filter @codeday/topo-gallery test` builds the static Storybook (`storybook build -o dist`) and runs Playwright (`apps/topo-gallery/tests/*.spec.ts`) against it — this is the mechanism that catches visual/rendering regressions in `packages/topo` components.
- `packages/topo`: `pnpm --filter @codeday/topo test` runs Vitest (`src/Theme/vars/*.test.ts` — color/grain/gradient math). Not wired into the root `pnpm run` scripts or `turbo.json`, so run it directly with `--filter` rather than expecting `pnpm test` at the repo root to reach it.

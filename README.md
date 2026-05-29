# codeday/web

Monorepo for CodeDay's web applications and shared packages.

## Structure

| Path | Description |
|---|---|
| `apps/www` | Main CodeDay website (Next.js Pages Router) |
| `packages/topo` | Shared design system (Chakra UI components, theme, region detection) |
| `packages/i18n` | Shared internationalization (Paraglide JS messages + runtime) |
| `packages/utils` | Shared utilities (GraphQL fetch, debug, etc.) |
| `packages/topocons` | Icon library |
| `packages/tsconfig` | Shared TypeScript configuration |

## Getting started

```sh
pnpm install
pnpm run build
```

## Internationalization (i18n)

The monorepo has two independent localization layers. Both are provided by
shared packages so any app in the monorepo can use them.

| Layer | Purpose | Provided by | Example values |
|---|---|---|---|
| **Locale** (language) | UI string translations | `packages/i18n` | `en`, `es` |
| **Region** | Domain-specific data (phone numbers, emails, legal) | `packages/topo` (Region) | `us`, `eu`, `uk`, `ca`, `in` |

---

### Locale / Translations

Translations are powered by [Paraglide JS](https://inlang.com/m/gerre34r/library-inlang-paraglideJs).
Message files live in `packages/i18n/messages/{locale}.json`. Keys are prefixed
by package — `topo_*` for design-system strings, `www_*` for app strings.

**URL structure:** Every page URL includes a locale prefix — `/en/about`,
`/es/about`. If a user visits a bare path like `/about`, middleware detects
the browser's preferred language and redirects.

#### Using translations in components

```tsx
import * as m from "@codeday/i18n/messages";

function Footer() {
  return <p>{m.topo_footer_copyright({ currentYear: "2026" })}</p>;
}
```

#### Getting the locale

**Client-side (React components):**

```tsx
import { getLocale } from "@codeday/i18n/runtime";

const locale = getLocale(); // "en" | "es"
```

**Server-side (`getStaticProps` / `getServerSideProps`):**

```tsx
import { getLocaleFromContext } from "@codeday/i18n/next-pages";

export const getStaticProps: GetStaticProps = async (ctx) => {
  const locale = getLocaleFromContext(ctx);
  // ...
};
```

To use `m.*()` inside data-fetching functions, wrap with the locale helper:

```tsx
import { withLocaleStaticProps } from "@codeday/i18n/next-pages";
import * as m from "@codeday/i18n/messages";

export const getStaticProps = withLocaleStaticProps(async (ctx) => {
  return { props: { title: m.page_title() } };
});
```

#### Adding a new language

1. Add the locale code to `packages/i18n/project.inlang/settings.json` → `locales`
2. Create `packages/i18n/messages/{locale}.json` with translated values
3. In each app: add the locale to `next.config.ts` → `i18n.locales` and
   `AVAILABLE_LOCALES` in `middleware.ts`

#### i18n package exports

| Import path | Contents |
|---|---|
| `@codeday/i18n/messages` | Type-safe message functions (`m.key()`) |
| `@codeday/i18n/runtime` | `getLocale()`, `setLocale()`, `overwriteGetLocale()`, `baseLocale`, `locales`, `Locale` type |
| `@codeday/i18n/next-pages` | `getLocaleFromContext()`, `withLocaleStaticProps()`, `withLocaleServerSideProps()` |

---

### Region

Region codes are resolved from the domain name the visitor is using. This is
independent of UI language — a user on `codeday.fr` gets region `eu` but can
view the site in English.

The generic detection logic lives in `@codeday/topo/Region`. Each app provides
its own domain → region map.

#### Setting up region detection in an app

1. Create an app-level config file with your domain map (Edge-safe, no React):

```ts
// src/region/config.ts
import type { DomainRegionMap } from "@codeday/topo/Region/config";
export { DEFAULT_REGION, REGION_HEADER, getRegionFromHostname } from "@codeday/topo/Region/config";

export const DOMAIN_REGION_MAP: DomainRegionMap = {
  "codeday.org": "us",
  "codeday.co.uk": "uk",
  // ...
};
```

2. Create an app-level index that wires the map into topo helpers:

```ts
// src/region/index.ts
export { RegionProvider, useRegion } from "@codeday/topo/Region";
export { DOMAIN_REGION_MAP } from "./config";
// ... thin wrappers that bake in your DOMAIN_REGION_MAP
```

3. In middleware, resolve and forward the region as a header:

```ts
import { getRegionFromHostname, REGION_HEADER, DOMAIN_REGION_MAP } from "./region/config";

// inside middleware():
const region = getRegionFromHostname(request.headers.get("host"), DOMAIN_REGION_MAP);
const headers = new Headers(request.headers);
headers.set(REGION_HEADER, region);
return NextResponse.next({ request: { headers } });
```

4. In `_app.tsx`, wrap with `<RegionProvider>`.

> `getRegionFromContext` only works with `getServerSideProps` (it reads
> request headers). In `getStaticProps` there is no request — pass region
> as a prop from a page that uses `getServerSideProps`, or use
> `getRegionFromHostname()` with a known hostname.

#### Adding a new domain

Add an entry to `DOMAIN_REGION_MAP` in your app's `src/region/config.ts`.
No other files need to change.

#### Region package exports

| Import path | Contents |
|---|---|
| `@codeday/topo/Region/config` | `getRegionFromHostname()`, `DEFAULT_REGION`, `REGION_HEADER`, `DomainRegionMap` type — Edge-safe, no React |
| `@codeday/topo/Region` | Everything from config + `RegionProvider`, `useRegion()`, `getRegionFromContext()` |

---

## Architecture notes

- **`_default` locale sentinel** — Next.js Pages Router requires a
  `defaultLocale`. We use `_default` so that bare paths are detectable by
  middleware (otherwise they'd be silently served as English). Middleware
  redirects `_default` to the browser's preferred language.
- **`region/config.ts` vs `region/index.ts`** — Middleware runs in the Edge
  runtime, which cannot import React or Node.js built-ins. The config module
  is kept dependency-free so both middleware and the app can use it.
- **Topo is generic** — `@codeday/topo/Region` provides the detection engine
  and React plumbing; each app supplies its own `DOMAIN_REGION_MAP`.

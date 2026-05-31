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

Region codes are resolved from the **top-level domain** the visitor is using.
This is independent of UI language — a user on `codeday.fr` gets region `eu`
but can still view the site in English.

`@codeday/topo/Region` ships a built-in `TLD_REGION_MAP`:

| TLD | Region | | TLD | Region |
|---|---|---|---|---|
| `.org` | `us` | | `.ee` | `eu` |
| `.us` | `us` | | `.se` | `eu` |
| `.ca` | `ca` | | `.it` | `eu` |
| `.co.uk` | `uk` | | `.fr` | `eu` |
| `.in` | `in` | | `.es` | `eu` |
| | | | `.ch` | `eu` |
| | | | `.be` | `eu` |

Apps can pass an optional `overrides` map to add new TLDs or override
specific full domain names.

#### Setting up region detection in an app

1. In middleware, resolve and forward the region as a header:

```ts
import { getRegionFromHostname, REGION_HEADER } from "@codeday/topo/Region/config";

// inside middleware():
const region = getRegionFromHostname(request.headers.get("host"));
const headers = new Headers(request.headers);
headers.set(REGION_HEADER, region);
return NextResponse.next({ request: { headers } });
```

2. In `_app.tsx`, wrap with `<RegionProvider>`:

```tsx
import { RegionProvider, getRegionFromHostname } from "@codeday/topo/Region";

const region = useMemo(
  () => getRegionFromHostname(typeof window !== "undefined" ? window.location.hostname : undefined),
  [],
);

return <RegionProvider value={region}>...</RegionProvider>;
```

#### Overriding regions for specific domains

Pass an `overrides` map to `getRegionFromHostname`. Full-domain keys take
priority, then override TLD keys, then the built-in `TLD_REGION_MAP`.

```ts
const overrides = { "staging.codeday.org": "eu", "dev": "us" };
const region = getRegionFromHostname("staging.codeday.org", overrides); // "eu"
```

#### Getting the region

**Client-side (React components):**

```tsx
import { useRegion } from "@codeday/topo/Region";
const region = useRegion(); // "us" | "eu" | "uk" | ...
```

**Server-side (`getServerSideProps`):**

```tsx
import { getRegionFromContext } from "@codeday/topo/Region";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const region = getRegionFromContext(ctx);
  return { props: { region } };
};
```

> `getRegionFromContext` only works with `getServerSideProps` (it reads
> request headers). In `getStaticProps` there is no request — use
> `getRegionFromHostname()` with a known hostname, or resolve the region
> client-side.

#### Adding a new TLD

Add an entry to `TLD_REGION_MAP` in `packages/topo/src/Region/config.ts`.
No other files need to change.

#### Region package exports

| Import path | Contents |
|---|---|
| `@codeday/topo/Region/config` | `getRegionFromHostname()`, `TLD_REGION_MAP`, `DEFAULT_REGION`, `REGION_HEADER`, `RegionMap` type — Edge-safe, no React |
| `@codeday/topo/Region` | Everything from config + `RegionProvider`, `useRegion()`, `getRegionFromContext()` |

---

## Architecture notes

- **`_default` locale sentinel** — Next.js Pages Router requires a
  `defaultLocale`. We use `_default` so that bare paths are detectable by
  middleware (otherwise they'd be silently served as English). Middleware
  redirects `_default` to the browser's preferred language.
- **`@codeday/topo/Region/config` vs `@codeday/topo/Region`** — Middleware
  runs in the Edge runtime, which cannot import React or Node.js built-ins.
  The `/config` module is kept dependency-free so both middleware and the
  full app can use it.

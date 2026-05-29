# apps/www

CodeDay's main website, built with Next.js (Pages Router) and Chakra UI.

## Internationalization (i18n)

The app has two independent localization layers:

| Layer | Purpose | Example |
|---|---|---|
| **Locale** (language) | UI string translations | `en`, `es` |
| **Region** | Domain-specific data (phone numbers, emails, legal entities) | `us`, `eu`, `uk`, `ca`, `in` |

### Locale / Translations

Translations are powered by [Paraglide JS](https://inlang.com/m/gerre34r/library-inlang-paraglideJs).
Message files live in `packages/i18n/messages/{locale}.json`. Keys are prefixed
by package (`topo_*` for design-system strings, `www_*` for app strings).

**URL structure:** Every page URL includes a locale prefix — `/en/about`,
`/es/about`, etc. If a user visits a bare path like `/about`, middleware
detects the browser's preferred language (from `Accept-Language`) and
redirects to the appropriate prefix.

#### Using translations in components

```tsx
import * as m from "@codeday/i18n/messages";

function Footer() {
  return <p>{m.topo_footer_copyright({ currentYear: "2026" })}</p>;
}
```

`m.*()` functions are type-safe — TypeScript will enforce required parameters.

#### Getting the locale

**Client-side (React components):**

```tsx
import { useRouter } from "next/router";

const router = useRouter();
const locale = router.locale; // "en" | "es"
```

Or via Paraglide directly:

```tsx
import { getLocale } from "@codeday/i18n/runtime";
const locale = getLocale(); // "en" | "es"
```

**Server-side (`getStaticProps` / `getServerSideProps`):**

```tsx
import { getLocaleFromContext } from "@codeday/i18n/next-pages";

export const getStaticProps: GetStaticProps = async (ctx) => {
  const locale = getLocaleFromContext(ctx); // "en" | "es"
  // ...
};
```

If you need `m.*()` message functions to return the correct language inside
`getStaticProps` or `getServerSideProps`, wrap them:

```tsx
import { withLocaleStaticProps } from "@codeday/i18n/next-pages";

export const getStaticProps = withLocaleStaticProps(async (ctx) => {
  return { props: { title: m.page_title() } }; // respects ctx.locale
});
```

#### Adding a new language

1. Add the locale code to `packages/i18n/project.inlang/settings.json` → `locales`
2. Create `packages/i18n/messages/{locale}.json` with translated values
3. Add the locale code to `apps/www/next.config.ts` → `i18n.locales`
4. Add the locale code to `AVAILABLE_LOCALES` in `apps/www/src/middleware.ts`

### Region

Region codes are resolved from the domain name the user is visiting. This is
completely independent of the UI language — a user on `codeday.fr` gets region
`eu` but can still view the site in English.

The domain → region mapping is defined in `apps/www/src/region/config.ts`:

```ts
export const DOMAIN_REGION_MAP: Record<string, string> = {
  "codeday.org": "us",
  "codeday.co.uk": "uk",
  "codeday.ee": "eu",
  // ...
};
```

#### Getting the region

**Client-side (React components):**

```tsx
import { useRegion } from "../region";

function ContactInfo() {
  const region = useRegion(); // "us" | "eu" | "uk" | "ca" | "in"
  // ...
}
```

**Server-side (`getServerSideProps`):**

```tsx
import { getRegionFromContext } from "../region";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const region = getRegionFromContext(ctx);
  return { props: { region } };
};
```

> **Note:** `getRegionFromContext` only works with `getServerSideProps` because
> it reads request headers. In `getStaticProps` there is no request — use
> `getRegionFromHostname()` with a known hostname, or pass the region as a
> query parameter / prop from a page that uses `getServerSideProps`.

#### Adding a new domain

Add an entry to `DOMAIN_REGION_MAP` in `apps/www/src/region/config.ts`.
No other files need to change.

## Architecture notes

- **Middleware** (`src/middleware.ts`) handles two concerns:
  1. Locale redirect — bare paths → prefixed paths based on browser language
  2. Region header — sets `x-codeday-region` for downstream server-side code
- **`_default` locale** — Next.js requires a `defaultLocale`. We use a
  `_default` sentinel so that bare paths are detectable by middleware
  (rather than being silently served as English).
- **`region/config.ts`** is kept separate from `region/index.ts` because
  middleware runs in the Edge runtime, which cannot import React or Node.js
  built-ins.

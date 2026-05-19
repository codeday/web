import { apiFetch } from "@codeday/topo/utils";
import { GraphQLClient } from "graphql-request";
import useSwr from "swr";

const STRINGS = [
  "legal.cookies",
  "legal.ccpa",
  "legal.data.pii",
  "legal.data.payment",
  "eco.link",
  "common.more-info",
  "resources",
  "custom-links",
  "copyright",
  "nonprofit",
  "maintained-by",
  "made-with-love",
];

const query = `query PageQuery ($locale: String!, $stringKeys: [String!]!, $localizationConfig: String!) {
  cms {
    strings (locale: $locale, where: { key_in: $stringKeys } ) {
      items {
        key
        value
      }
    }

    sites(where: { type: "Public", display_contains_all: "Footer" }, locale: $locale) {
      items {
        sys {
          id
        }
        title
        link
      }
    }

    localizationConfig(id: $localizationConfig, locale: $locale) {
      contactDefaultType
      contactDefaultValue
    }
  }
}`;

interface UseCmsStringsOptions {
  locale?: string;
  localizationConfig?: string;
  apiEndpoint?: string;
}

export function useCmsStrings({ locale, localizationConfig, apiEndpoint }: UseCmsStringsOptions) {
  const fetcher = apiEndpoint
    ? (q: any, v: any) => {
        const client = new GraphQLClient(apiEndpoint, {});
        return client.request(q, v);
      }
    : apiFetch;

  const { data } = useSwr(
    [
      query,
      {
        locale: locale ?? "en-US",
        stringKeys: STRINGS,
        localizationConfig: localizationConfig ?? "2guv6EfbM9qu5y5ER52pVN",
      },
    ],
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  let strings: Record<string, string> = {};
  if (data?.cms?.strings?.items) {
    strings = data.cms.strings.items.reduce(
      (accum: any, node: any) => ({ ...accum, [node.key]: node.value }),
      {},
    );
  }

  return { data, strings };
}

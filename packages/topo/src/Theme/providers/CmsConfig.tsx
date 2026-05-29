import { apiFetch } from "@codeday/topo/utils";
import { GraphQLClient } from "graphql-request";
import useSwr from "swr";

const query = `query CmsConfigQuery ($locale: String!, $localizationConfig: String!) {
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

    localizationConfig(id: $localizationConfig, locale: $locale) {
      contactDefaultType
      contactDefaultValue
    }
  }
}`;

interface UseCmsConfigOptions {
  locale?: string;
  localizationConfig?: string;
  apiEndpoint?: string;
}

export function useCmsConfig({ locale, localizationConfig, apiEndpoint }: UseCmsConfigOptions) {
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
        localizationConfig: localizationConfig ?? "2guv6EfbM9qu5y5ER52pVN",
      },
    ],
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  return { data };
}

import { apiFetch } from "@codeday/topo/utils";
import * as m from "@codeday/i18n/messages";
import { GraphQLClient } from "graphql-request";
import useSwr from "swr";

const query = `query PageQuery ($locale: String!, $localizationConfig: String!) {
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
        localizationConfig: localizationConfig ?? "2guv6EfbM9qu5y5ER52pVN",
      },
    ],
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  const strings: Record<string, string> = {
    "legal.ccpa": m.topo_footer_ccpa(),
    "legal.data.pii": m.topo_datacollection_pii_notice(),
    "legal.data.payment": m.topo_datacollection_payment_notice(),
    "common.more-info": m.topo_datacollection_more_info(),
    "resources": m.topo_footer_resources(),
    "custom-links": m.topo_footer_custom_links(),
    "copyright": m.topo_footer_copyright({ currentYear: String(new Date().getFullYear()) }),
    "nonprofit": m.topo_footer_nonprofit(),
    "maintained-by": m.topo_footer_maintained_by(),
  };

  return { data, strings };
}

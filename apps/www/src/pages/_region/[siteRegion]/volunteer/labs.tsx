import { apiFetch } from "@codeday/topo/utils";
import { DateTime } from "luxon";

import { VolunteerQuery } from "@/pages/_region/[siteRegion]/volunteer/index";
import { cmsLocale } from "@/utils/cmsLocale";
import { withRegionStaticProps } from "@/utils/region";
import { getRegionStaticPaths, prebuildCommonLocales } from "@/utils/regionStaticPaths";

export { default } from "@/pages/_region/[siteRegion]/volunteer/index";

export const getStaticProps = withRegionStaticProps(async ({ locale }) => {
  const query = await apiFetch(
    VolunteerQuery,
    { locale: cmsLocale(locale), now: DateTime.now().minus({ months: 6 }) },
    {},
  );
  return {
    props: {
      query,
      seed: Math.random(),
      startBackground: "industry",
      startPage: 2,
      layout: "go",
    },
    revalidate: 300,
  };
});

export const getStaticPaths = getRegionStaticPaths(prebuildCommonLocales);

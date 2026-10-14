import { apiFetch } from "@codeday/topo/utils";
import { DateTime } from "luxon";

import { VolunteerQuery } from "@/pages/_region/[siteRegion]/volunteer/index";
import { cmsLocale } from "@/utils/cmsLocale";
import { withRegionStaticPaths, withRegionStaticProps } from "@/utils/region";

export { default } from "@/pages/_region/[siteRegion]/volunteer/index";

export const getStaticPaths = withRegionStaticPaths(async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
});

export const getStaticProps = withRegionStaticProps(async ({ params, locale }) => {
  const region = params?.region as string;
  const query = await apiFetch(
    VolunteerQuery,
    { locale: cmsLocale(locale), now: DateTime.now().minus({ months: 6 }) },
    {},
  );

  return {
    props: {
      query,
      seed: Math.random(),
      startBackground: "student",
      startRegion: region,
      startPage: 2,
    },
    revalidate: 300,
  };
});

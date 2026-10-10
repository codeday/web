import { apiFetch } from "@codeday/topo/utils";
import { DateTime } from "luxon";
import { GetStaticProps, GetStaticPaths } from "next";

import { VolunteerQuery } from "@/pages/volunteer/index";
import { cmsLocale } from "@/utils/cmsLocale";

export { default } from "@/pages/volunteer/index";

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
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
};

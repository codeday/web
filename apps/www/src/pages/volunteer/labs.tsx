import { apiFetch } from "@codeday/topo/utils";
import { DateTime } from "luxon";
import { GetStaticProps } from "next";

import { VolunteerQuery } from "@/pages/volunteer/index";
import { cmsLocale } from "@/utils/cmsLocale";

export { default } from "@/pages/volunteer/index";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
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
};

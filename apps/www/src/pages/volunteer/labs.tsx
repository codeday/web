import { apiFetch } from "@codeday/topo/utils";
import { DateTime } from "luxon";
import { GetStaticProps } from "next";

import { VolunteerQuery } from "./index";

export { default } from "./index";

export const getStaticProps: GetStaticProps = async () => {
  const query = await apiFetch(VolunteerQuery, { now: DateTime.now().minus({ months: 6 }) }, {});
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

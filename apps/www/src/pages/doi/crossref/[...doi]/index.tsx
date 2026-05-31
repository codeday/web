import { Button, Textarea, Skelly, Spinner } from "@codeday/topo/Atom";
import { Content } from "@codeday/topo/Molecule";
import { apiFetch } from "@codeday/topo/utils";
import { print } from "graphql";
import { sign } from "jsonwebtoken";
import { DateTime } from "luxon";
import { GetStaticProps, GetStaticPaths } from "next";
import { useRouter } from "next/router";
import { useMemo } from "react";
import xmlbuilder from "xmlbuilder";

import Page from "../../../../components/Page";
import { usePageData } from "@codeday/topo/Theme";
import { PublicationQuery, ListPublicationsQuery } from "../../[...doi]/index.gql";

function licenseToLink(license: string): string | undefined {
  if (license.startsWith("CC")) {
    return `https://creativecommons.org/licenses/${license.slice(3).replace(" ", "/").toLowerCase()}`;
  }
}

function getHeadXml(id: string) {
  const head = xmlbuilder.create("head");
  head.ele("doi_batch_id", id);
  head.ele("timestamp", DateTime.now().toFormat("yyyyMMddHHmmss"));

  const depositor = head.ele("depositor");
  depositor.ele("depositor_name", process.env.NEXT_PUBLIC_DOI_DEPOSITOR_NAME);
  depositor.ele("email_address", process.env.NEXT_PUBLIC_DOI_DEPOSITOR_EMAIL);
  head.ele("registrant", process.env.NEXT_PUBLIC_DOI_REGISTRANT_NAME);
  return head;
}

function getInstitutionXml(contributor: any) {
  const institution = xmlbuilder.create("institution");
  if (contributor?.affiliation) {
    institution.ele("institution_name", contributor.affiliation);
  } else {
    institution.ele("institution_name", process.env.NEXT_PUBLIC_INSTITUTION_NAME);
    institution.ele("institution_id", { type: "ror" }, process.env.NEXT_PUBLIC_INSTITUTION_ROR);
    institution.ele("institution_id", { type: "isni" }, process.env.NEXT_PUBLIC_INSTITUTION_ISNI);
    institution.ele(
      "institution_id",
      { type: "wikidata" },
      process.env.NEXT_PUBLIC_INSTITUTION_WIKIDATA,
    );
  }
  return institution;
}

function getDoiDataXml(doi: string, resource: string) {
  const doiData = xmlbuilder.create("doi_data");
  doiData.ele("doi", doi);
  doiData.ele("resource", resource);
  return doiData;
}

function getDateXml(elem: string, date: any) {
  const dateXml = xmlbuilder.create(elem);
  dateXml.ele("month", date.toFormat("MM"));
  dateXml.ele("day", date.toFormat("dd"));
  dateXml.ele("year", date.toFormat("yyyy"));
  return dateXml;
}

function getDatabaseXml(dataset: any) {
  const database = xmlbuilder.create("database");
  const metadata = database.ele("database_metadata", { language: "en" });
  metadata.ele("titles").ele("title", `${process.env.NEXT_PUBLIC_INSTITUTION_NAME} Datasets`);
  metadata.importDocument(getInstitutionXml(null));
  metadata.importDocument(
    getDoiDataXml(
      `${process.env.NEXT_PUBLIC_DOI_PREFIX}/${process.env.NEXT_PUBLIC_DATABASE_DOI}`,
      "https://www.codeday.org/data",
    ),
  );
  database.importDocument(dataset);
  return database;
}

function getContributorsXml(contributors: any[]) {
  const contributorsXml = xmlbuilder.create("contributors");
  for (const i in contributors) {
    const contributor = contributors[i];
    const person = contributorsXml.ele("person_name", {
      contributor_role: "author",
      sequence: i === "0" ? "first" : "additional",
    });
    person.ele("given_name", contributor.givenName);
    person.ele("surname", contributor.familyName);
    person.ele("affiliations").importDocument(getInstitutionXml(contributor));
    if (contributor.orcid)
      person.ele("ORCID", { authenticated: true }, `https://orcid.org/${contributor.orcid}`);
  }
  return contributorsXml;
}

function getDatasetXml({
  title,
  description,
  contributors,
  doiSuffix,
  license,
  funderName,
  funderIdentifier,
}: any) {
  const dataset = xmlbuilder.create("dataset").att("dataset_type", "collection");
  dataset.importDocument(getContributorsXml(contributors));
  dataset.ele("titles").ele("title", title);
  dataset.ele("publisher_item").ele("item_number", { item_number_type: "institution" }, doiSuffix);
  dataset.ele("description", { language: "en" }, description.replace(/\n/g, " "));
  dataset.ele("format", { mime_type: "text/html" });

  if (funderName || (funderIdentifier && funderIdentifier.startsWith("https://ror.org/"))) {
    const funder = dataset.ele("fr:program", { name: "fundref" });
    const funderGroup = funder.ele("fr:assertion", { name: "fundgroup" });

    if (funderIdentifier && funderIdentifier.startsWith("https://ror.org/")) {
      funderGroup.ele("fr:assertion", { name: "ror" }, funderIdentifier);
    } else {
      funderGroup.ele("fr:assertion", { name: "funder_name" }, funderName);
    }
  }

  const licenseXml = dataset.ele("ai:program", { name: "AccessIndicators" });
  licenseXml.ele("ai:free_to_read");
  licenseXml.ele("ai:license_ref", { applies_to: "vor" }, licenseToLink(license));

  dataset.importDocument(
    getDoiDataXml(
      `${process.env.NEXT_PUBLIC_DOI_PREFIX}/${doiSuffix}`,
      `https://www.codeday.org/doi/${process.env.NEXT_PUBLIC_DOI_PREFIX}/${doiSuffix}`,
    ),
  );
  return dataset;
}

function getPostedContentXml({
  type,
  title,
  contributors,
  doiSuffix,
  publicationDate,
  license,
  funderName,
  funderIdentifier,
}: any) {
  const dataset = xmlbuilder
    .create("posted_content")
    .att("type", ["presentation", "proposal"].includes(type) ? "other" : type);
  dataset.importDocument(getContributorsXml(contributors));
  dataset.ele("titles").ele("title", title);
  dataset.importDocument(getDateXml("posted_date", DateTime.fromISO(publicationDate)));

  if (funderName || (funderIdentifier && funderIdentifier.startsWith("https://ror.org/"))) {
    const funder = dataset.ele("fr:program", { name: "fundref" });
    const funderGroup = funder.ele("fr:assertion", { name: "fundgroup" });

    if (funderIdentifier && funderIdentifier.startsWith("https://ror.org/")) {
      funderGroup.ele("fr:assertion", { name: "ror" }, funderIdentifier);
    } else {
      funderGroup.ele("fr:assertion", { name: "funder_name" }, funderName);
    }
  }

  const licenseXml = dataset.ele("ai:program", { name: "AccessIndicators" });
  licenseXml.ele("ai:free_to_read");
  licenseXml.ele("ai:license_ref", { applies_to: "vor" }, licenseToLink(license));

  dataset.importDocument(
    getDoiDataXml(
      `${process.env.NEXT_PUBLIC_DOI_PREFIX}/${doiSuffix}`,
      `https://www.codeday.org/doi/${process.env.NEXT_PUBLIC_DOI_PREFIX}/${doiSuffix}`,
    ),
  );
  return dataset;
}

function getCrossrefXml(publication: any, id: string): string {
  const root = xmlbuilder
    .create("doi_batch", { version: "1.0", encoding: "UTF-8" })
    .att("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance")
    .att(
      "xsi:schemaLocation",
      "http://www.crossref.org/schema/5.4.0 https://www.crossref.org/schemas/crossref5.4.0.xsd",
    )
    .att("xmlns", "http://www.crossref.org/schema/5.4.0")
    .att("xmlns:jats", "http://www.ncbi.nlm.nih.gov/JATS1")
    .att("xmlns:fr", "http://www.crossref.org/fundref.xsd")
    .att("xmlns:ai", "http://www.crossref.org/AccessIndicators.xsd")
    .att("xmlns:mml", "http://www.w3.org/1998/Math/MathML")
    .att("version", "5.4.0");

  root.importDocument(getHeadXml(id));
  const body = root.ele("body");

  if (publication.type === "dataset") {
    body.importDocument(getDatabaseXml(getDatasetXml(publication)));
  } else if (
    ["dissertation", "preprint", "presentation", "proposal", "other"].includes(publication.type)
  ) {
    body.importDocument(getPostedContentXml(publication));
  }

  return root.end({ pretty: true });
}

export default function Crossref() {
  const { cms } = usePageData();
  const { query } = useRouter();

  const id = useMemo(() => `codeday-${Math.random().toString(36).substring(2, 8)}`, []);

  if (!cms) {
    return (
      <Page slug={`/doi/crossref/${query.doi}`}>
        <Content>
          <Skelly h={12} mb={4} />
          <Spinner />
        </Content>
      </Page>
    );
  }

  if (cms?.publications?.items.length < 1) {
    return null;
  }

  const item = cms.publications.items[0];
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const content = useMemo(() => getCrossrefXml(item, id), [item, id]);

  return (
    <Page slug={`/doi/crossref/${query.doi}`}>
      <Content>
        <Textarea
          fontFamily="monospace"
          fontSize="2xs"
          width="100%"
          height="64em"
          value={content}
        />
        <Button
          onClick={() => {
            const link = document.createElement("a");
            const file = new Blob([content], { type: "text/plain" });
            link.href = URL.createObjectURL(file);
            link.download = `${id}.xml`;
            link.click();
            URL.revokeObjectURL(link.href);
          }}
        >
          Download
        </Button>
      </Content>
    </Page>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const query = await apiFetch(print(ListPublicationsQuery), {}, {});

  return {
    paths:
      query?.cms?.publications?.items?.map((i: any) => ({
        params: {
          doi: [process.env.NEXT_PUBLIC_DOI_PREFIX, i.doiSuffix],
        },
      })) || [],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const doi = params?.doi as string[];
  const token = sign({ scopes: "read:users" }, process.env.ACCOUNT_SECRET!, { expiresIn: "3m" });
  return {
    props: {
      query: await apiFetch(
        print(PublicationQuery),
        { doiSuffix: doi.slice(1).join("/") },
        {
          Authorization: `Bearer ${token}`,
        },
      ),
    },
    revalidate: 300,
  };
};

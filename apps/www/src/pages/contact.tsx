import * as m from "@codeday/i18n/messages";
import { getLocaleFromContext } from "@codeday/i18n/next-pages";
import { Box, Grid, Text, Heading, Link, Image, Divider } from "@codeday/topo/Atom";
import { Content } from "@codeday/topo/Molecule";
import { getRegionFromContext } from "@codeday/topo/Region";
import { apiFetch } from "@codeday/topo/utils";
import { Email as EmailIcon } from "@codeday/topocons";
import { fixLocaleCasing } from "@codeday/utils";
import { ResultOf } from "@graphql-typed-document-node/core";
import { sign } from "jsonwebtoken";
import shuffle from "knuth-shuffle-seeded";
import { GetServerSideProps } from "next";
import React from "react";

import { graphql } from "@/gql";
import { useFragment } from "@/gql/fragment-masking";

import Employees, { EmployeesFragment } from "../components/Contact/Employees";
import FullProfile from "../components/Contact/FullProfile";
import TextOnly from "../components/Contact/TextOnly";
import Page from "../components/Page";

export const ContactFragment = graphql(`
  fragment ContactComponent on Query {
    account {
      employees: roleUsers(roleId: "rol_llN0357VXrEoIxoj") {
        id
      }
      otherTeam: roleUsers(roleId: "rol_6t902YZpsOynmWDt") {
        id
      }
      contractors: roleUsers(roleId: "rol_kQxfFcpISf1SyqPw") {
        id
      }
      board: roleUsers(roleId: "rol_cU5c8wlFVbSh6I2w") {
        id
        username
        givenName
        familyName
        picture
        bio
      }
      volunteers: roleUsers(roleId: "rol_Z10C6Hfr4bfqYa4r") {
        id
        name
      }
      emeritus: roleUsers(roleId: "rol_H5SU2E05hXd2m9pJ") {
        id
        givenName
        familyName
      }
      boardEmeritus: roleUsers(roleId: "rol_gbGvK17xrmrpCykr") {
        givenName
        familyName
      }
    }

    clear {
      tickets(where: { type: { in: [MENTOR, JUDGE, STAFF] } }) {
        firstName
        lastName
      }
    }

    labs {
      mentors(where: { inStatus: ACCEPTED }) {
        givenName
        surname
      }
    }

    cms {
      localizationConfigs(where: { id: $region }, locale: $locale) {
        items {
          contactDefaultType
          contactDefaultValue
          domainName
          mailingAddress {
            addressLine1
            addressLine2
            addressLine3
            city
            region
            postalCode
            country
          }
        }
      }
    }
  }
`);

const ContactQuery = graphql(`
  query ContactQuery($region: String!, $locale: String!) {
    ...ContactComponent
    ...ContactEmployeesComponent
  }
`);

function nl2br(str: string): string {
  return str.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, "$1<br />$2");
}

function toTitleCase(str: string): string {
  return str.replace(
    /\w\S*/g,
    (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase(),
  );
}

interface ContactProps {
  query: ResultOf<typeof ContactQuery>;
  seed: number;
  host: string;
}

export default function Contact({ query, seed, host }: ContactProps) {
  const {
    cms: { localizationConfigs },
    account: { employees, otherTeam, volunteers, board, contractors, emeritus, boardEmeritus },
    labs,
    clear,
  } = useFragment(ContactFragment, query);

  const { domainName, contactDefaultType, contactDefaultValue, mailingAddress } =
    localizationConfigs?.items?.[0];

  const officeAddress = mailingAddress;

  const email = `team@${host || host.startsWith("localhost") ? domainName : host}`;

  const employeeIds = employees.map((e: any) => e.id);
  const otherIds = [...employees, ...otherTeam, ...board, ...contractors, ...emeritus].map(
    (e: any) => e.id,
  );
  const justVolunteers = shuffle(
    volunteers.filter((v: any) => !otherIds.includes(v.id)),
    seed,
  );
  const uniqueBoard = board.filter((director: any) => !employeeIds.includes(director.id));

  const boardEmeritusNames = boardEmeritus.map((e: any) =>
    toTitleCase(e.givenName + " " + e.familyName).replace(/( \.| \*)/g, ""),
  );
  const emeritusNames = emeritus.map((e: any) =>
    toTitleCase(e.givenName + " " + e.familyName).replace(/( \.| \*)/g, ""),
  );

  const volunteerNames = [
    ...new Set(
      [...justVolunteers, ...labs.mentors, ...clear.tickets].map((vol: any) =>
        toTitleCase(
          vol.name
            ? vol.name
            : `${vol.firstName || vol.givenName || ""} ${vol.lastName || vol.surname || vol.familyName || ""}`,
        ).replace(/( \.| \*)/g, ""),
      ),
    ),
  ]
    .filter((a: string) => !a.includes("Volunteer") && a.length > 3 && !a.includes("?"))
    .sort();

  return (
    <Page slug="/contact" title="Contact">
      <Content>
        <Image
          src="https://img.codeday.org/o/1/9/191yum8oauq3rnagx6aakycvrxxmw4vdg46vei71sfaxessdj3qdn2inwx58derbbi.jpg"
          alt=""
          mt={-8}
          mb={8}
          rounded="md"
        />
        <Heading as="h2" fontSize="5xl" mb={12}>
          {m.www_contact_lets_talk()}
        </Heading>
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
          gap={8}
          alignItems="center"
          mb={12}
          textAlign="center"
        >
          <Box>
            <Heading as="h4" fontSize="lg" mb={2}>
              {m.www_contact_accounts_receivable()}
            </Heading>
            <Text mb={1} fontSize="md">
              {mailingAddress.addressLine1}
              <br />
              {mailingAddress.addressLine2 && (
                <>
                  {mailingAddress.addressLine2}
                  <br />
                </>
              )}
              {mailingAddress.addressLine3 && (
                <>
                  {mailingAddress.addressLine3}
                  <br />
                </>
              )}
              {mailingAddress.city}, {mailingAddress.region} {mailingAddress.postalCode}
              <br />
              {mailingAddress.country}
            </Text>
          </Box>

          <Box>
            <Heading as="h4" fontSize="lg" mb={2}>
              {m.www_contact_hq()}
            </Heading>
            <Text mb={1} fontSize="md">
              {officeAddress.addressLine1}
              <br />
              {officeAddress.addressLine2 && (
                <>
                  {officeAddress.addressLine2}
                  <br />
                </>
              )}
              {officeAddress.addressLine3 && (
                <>
                  {officeAddress.addressLine3}
                  <br />
                </>
              )}
              {officeAddress.city}, {officeAddress.region} {officeAddress.postalCode}
              <br />
              {officeAddress.country}
            </Text>
          </Box>

          <Text fontWeight="bold" fontSize="2xl" mb={1}>
            <Link href={`mailto:${email}`}>{email}</Link>
            <br />
            {contactDefaultType === "whatsapp" ? (
              <Link
                href={`https://api.whatsapp.com/send?phone=${contactDefaultValue.replace(
                  /[^0-9]/g,
                  "",
                )}`}
              >
                {contactDefaultValue}
              </Link>
            ) : (
              <Link href={`tel:${contactDefaultValue.replace(/[^0-9]/g, "")}`}>
                {contactDefaultValue}
              </Link>
            )}
          </Text>
        </Grid>
      </Content>

      <Content>
        <Divider />
      </Content>

      <Content>
        <Heading
          as="h3"
          fontSize="xl"
          color="current.textLight"
          textAlign={{ base: "left", md: "center" }}
          mt={12}
        >
          {m.www_contact_team()}{" "}
          <Link position="relative" top={1} cursor="pointer" href="mailto:team@codeday.org">
            <EmailIcon />
          </Link>
        </Heading>
      </Content>
      <Employees data={query} seed={seed} mb={8} />

      <Content>
        <Heading
          as="h4"
          fontSize="sm"
          color="current.textLight"
          textAlign={{ base: "left", md: "center" }}
          mb={0}
          mt={0}
        >
          {m.www_contact_emeriti()}
        </Heading>
      </Content>
      <TextOnly fontSize="sm" color="current.textLight" names={emeritusNames} mt={-2} mb={16} />

      <Content>
        <Divider />
      </Content>

      <Content>
        <Heading
          as="h3"
          fontSize="xl"
          color="current.textLight"
          textAlign={{ base: "left", md: "center" }}
          mt={12}
        >
          {m.www_contact_board_members()}{" "}
          <Link
            position="relative"
            top={1}
            cursor="pointer"
            href="mailto:board-external@codeday.org"
          >
            <EmailIcon />
          </Link>
        </Heading>
      </Content>
      <FullProfile mb={8} entries={uniqueBoard} />

      <Content>
        <Heading
          as="h4"
          fontSize="sm"
          color="current.textLight"
          textAlign={{ base: "left", md: "center" }}
          mb={0}
          mt={0}
        >
          {m.www_contact_emeriti()}
        </Heading>
      </Content>
      <TextOnly
        fontSize="sm"
        color="current.textLight"
        names={boardEmeritusNames}
        mt={-2}
        mb={16}
      />

      <Content>
        <Divider />
      </Content>

      <Content>
        <Heading
          as="h3"
          fontSize="xl"
          color="current.textLight"
          textAlign={{ base: "left", md: "center" }}
          mt={12}
        >
          {m.www_contact_volunteers()}
        </Heading>
      </Content>
      <TextOnly names={volunteerNames} />
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const hostname = ctx.req.headers["x-forwarded-host"] || ctx.req.headers["host"];
  const host = typeof hostname === "string" ? hostname : "";

  const locale = fixLocaleCasing(getLocaleFromContext(ctx));
  const region = getRegionFromContext(ctx);

  const token = sign({ scopes: "read:users" }, process.env.ACCOUNT_SECRET!, { expiresIn: "3m" });
  const labsToken = sign({ typ: "a", aud: "urn:gql.labs.codeday.org" }, process.env.LABS_SECRET!, {
    expiresIn: "3m",
  });
  const clearToken = sign({ t: "A", aud: "clear-gql" }, process.env.CLEAR_SECRET!, {
    expiresIn: "3m",
  });
  return {
    props: {
      host,
      query: await apiFetch(
        ContactQuery,
        { locale, region },
        {
          Authorization: `Bearer ${token}`,
          "X-Labs-Authorization": `Bearer ${labsToken}`,
          "X-Clear-Authorization": `Bearer ${clearToken}`,
        },
      ),
      seed: Math.random(),
    },
  };
};

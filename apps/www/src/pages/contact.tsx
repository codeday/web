import { Box, Grid, Text, Heading, Link, Image, Divider } from "@codeday/topo/Atom";
import { Content } from "@codeday/topo/Molecule";
import * as m from "@codeday/i18n/messages";
import { apiFetch } from "@codeday/topo/utils";
import { Email as EmailIcon } from "@codeday/topocons";
import { print } from "graphql";
import { sign } from "jsonwebtoken";
import shuffle from "knuth-shuffle-seeded";
import { GetStaticProps } from "next";
import React from "react";

import Employees from "../components/Contact/Employees";
import FullProfile from "../components/Contact/FullProfile";
import TextOnly from "../components/Contact/TextOnly";
import Page from "../components/Page";
import { usePageData } from "@codeday/topo/Theme";
import { ContactQuery } from "./contact.gql";

function nl2br(str: string): string {
  return str.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, "$1<br />$2");
}

function toTitleCase(str: string): string {
  return str.replace(
    /\w\S*/g,
    (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase(),
  );
}

export default function Home({ seed }: { seed: number }) {
  const {
    cms: { email, phone, fax, address, officeAddress },
    account: { employees, otherTeam, volunteers, board, contractors, emeritus, boardEmeritus },
    labs,
    clear,
  } = usePageData();

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
            <Heading as="h3" fontSize="2xl" mb={4}>
              {m.www_contact_accounts_receivable()}
            </Heading>
            <Text mb={1} fontSize="md">
              <span dangerouslySetInnerHTML={{ __html: nl2br(address?.items[0]?.value) }} />
            </Text>
          </Box>

          <Box>
            <Heading as="h3" fontSize="2xl" mb={4}>
              {m.www_contact_hq()}
            </Heading>
            <Text mb={1} fontSize="md">
              <span dangerouslySetInnerHTML={{ __html: nl2br(officeAddress?.items[0]?.value) }} />
            </Text>
          </Box>

          <Text fontWeight="bold" fontSize="2xl" mb={1}>
            <Link href={`mailto:${email?.items[0]?.value}`}>{email?.items[0]?.value}</Link>
            <br />
            <Link href={`tel:${phone?.items[0]?.value.replace(/[^0-9]/g, "")}`}>
              {phone?.items[0]?.value}
            </Link>
            <br />
            <Link href={`tel:${fax?.items[0]?.value.replace(/[^0-9]/g, "")}`}>
              {fax?.items[0]?.value}
            </Link>{" "}
            {m.www_contact_fax()}
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
      <Employees seed={seed} mb={8} />

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

export const getStaticProps: GetStaticProps = async () => {
  const token = sign({ scopes: "read:users" }, process.env.ACCOUNT_SECRET!, { expiresIn: "3m" });
  const labsToken = sign({ typ: "a", aud: "urn:gql.labs.codeday.org" }, process.env.LABS_SECRET!, {
    expiresIn: "3m",
  });
  const clearToken = sign({ t: "A", aud: "clear-gql" }, process.env.CLEAR_SECRET!, {
    expiresIn: "3m",
  });
  return {
    props: {
      query: await apiFetch(
        print(ContactQuery),
        {},
        {
          Authorization: `Bearer ${token}`,
          "X-Labs-Authorization": `Bearer ${labsToken}`,
          "X-Clear-Authorization": `Bearer ${clearToken}`,
        },
      ),
      seed: Math.random(),
    },
    revalidate: 300,
  };
};

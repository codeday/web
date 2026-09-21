import { Text, Box, Grid, Image, Link } from "@codeday/topo/Atom";
import { Content } from "@codeday/topo/Molecule";
import React from "react";

import { graphql } from "@/gql";
import { FragmentType, useFragment } from "@/gql/fragment-masking";

export const EmployeesFragment = graphql(`
  fragment ContactEmployeesComponent on Query {
    account {
      employees: roleUsers(roleId: "rol_llN0357VXrEoIxoj") {
        username
        givenName
        familyName
        title
        picture
      }
      otherTeam: roleUsers(roleId: "rol_6t902YZpsOynmWDt") {
        username
        givenName
        familyName
        title
        picture
      }
      contractors: roleUsers(roleId: "rol_kQxfFcpISf1SyqPw") {
        username
        givenName
        familyName
        title
        picture
      }
    }
  }
`);

const titleContents = ["CEO", "President", "VP", "Chief", "Director", "Head", "Manager", "Lead"];
const titlePrecedence = (title: string) =>
  titleContents.reduce(
    (accum, t, i) => (title && title.indexOf(t) >= 0 ? Math.min(i, accum) : accum),
    titleContents.length,
  );
function sortFn(a: any, b: any) {
  if (a.title.startsWith("Consult") && !b.title.startsWith("Consult")) return 1;
  if (b.title.startsWith("Consult") && !a.title.startsWith("Consult")) return -1;
  const aPrec = titlePrecedence(a.title);
  const bPrec = titlePrecedence(b.title);
  if (aPrec !== bPrec) return aPrec - bPrec;

  if (a.name > b.name) return -1;
  if (b.name > a.name) return 1;
  return 0;
}

function dedupeByKey(key: string, arr: any[]) {
  return Object.entries(Object.fromEntries(arr.map((e: any) => [e[key], e]))).map(([_, e]) => e);
}

interface EmployeesProps {
  data: FragmentType<typeof EmployeesFragment>;
  [key: string]: any;
}

export default function Employees({ data, ...props }: EmployeesProps) {
  const {
    account: { employees, otherTeam, contractors },
  } = useFragment(EmployeesFragment, data);

  const sortedEmployees = dedupeByKey("username", [
    ...employees,
    ...otherTeam,
    ...contractors,
  ]).sort(sortFn);

  return (
    <Content {...props}>
      <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={12}>
        {sortedEmployees.map((emp: any) => (
          <Box>
            <Box>
              <Box>
                <Image
                  title={emp.username}
                  src={emp.picture
                    .replace("256x256", "w=100;h=100;fit=crop")
                    .replace("s=480", "s=64")}
                  float="left"
                  mr={4}
                  rounded="full"
                  w="16"
                  h="16"
                  alt=""
                />
                <Box position="relative" top={-1}>
                  <Link href={`mailto:${emp.username}@codeday.org`} mb={0} pt={2} fontWeight="bold">
                    {emp.givenName} {emp.familyName}
                  </Link>
                  <Text mt={0} display="block" mb={0} p={0} fontSize="sm" color="current.textLight">
                    {emp.title.split(" - ").slice(0, 1) || "Staff"}
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Grid>
    </Content>
  );
}

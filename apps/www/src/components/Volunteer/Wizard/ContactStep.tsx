import { Box, Heading, VStack, TextInput } from "@codeday/topo/Atom";
import { DataCollection } from "@codeday/topo/Molecule";
import * as m from "@codeday/i18n/messages";
import React from "react";

interface ContactStepProps {
  firstName: string;
  setFirstName: (v: string) => void;
  lastName: string;
  setLastName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  linkedin: string;
  setLinkedin: (v: string) => void;
  background: string;
  region: string;
  resolvedStartPage: number;
}

export default function ContactStep({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  linkedin,
  setLinkedin,
  background,
  region,
  resolvedStartPage,
}: ContactStepProps) {
  return (
    <Box>
      <Heading as="h3" fontSize="xl" mb={2}>
        {/*special logic if the only page user sees is contact info*/}
        {resolvedStartPage === 2
          ? background === "industry"
            ? m.www_contact_apply_labs()
            : m.www_contact_apply_region({ region })
          : m.www_contact_reach_out()}
      </Heading>
      <VStack w="md" mb={3}>
        <TextInput
          m={1}
          placeholder={m.www_contact_first_name()}
          value={firstName}
          onChange={(e: any) => setFirstName(e.target.value)}
        />
        <TextInput
          m={1}
          placeholder={m.www_contact_last_name()}
          value={lastName}
          onChange={(e: any) => setLastName(e.target.value)}
        />
        <TextInput
          m={1}
          placeholder={m.www_contact_email()}
          value={email}
          onChange={(e: any) => setEmail(e.target.value)}
        />
        {background === "industry" ? (
          <TextInput
            m={1}
            placeholder={m.www_contact_linkedin()}
            value={linkedin}
            onChange={(e: any) => {
              setLinkedin(e.target.value);
            }}
          />
        ) : undefined}
      </VStack>
      <DataCollection message="pii" />
    </Box>
  );
}

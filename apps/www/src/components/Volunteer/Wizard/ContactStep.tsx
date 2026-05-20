import { Box, Heading, VStack, TextInput } from "@codeday/topo/Atom";
import { DataCollection } from "@codeday/topo/Molecule";
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
            ? "Apply to volunteer for CodeDay Labs"
            : `Apply to volunteer for CodeDay ${region}`
          : "Let us know how to reach out:"}
      </Heading>
      <VStack w="md" mb={3}>
        <TextInput
          m={1}
          placeholder="First Name"
          value={firstName}
          onChange={(e: any) => setFirstName(e.target.value)}
        />
        <TextInput
          m={1}
          placeholder="Last Name"
          value={lastName}
          onChange={(e: any) => setLastName(e.target.value)}
        />
        <TextInput
          m={1}
          placeholder="Email"
          value={email}
          onChange={(e: any) => setEmail(e.target.value)}
        />
        {background === "industry" ? (
          <TextInput
            m={1}
            placeholder="LinkedIn"
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

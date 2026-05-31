import { Box, Grid, Text, Image } from "@codeday/topo/Atom";
import { Content } from "@codeday/topo/Molecule";
import * as m from "@codeday/i18n/messages";
import React from "react";

interface FullProfileProps {
  entries: any[];
  [key: string]: any;
}

export default function FullProfile({ entries, ...props }: FullProfileProps) {
  return (
    <Content {...props}>
      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={12}>
        {entries.map((director: any) => (
          <Box>
            <Box>
              <Image
                title={director.username}
                src={director.picture
                  .replace("256x256", "w=100;h=100;fit=crop")
                  .replace("s=480", "s=64")}
                float="left"
                mr={4}
                rounded="full"
                w="64px"
                h="64px"
                alt=""
              />
              <Text mb={0} pt={2} fontWeight="bold">
                {director.givenName} {director.familyName}
              </Text>
              <Text fontSize="sm" color="current.textLight">
                {m.www_contact_board_member()}
              </Text>
            </Box>
            <Box mt={4} ml="64px" pl={4}>
              <Text>
                {director.bio || `${director.givenName} is a member of the CodeDay board.`}
              </Text>
            </Box>
          </Box>
        ))}
      </Grid>
    </Content>
  );
}

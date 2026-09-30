import { Text, Heading } from "@codeday/topo/Atom";
import { Content } from "@codeday/topo/Molecule";
import { MailingListSubscribe } from "@codeday/topo/Organism";
import { useRouter } from "next/router";
import React from "react";

import Page from "@/components/Page";

export default function Home() {
  const { query } = useRouter();

  return (
    <Page slug={`/email/${query.slug}`}>
      <Content maxWidth="xl">
        <Heading maxWidth="x1">Get notified of opportunities from CodeDay!</Heading>
        <MailingListSubscribe
          maxWidth="x1"
          emailList={Array.isArray(query.slug) ? query.slug[0] : query.slug}
        />
        <Text color="gray.300">
          (We won't spam you, pinky promise!)
          <br />
          We don't use any tracking in our emails and you can unsubscribe whenever
        </Text>
      </Content>
    </Page>
  );
}

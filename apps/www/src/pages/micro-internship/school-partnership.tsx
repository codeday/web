import * as m from "@codeday/i18n/messages";
import { Eyebrow } from "@codeday/topo/Atom";
import { Band, Content, Section } from "@codeday/topo/Molecule";
import { StatementBlock } from "@codeday/topo/Organism";
import React from "react";

import Page from "../../components/Page";
import EmailSample from "../../components/SchoolPartnership/EmailSample";

export default function SchoolPartnership() {
  return (
    <Page
      slug="/micro-internship/school-partnership"
      title={m.www_schoolpartnership_meta_title()}
      description={m.www_schoolpartnership_meta_description()}
    >
      <Band tone="page">
        <Section ramp="blackberry" spacing="compact">
          <Content maxW="container.md">
            <Eyebrow ramp="blackberry" color="colorPalette.600">
              {m.www_schoolpartnership_eyebrow()}
            </Eyebrow>
            <StatementBlock
              size="hero"
              as="h1"
              ramp="blackberry"
              heading={m.www_schoolpartnership_heading()}
              body={[m.www_schoolpartnership_body()]}
            />
          </Content>
        </Section>

        <Section ramp="blackberry" spacing="compact">
          <Content maxW="container.md" display="flex" flexDirection="column" gap="6">
            <StatementBlock
              size="section"
              heading={m.www_schoolpartnership_instructions_heading()}
              body={[m.www_schoolpartnership_instructions_body()]}
            />
            <EmailSample />
          </Content>
        </Section>
      </Band>
    </Page>
  );
}

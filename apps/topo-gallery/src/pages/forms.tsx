import { Box, Checkbox, Field, Radio, Select, Switch, TextInput, Textarea } from "@codeday/topo/Atom";
import React from "react";

import { GalleryPage, Section } from "../components/GalleryLayout";

export default function FormsPage() {
  return (
    <GalleryPage title="Forms">
      <Section title="Input, Textarea, Select">
        <Box display="flex" flexDirection="column" gap={3} width="280px">
          <TextInput placeholder="Text input" />
          <Textarea placeholder="Textarea" />
          <Select>
            <option>One</option>
            <option>Two</option>
          </Select>
        </Box>
      </Section>

      <Section title="Field wrapper (label / help / error)">
        <Field.Root width="280px">
          <Field.Label>Email</Field.Label>
          <TextInput placeholder="you@example.com" />
          <Field.HelperText>We&apos;ll never share it.</Field.HelperText>
        </Field.Root>
        <Field.Root invalid width="280px">
          <Field.Label>Name</Field.Label>
          <TextInput placeholder="Required" />
          <Field.ErrorText>This field is required.</Field.ErrorText>
        </Field.Root>
      </Section>

      <Section title="Checkbox / Radio — checked fill is the flat 62% stop, not a gradient">
        <Checkbox colorPalette="hibiscus">Unchecked</Checkbox>
        <Checkbox colorPalette="hibiscus" checked>
          Checked
        </Checkbox>
        <Radio isChecked colorPalette="figjam">
          Radio checked
        </Radio>
      </Section>

      <Section title="Switch — off gray.300, on the 62% stop">
        <Switch colorPalette="hibiscus">Off</Switch>
        <Switch colorPalette="hibiscus" checked>
          On
        </Switch>
      </Section>
    </GalleryPage>
  );
}

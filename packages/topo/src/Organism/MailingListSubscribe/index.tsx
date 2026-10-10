import * as m from "@codeday/i18n/messages";
import { Box, type BoxProps, Button, Grid, TextInput } from "@codeday/topo/Atom";
import { apiFetch, useToasts } from "@codeday/topo/utils";
import React, { useId, useState } from "react";

import type { Message } from "../../utils";

interface MailingListSubscribeProps extends BoxProps {
  emailList?: string;
  colorPalette?: string;
  /** @deprecated use colorPalette */
  colorScheme?: string;
  textList?: any;
  variant?: string;
  fields?: Record<string, string>;
  label?: Message;
  placeholder?: Message;
  inputType?: "text" | "email";
}

function MailingListSubscribe({
  emailList,
  textList: _textList,
  variant = "solid",
  colorPalette,
  colorScheme = "green",
  label,
  placeholder,
  inputType = "text",
  ...props
}: MailingListSubscribeProps) {
  const inputId = useId();
  const { success, error } = useToasts();
  const [input, setInput] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiFetch(
        "mutation SubscribeEmail ($list: String!, $email: String!) { email { subscribe(list: $list, email: $email) } }",
        { list: emailList, email: input },
        {},
      );
      success(m.topo_mailinglist_success());
    } catch {
      error(m.topo_mailinglist_error());
    }
    setIsSubmitting(false);
  };

  return (
    <Box as="form" {...({ onSubmit: subscribe } as any)} {...(props as any)}>
      {label && (
        <Box
          as="label"
          {...({ htmlFor: inputId } as any)}
          display="block"
          fontSize="sm"
          fontWeight="600"
          marginBottom="1.5"
        >
          {label}
        </Box>
      )}
      <Grid templateColumns="1fr min-content">
        <TextInput
          id={inputId}
          type={inputType}
          required
          autoComplete={inputType === "email" ? "email" : undefined}
          placeholder={placeholder ?? m.topo_mailinglist_placeholder()}
          value={input || undefined}
          onChange={(e: any) => setInput(e.target.value)}
          borderTopRightRadius={0}
          borderBottomRightRadius={0}
          borderRightWidth={0}
        />
        <Button
          type="submit"
          variant={(variant || "solid") as any}
          colorPalette={colorPalette ?? colorScheme ?? "green"}
          loading={isSubmitting}
          borderTopLeftRadius={0}
          borderBottomLeftRadius={0}
        >
          {m.topo_mailinglist_subscribe()}
        </Button>
      </Grid>
    </Box>
  );
}
export { MailingListSubscribe, type MailingListSubscribeProps };

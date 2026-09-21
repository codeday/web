import { Box, Flex, Button, Text, TextInput as InputText } from "@codeday/topo/Atom";
import { useToasts } from "@codeday/topo/utils";
import { useRouter } from "next/router";
import { useState } from "react";
import LinkedInTag from "react-linkedin-insight";

import { useAfterMountEffect } from "../../utils/useAfterMountEffect";

export default function RemindMe(props: any) {
  const { error } = useToasts();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { query } = useRouter();
  const qs = new URLSearchParams(query as Record<string, string>).toString();

  const [hasStarted, setHasStarted] = useState(false);
  useAfterMountEffect(() => {
    if (!hasStarted) {
      (global as any).analytics?.track("volunteer.started", { style: "remind-me" });
      LinkedInTag.init("1831116", null, false);
    }
    setHasStarted(true);
  }, [email, hasStarted]);

  if (submitted) {
    return (
      <Box {...props}>
        <Text>Thanks, we've emailed you a reminder!</Text>
      </Box>
    );
  }

  return (
    <Box {...props}>
      <Text>
        Don't want to fill this out on your phone? We can email you a link to sign up when you're
        back at your desk:
      </Text>
      <Flex>
        <InputText
          type="email"
          value={email}
          onChange={(e: any) => setEmail(e.target.value)}
          disabled={submitting}
          placeholder="me@example.com"
          mr={2}
        />
        <Button
          variant="secondary"
          colorPalette="marmalade"
          disabled={email.indexOf("@") < 0}
          loading={submitting}
          onClick={async () => {
            setSubmitting(true);
            (global as any).analytics?.track("volunteer.remind-me");
            (global as any).analytics?.identify(email);
            try {
              await fetch("https://hooks.zapier.com/hooks/catch/2757438/b9486tx", {
                method: "POST",
                body: JSON.stringify({ email, referrer: query?.ref || "", qs }),
                headers: {},
              });
              setSubmitted(true);
            } catch (ex: any) {
              error(ex.toString());
            }
            setSubmitting(false);
          }}
        >
          Send
        </Button>
      </Flex>
    </Box>
  );
}

import { Box, Link, Spinner, Text } from "@codeday/topo/Atom";
import { DataCollection } from "@codeday/topo/Molecule";
import { useColorMode } from "@codeday/topo/Theme";
import { useTheme } from "@codeday/topo/utils";
import * as m from "@codeday/i18n/messages";
/* eslint-disable no-secrets/no-secrets */
/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";

import Form from "./form";
import style from "./style";

interface CognitoFormProps {
  formId: number | string;
  prefill?: any;
  showTitle?: boolean;
  onSubmit?: () => any;
  onPageChange?: () => any;
  onFirstPageChange?: () => any;
  payment?: boolean;
  fallback?: boolean;
  hidePrivacy?: boolean;
  accountId?: string;
  css?: string;
}

const CognitoForm = ({
  formId,
  prefill,
  showTitle,
  onSubmit = () => null,
  onPageChange = () => null,
  onFirstPageChange = () => null,
  payment,
  accountId,
  hidePrivacy,
  css,
}: CognitoFormProps) => {
  const theme = useTheme();
  const { colorMode } = useColorMode();
  theme.colors.current = theme.colors.modes[colorMode];
  const [hasFirstPageChange, setHasFirstPageChange] = useState(false);

  const [showFallback, setShowFallback] = useState(false);
  const typeofWindow = typeof window;

  useEffect(() => {
    if (typeofWindow === "undefined") return () => {};
    const timeout = setTimeout(() => setShowFallback(true), 15 * 1000);
    return () => clearTimeout(timeout);
  }, [typeofWindow, setShowFallback, showFallback]);

  return (
    <>
      <Form
        accountId={accountId || theme.cognito.id}
        formId={formId}
        prefill={prefill}
        css={(formId) => style({ theme, showTitle, colorMode, formId }) + `\n${css || ""}`}
        loading={
          <Box textAlign="center">
            <Spinner />
            <br />
            {showFallback && (
              <Text>
                {m.topo_cognitoform_loading_problem()}{" "}
                <Link
                  href={`https://services.cognitoforms.com/f/${theme.cognito.id}?id=${formId}`}
                  target="_blank"
                >
                  {m.topo_cognitoform_open_newtab()}
                </Link>
              </Text>
            )}
          </Box>
        }
        onSubmit={onSubmit}
        onPageChange={() => {
          onPageChange();
          if (!hasFirstPageChange) {
            onFirstPageChange();
            setHasFirstPageChange(true);
          }
        }}
      />
      {!hidePrivacy && <DataCollection message={payment ? "payment" : "pii"} />}
    </>
  );
};

export { CognitoForm, type CognitoFormProps };

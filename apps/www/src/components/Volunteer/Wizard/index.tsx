import { Box, Button } from "@codeday/topo/Atom";
import { useToasts } from "@codeday/topo/utils";
import { debug } from "@codeday/utils";
import { usePostHog } from "@posthog/react";
import React, { useState, useReducer, useEffect, RefObject } from "react";

import { useMarketing } from "../../../providers";
import { useAfterMountEffect } from "../../../utils/useAfterMountEffect";
import BackgroundStep from "./BackgroundStep";
import ConfirmationStep from "./ConfirmationStep";
import ContactStep from "./ContactStep";
import RegionStep from "./RegionStep";

const DEBUG = debug(["www", "components", "Volunteer", "Wizard"]);

// https://stackoverflow.com/a/48981669
function groupBy(xs: any[], f: (x: any) => string): Record<string, any[]> {
  return xs.reduce(
    (r: any, v: any, i: number, a: any[], k = f(v)) => ((r[k] || (r[k] = [])).push(v), r),
    {},
  );
}

const emailRe = new RegExp(".+@.+\\..+");

const PAGE_COUNT = 4;
const pageIds = ["background", "region", "email", "final"];

interface WizardProps {
  events: any[];
  formRef: RefObject<HTMLDivElement>;
  startBackground?: string;
  startRegion?: string;
  startPage?: number;
  startSelection?: boolean;
  after?: string;
}

export default function Wizard({
  events,
  formRef,
  startBackground = "",
  startRegion = "",
  startPage = 0,
  startSelection = false,
  after,
}: WizardProps) {
  const posthog = usePostHog();
  const { error } = useToasts();
  const regions = new Array(
    ...new Set(
      events
        .filter((e) => !e.dontAcceptVolunteers)
        .map((e) =>
          JSON.stringify({
            name: e.region?.name || e.name,
            webname: e.contentfulWebname,
            country: e.region?.countryName || "Other",
            aliases: e.region?.aliases || [],
          }),
        ),
    ),
  ).map((e) => JSON.parse(e)); // json -> string -> json for deduplication
  const regionsByCountry = groupBy(regions, (r) => r.country);

  useEffect(() => {
    DEBUG("regions", regions);
    DEBUG("regionsByCountry", regionsByCountry);
  }, [regions, regionsByCountry]);

  let resolvedStartRegion = startRegion;
  if (resolvedStartRegion) {
    const webnamesToRegion: Record<string, string> = {};
    regions.forEach((r) => {
      webnamesToRegion[r.webname] = r.name;
      r.aliases.forEach((alias: string) => {
        webnamesToRegion[alias] = r.name;
      });
    });
    resolvedStartRegion = webnamesToRegion[resolvedStartRegion] || "";
  }
  let resolvedStartPage = startPage;
  let resolvedStartBackground = startBackground;
  let resolvedStartSelection = startSelection;
  if (startRegion && !resolvedStartRegion) {
    resolvedStartPage = 0;
    resolvedStartBackground = "";
    resolvedStartSelection = false;
  }

  const [background, setBackground] = useState(resolvedStartBackground);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const { linkedInConversion } = useMarketing();
  const [region, setRegion] = useState(resolvedStartRegion);
  const [isOrganize, setIsOrganize] = useState(false);
  const [commitmentLevel, setCommitmentLevel] = useState(0);
  const [hasSelection, setHasSelection] = useState(resolvedStartSelection);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | false>(false);

  useEffect(() => {
    posthog?.group("background", background);
  }, [background]);

  // 'last' should really be 'penultimate' but 'last' is shorter
  const [page, navigate] = useReducer(
    (prev: number, action: string) =>
      Math.max(
        0,
        action === "next" ? prev + 1 : prev - 1,
        action === "last" ? PAGE_COUNT - 2 : 0,
      ),
    resolvedStartPage,
  );
  const isFinalPage = page === PAGE_COUNT - 1;

  useEffect(() => {
    if (
      firstName &&
      lastName &&
      emailRe.test(email) &&
      (background === "industry" ? linkedin : true)
    )
      setHasSelection(true);
    else setHasSelection(false);
  }, [firstName, lastName, email, linkedin]);

  const [hasStarted, setHasStarted] = useState(false);
  useAfterMountEffect(() => {
    if (!hasStarted) {
      posthog?.capture("volunteer.started", { style: "full" });
    }
    setHasStarted(true);
  }, [background, hasStarted]);

  useAfterMountEffect(() => {
    if (isFinalPage) {
      posthog?.capture("volunteer.submitted");
      linkedInConversion("volunteer.submitted");
      if (email) posthog?.identify(posthog?.get_distinct_id(), { email });
    } else {
      posthog?.capture("volunteer.partial", {
        volunteerPage: pageIds[page],
        background: background,
      });
    }
  }, [page]);

  useEffect(() => setHasSelection(false), [page]);

  async function onClickNext() {
    // I wish i could set behavior: 'smooth' here but for some reason
    // When i set that it stops working entirely??????????????????"??"
    // Apparently you can fix it by modifying chrome flags but i dont want
    // it to not work for people who are using the defaults
    formRef.current!.scrollIntoView();
    if (hasSelection) {
      if (background === "industry" && page === 0) {
        // if industry, we want to skip region selection and get them in touch with
        // labs team
        navigate("last");
      } else if (page === PAGE_COUNT - 2) {
        // if submitting penultimate page, we now have all info
        setIsSubmitting(true);
        try {
          const resp = await fetch("/api/applyAsVolunteer", {
            method: "POST",
            body: JSON.stringify({
              email,
              firstName,
              lastName,
              linkedin,
              region,
              isOrganize,
              background,
            }),
            headers: {},
          });
          if (!resp.ok) {
            DEBUG(resp);
            setSubmitError(`${resp.status}: ${resp.statusText}`);
          } else {
            if (after) window.location.href = after;
            // Do not redirect if there is an error, as otherwise no indication would be shown to the user that their application was not recieved
          }
          navigate("next");
        } catch (ex: any) {
          error(ex.toString());
        }
        setIsSubmitting(false);
      } else {
        navigate("next");
      }
    }
  }

  const pages = [
    <BackgroundStep
      background={background}
      onSelectStudent={() => {
        setBackground("student");
        navigate("next");
      }}
      onSelectIndustry={() => {
        setBackground("industry");
        navigate("last");
      }}
    />,
    <RegionStep
      regions={regions}
      regionsByCountry={regionsByCountry}
      region={region}
      setRegion={setRegion}
      isOrganize={isOrganize}
      setIsOrganize={setIsOrganize}
      setHasSelection={setHasSelection}
      commitmentLevel={commitmentLevel}
      setCommitmentLevel={setCommitmentLevel}
    />,
    <ContactStep
      firstName={firstName}
      setFirstName={setFirstName}
      lastName={lastName}
      setLastName={setLastName}
      email={email}
      setEmail={setEmail}
      linkedin={linkedin}
      setLinkedin={setLinkedin}
      background={background}
      region={region}
      resolvedStartPage={resolvedStartPage}
    />,
    <ConfirmationStep submitError={submitError} />,
  ];

  return (
    <Box>
      {pages[page]}
      {!isFinalPage && page !== 0 && (
        <Box textAlign={{ base: "center", md: "right" }} mt={8}>
          <Button
            colorPalette="green"
            loading={isSubmitting}
            onClick={onClickNext}
            disabled={!hasSelection || isSubmitting}
          >
            Next
          </Button>
        </Box>
      )}
    </Box>
  );
}

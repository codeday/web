import { apiFetch } from "@codeday/topo/utils";
import Airtable from "airtable";
import { checkBotId } from "botid/server";
import { NextApiRequest, NextApiResponse } from "next";
import { ServerClient } from "postmark";
import isEmail from "sane-email-validation";

import {
  renderBannedVolunteer,
  renderCodeDayExistingRegion,
  renderCodeDayOrganizeRegion,
  renderEmailRM,
  renderEmailRMToStudent,
  renderUnknown,
} from "../../utils/volunteerOnboardingEmails";
import { ApplyAsVolunteerQuery } from "./applyAsVolunteer.gql";

const postmark = new ServerClient(process.env.POSTMARK_SERVER_TOKEN!);
const base = new Airtable({ apiKey: process.env.AIRTABLE_TOKEN }).base(process.env.AIRTABLE_BASE!);

const escapeAirtableFormulaValue = (value: string) => value.replace(/[\\"]/g, (c) => `\\${c}`);

async function ApplyAsVolunteer(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const verification = await checkBotId();

  if (verification.isBot) {
    return res.status(403).json({ error: "Access denied" });
  }

  let body;
  if (typeof req.body === "string") {
    try {
      body = JSON.parse(req.body);
    } catch {
      return res.status(400).json({ error: "Invalid JSON" });
    }
  } else {
    body = req.body ?? {};
  }

  const { email, firstName, lastName, linkedin, region, isOrganize, background } = body;
  if (!email || !isEmail(String(email))) {
    return res.status(400).json({ error: "Invalid email" });
  }

  let banned = false;

  try {
    const airtableRes = await base("Volunteers")
      .select({
        maxRecords: 100,
        fields: ["Flags"],

        filterByFormula: `TRIM(LOWER({Email})) = "${escapeAirtableFormulaValue(email.toString().toLowerCase().trim())}"`,
      })
      .firstPage();
    airtableRes.forEach((record: any) => {
      if ((record.get("Flags") || []).includes("Banned")) banned = true;
    });
  } catch (ex) {
    console.error(ex);
    return res.status(502).json({ error: "Failed to look up volunteer record" });
  }
  try {
    await base("Volunteers").create([
      {
        fields: {
          Name: `${firstName} ${lastName}`,
          Email: email,
          LinkedIn: linkedin,
          "Location (Not Listed)": region,
          Type: background,
        },
      },
    ]);
  } catch (ex) {
    console.error(ex);
    return res.status(502).json({ error: "Failed to create volunteer record" });
  }
  let emailText: string | undefined;
  // if(background === 'industry') {
  // emailText = renderLabsMentor({firstName})
  // This is disabled for now as we want non-student volunteers to be manually reviewed + followed up with

  if (banned) {
    emailText = renderBannedVolunteer({ firstName });
  } else if (background === "student" && isOrganize) {
    emailText = renderCodeDayOrganizeRegion({ firstName, region });
  } else if (background === "student" && !isOrganize) {
    const data = await apiFetch(
      ApplyAsVolunteerQuery,
      {
        webname: region.toLowerCase(),
      },
      { "X-Clear-Authorization": `Bearer ${process.env.CLEAR_TOKEN}` },
    );
    const cmsRegion = data.cms.regions.items[0];
    const clearRegion = data.clear.findFirstEvent;

    if (cmsRegion?.newVolunteerPipeline === "email-rm" && clearRegion?.managers[0]) {
      const rmEmailText = renderEmailRM({ firstName, lastName, email, region });
      await postmark.sendEmail({
        MessageStream: "outbound",
        To: `${clearRegion.managers[0]}@codeday.org`,
        From: "volunteer@codeday.org",
        Subject: `CodeDay ${region} volunteer application: ${firstName} ${lastName}`,
        Bcc: "volunteer@codeday.org",
        TextBody: rmEmailText,
      });
      emailText = renderEmailRMToStudent({ firstName, region });
    } else {
      emailText = renderCodeDayExistingRegion({ firstName, region });
    }
  }

  if (emailText) {
    await postmark.sendEmail({
      MessageStream: "outbound",
      To: email,
      From: "volunteer@codeday.org",
      Subject: "CodeDay: Volunteering Next Steps",
      Bcc: "volunteer@codeday.org",
      TextBody: emailText,
    });
  } else {
    await postmark.sendEmail({
      MessageStream: "outbound",
      To: "volunteer@codeday.org",
      From: "volunteer@codeday.org",
      Subject: "Volunteer form unhandled template",
      TextBody: renderUnknown({
        email,
        firstName,
        lastName,
        linkedin,
        region,
        isOrganize,
        background,
      }),
    });
  }
  return res.status(200).json({});
}

export default ApplyAsVolunteer;

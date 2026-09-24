import { apiFetch } from "@codeday/topo/utils";
import Airtable from "airtable";
import { checkBotId } from "botid/server";
import { NextApiRequest, NextApiResponse } from "next";
import { ServerClient } from "postmark";

import { graphql } from "@/gql";

import {
  renderBannedVolunteer,
  renderCodeDayExistingRegion,
  renderCodeDayOrganizeRegion,
  renderEmailRM,
  renderEmailRMToStudent,
  renderUnknown,
} from "../../utils/volunteerOnboardingEmails";

const ApplyAsVolunteerQuery = graphql(`
  query ApplyAsVolunteerQuery($webname: String!) {
    clear {
      findFirstEvent(
        where: { contentfulWebname: { equals: $webname } }
        orderBy: { startDate: desc }
      ) {
        managers
      }
    }
    cms {
      regions(where: { webname: $webname }) {
        items {
          newVolunteerPipeline
        }
      }
    }
  }
`);

const postmark = new ServerClient(process.env.POSTMARK_SERVER_TOKEN!);
const base = new Airtable({ apiKey: process.env.AIRTABLE_TOKEN }).base(process.env.AIRTABLE_BASE!);

async function ApplyAsVolunteer(req: NextApiRequest, res: NextApiResponse) {
  const verification = await checkBotId();

  if (verification.isBot) {
    return res.status(403).json({ error: "Access denied" });
  }

  const { email, firstName, lastName, linkedin, region, isOrganize, background } = JSON.parse(
    req.body,
  );
  let banned = false;

  try {
    const airtableRes = await base("Volunteers")
      .select({
        maxRecords: 100,
        fields: ["Flags"],

        filterByFormula: `TRIM(LOWER({Email})) = "${email.toString().toLowerCase().trim()}"`,
      })
      .firstPage();
    airtableRes.forEach((record: any) => {
      if ((record.get("Flags") || []).includes("Banned")) banned = true;
    });
  } catch (ex) {
    console.error(ex);
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
  }
  let emailText: string | undefined;

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

import * as m from "@codeday/i18n/messages";

export interface EmailTemplate {
  subject: string;
  body: string;
}

export function getEmailTemplates(): EmailTemplate[] {
  return [
    {
      subject: m.www_schoolpartnership_template_1_subject(),
      body: m.www_schoolpartnership_template_1_body(),
    },
    {
      subject: m.www_schoolpartnership_template_2_subject(),
      body: m.www_schoolpartnership_template_2_body(),
    },
    {
      subject: m.www_schoolpartnership_template_3_subject(),
      body: m.www_schoolpartnership_template_3_body(),
    },
    {
      subject: m.www_schoolpartnership_template_4_subject(),
      body: m.www_schoolpartnership_template_4_body(),
    },
    {
      subject: m.www_schoolpartnership_template_5_subject(),
      body: m.www_schoolpartnership_template_5_body(),
    },
  ];
}

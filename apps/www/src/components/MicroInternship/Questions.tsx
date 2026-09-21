import { Box } from "@codeday/topo/Atom";
import { ContentfulRichText } from "@codeday/topo/Molecule";
import { ResultOf } from "@graphql-typed-document-node/core";
import React from "react";

import { graphql } from "@/gql";
import { FragmentType, useFragment } from "@/gql/fragment-masking";

// Register-your-own-project applies to students and their parents — school
// and partner audiences have their own FAQ surfaces under `/help`.
export const QuestionsFragment = graphql(`
  fragment MicroInternshipQuestionsComponent on Query {
    cms {
      faqs(
        where: { program: { webname: "labs" }, audience_contains_some: ["Parent", "Student"] }
        order: [featured_DESC]
        limit: 20
      ) {
        items {
          title
          answer {
            json
          }
          sys {
            id
          }
        }
      }
    }
  }
`);

type Faq = NonNullable<ResultOf<typeof QuestionsFragment>["cms"]["faqs"]["items"][number]>;

// A question left, an answer right, separated by hairlines — the design
// language's one remaining "row" device once the side-index margin rule
// (`SectionRule`) is retired for pages.
function QaRow({ faq }: { faq: Faq }) {
  return (
    <Box
      display="grid"
      gridTemplateColumns={{ base: "1fr", md: "{sizes.sm} 1fr" }}
      columnGap="12"
      rowGap="2"
      paddingBlock="6"
      borderTop="sm"
      borderTopColor="current.border"
      _last={{ borderBottom: "sm", borderBottomColor: "current.border" }}
    >
      <Box as="h3" margin="0" fontSize="xl" fontWeight="700">
        {faq.title}
      </Box>
      <Box fontSize="md" lineHeight="moderate" color="gray.700">
        <ContentfulRichText json={faq.answer?.json} />
      </Box>
    </Box>
  );
}

interface QuestionsProps {
  data: FragmentType<typeof QuestionsFragment>;
}

export default function Questions({ data }: QuestionsProps) {
  const faqs = useFragment(QuestionsFragment, data).cms.faqs.items.filter(
    (faq): faq is Faq => !!faq,
  );

  return (
    <Box display="flex" flexDirection="column">
      {faqs.map((faq) => (
        <QaRow key={faq.sys.id} faq={faq} />
      ))}
    </Box>
  );
}

import { Text, Link, Heading, List, ListItem, Divider } from "@codeday/topo/Atom";
import React, { Fragment } from "react";

import { ContentfulAsset } from "./ContentfulAsset";

function getSize(initialSize: string, offset: number): string {
  const sizes = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl"];
  return sizes[sizes.indexOf(initialSize) + offset];
}

function renderTextContent({ value, marks }: { value: string; marks?: any[] }): any {
  if (["\r\n", "\n\r", "\r", "\n"].includes(value)) return <br />;

  const markMap = (marks || []).reduce(
    (accum: any, { type, ...rest }: any) => ({
      ...accum,
      [type]: Object.keys(rest).length > 0 ? rest : true,
    }),
    {},
  );

  if (marks && marks.length > 0) {
    return (
      <Text as="span" fontWeight={markMap.bold && "bold"} fontStyle={markMap.italic && "italic"}>
        {value}
      </Text>
    );
  }
  return value;
}

function mapRichText({
  nodeType,
  content,
  value,
  marks,
  data,
  links,
  h1Size,
  isRootElement,
}: any): any {
  const h1SizeCalculated = h1Size || "4xl";

  if (nodeType === "text") {
    return value
      .split(/(\r\n|\n\r|\r|\n)/g)
      .map((part: string) => renderTextContent({ value: part, marks }));
  }

  const innerContent =
    content &&
    content.map((c: any) => (
      <Fragment key={c.id}>
        {mapRichText({
          ...c,
          links,
          h1Size,
          isRootElement: nodeType === "document",
        })}
      </Fragment>
    ));

  const nodeTypes: Record<string, any> = {
    document: <>{innerContent}</>,
    hyperlink: (
      <Link href={data?.uri} target="_blank" rel="noopener">
        {innerContent}
      </Link>
    ),
    paragraph: (
      <Text as={!isRootElement ? "span" : undefined} mb={isRootElement && 6}>
        {innerContent}
      </Text>
    ),
    "heading-1": (
      <Heading mb={4} mt={8} as="h1" fontSize={h1SizeCalculated}>
        {innerContent}
      </Heading>
    ),
    "heading-2": (
      <Heading mb={4} mt={8} as="h2" fontSize={getSize(h1SizeCalculated, -1)}>
        {innerContent}
      </Heading>
    ),
    "heading-3": (
      <Heading mb={3} mt={6} as="h3" fontSize={getSize(h1SizeCalculated, -2)}>
        {innerContent}
      </Heading>
    ),
    "heading-4": (
      <Heading mb={2} mt={4} as="h4" fontSize={getSize(h1SizeCalculated, -3)}>
        {innerContent}
      </Heading>
    ),
    "heading-5": (
      <Heading mb={1} mt={2} as="h5" fontSize={getSize(h1SizeCalculated, -4)}>
        {innerContent}
      </Heading>
    ),
    "heading-6": (
      <Heading mb={1} mt={1} as="h6" fontSize={getSize(h1SizeCalculated, -5)}>
        {innerContent}
      </Heading>
    ),
    "unordered-list": (
      <List listStyleType="disc" mb={6} pl={4} listStylePosition="outside">
        {innerContent}
      </List>
    ),
    "ordered-list": (
      <List as="ol" listStyleType="decimal" mb={6} pl={4} listStylePosition="outside">
        {innerContent}
      </List>
    ),
    "list-item": <ListItem mb={1}>{innerContent}</ListItem>,
    hr: <Divider />,
    "embedded-asset-block": (
      <ContentfulAsset mt={4} mb={8} id={data?.target?.sys?.id} links={links} />
    ),
  };

  if (nodeType in nodeTypes) return nodeTypes[nodeType];
  return value;
}

interface ContentfulRichTextProps {
  json?: any;
  links?: any;
  h1Size?: string;
}

function ContentfulRichText({ json, links, h1Size }: ContentfulRichTextProps) {
  if (!json) return <></>;
  return <>{mapRichText({ ...json, links, h1Size })}</>;
}

export { ContentfulRichText };
export type { ContentfulRichTextProps };

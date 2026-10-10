import { Box, type BoxProps, Image, Link, Table } from "@codeday/topo/Atom";
import { PullQuote } from "@codeday/topo/Organism";
import React from "react";

import { imageUrl } from "@/lib/blog/format";
import type { BlogImage, PullQuoteAttribution, RichTextNode } from "@/lib/blog/types";

export interface BlogAsset extends BlogImage {
  contentType: string | null;
}

interface RenderContext {
  assets: Record<string, BlogAsset>;
  nested: boolean;
}

const BODY_TEXT: BoxProps = {
  fontSize: { base: "md", md: "lg" },
  lineHeight: "tall",
  color: "gray.700",
};

const HEADINGS: Record<string, { as: "h2" | "h3" | "h4" | "h5" | "h6"; style: BoxProps }> = {
  "heading-1": {
    as: "h2",
    style: { fontSize: { base: "2xl", md: "3xl" }, marginTop: "12", marginBottom: "4" },
  },
  "heading-2": {
    as: "h2",
    style: { fontSize: { base: "2xl", md: "3xl" }, marginTop: "12", marginBottom: "4" },
  },
  "heading-3": {
    as: "h3",
    style: { fontSize: { base: "xl", md: "2xl" }, marginTop: "10", marginBottom: "3" },
  },
  "heading-4": { as: "h4", style: { fontSize: "xl", marginTop: "8", marginBottom: "3" } },
  "heading-5": { as: "h5", style: { fontSize: "lg", marginTop: "8", marginBottom: "2" } },
  "heading-6": { as: "h6", style: { fontSize: "md", marginTop: "8", marginBottom: "2" } },
};

const CODE_BLOCK_CSS = {
  "& .hljs-keyword, & .hljs-literal, & .hljs-meta .hljs-keyword": {
    color: "{colors.hibiscus.true.300}",
  },
  "& .hljs-title.function_, & .hljs-title": { color: "{colors.trueWhite}" },
  "& .hljs-number": { color: "{colors.hotsauce.true.500}" },
};

const MARK_ELEMENTS: Record<string, (children: React.ReactNode) => React.ReactNode> = {
  bold: (c) => (
    <Box as="strong" fontWeight="700" color="black">
      {c}
    </Box>
  ),
  italic: (c) => <em>{c}</em>,
  underline: (c) => <u>{c}</u>,
  strikethrough: (c) => <s>{c}</s>,
  superscript: (c) => <sup>{c}</sup>,
  subscript: (c) => <sub>{c}</sub>,
  code: (c) => (
    <Box
      as="code"
      fontFamily="mono"
      fontSize={{ base: "sm", md: "md" }}
      color="hibiscus.800"
      bg="gray.50"
      borderWidth="1px"
      borderColor="current.border"
      borderRadius="sm"
      paddingInline="1"
      paddingBlock="0.5"
      css={{ overflowWrap: "anywhere" }}
    >
      {c}
    </Box>
  ),
};

function renderText(node: RichTextNode): React.ReactNode {
  const parts = (node.value ?? "").split("\n");
  const value = parts.flatMap((part, i) => (i === 0 ? [part] : [<br key={i} />, part]));
  return (node.marks ?? []).reduce<React.ReactNode>(
    (children, mark) => MARK_ELEMENTS[mark.type]?.(children) ?? children,
    <>{value}</>,
  );
}

function renderChildren(node: RichTextNode, ctx: RenderContext): React.ReactNode {
  return (node.content ?? []).map((child, i) => (
    <React.Fragment key={i}>{renderNode(child, ctx)}</React.Fragment>
  ));
}

function Figure({ asset, caption }: { asset: BlogAsset; caption?: string }) {
  return (
    <Box as="figure" marginBlock="10" marginInline="0">
      {asset.contentType?.startsWith("video/") ? (
        <Box
          as="video"
          {...({ src: asset.url, controls: true } as any)}
          width="full"
          borderRadius="2xl"
        />
      ) : (
        <Image
          src={imageUrl(asset.url, 1400)}
          alt={asset.alt}
          htmlWidth={asset.width ?? undefined}
          htmlHeight={asset.height ?? undefined}
          loading="lazy"
          display="block"
          width="auto"
          maxWidth="full"
          height="auto"
          maxHeight={{ base: "md", md: "xl" }}
          marginInline="auto"
          borderRadius="2xl"
        />
      )}
      {caption && (
        <Box as="figcaption" marginTop="3" fontSize="sm" color="current.textLight">
          {caption}
        </Box>
      )}
    </Box>
  );
}

function renderNode(node: RichTextNode, ctx: RenderContext): React.ReactNode {
  const nested = { ...ctx, nested: true };

  switch (node.nodeType) {
    case "document":
      return renderChildren(node, ctx);
    case "text":
      return renderText(node);
    case "paragraph":
      return ctx.nested ? (
        <Box as="p" css={{ "& + p": { marginTop: "3" } }}>
          {renderChildren(node, ctx)}
        </Box>
      ) : (
        <Box as="p" marginBottom="6" {...BODY_TEXT}>
          {renderChildren(node, ctx)}
        </Box>
      );
    case "heading-1":
    case "heading-2":
    case "heading-3":
    case "heading-4":
    case "heading-5":
    case "heading-6": {
      const heading = HEADINGS[node.nodeType];
      return (
        <Box
          as={heading.as}
          fontWeight="700"
          lineHeight="shorter"
          letterSpacing="tight"
          color="black"
          scrollMarginTop="24"
          {...heading.style}
        >
          {renderChildren(node, ctx)}
        </Box>
      );
    }
    case "hyperlink":
      return (
        <Link
          href={node.data?.uri}
          color="hibiscus.600"
          fontWeight="600"
          textDecoration="underline"
        >
          {renderChildren(node, ctx)}
        </Link>
      );
    case "unordered-list":
    case "ordered-list":
      return (
        <Box
          as={node.nodeType === "ordered-list" ? "ol" : "ul"}
          listStyleType={node.nodeType === "ordered-list" ? "decimal" : "disc"}
          listStylePosition="outside"
          paddingInlineStart="6"
          marginBottom={ctx.nested ? "0" : "6"}
          {...BODY_TEXT}
        >
          {renderChildren(node, nested)}
        </Box>
      );
    case "list-item":
      return (
        <Box as="li" marginBottom="2">
          {renderChildren(node, nested)}
        </Box>
      );
    case "hr":
      return <Box as="hr" marginBlock="10" borderColor="current.border" />;
    case "blockquote": {
      const attribution = node.data?.attribution as PullQuoteAttribution | undefined;
      return (
        <PullQuote
          size="feature"
          ramp="hibiscus"
          marginBlock="10"
          quoteFontSize={{ base: "xl", md: "2xl" }}
          quote={renderChildren(node, nested)}
          name={attribution?.name}
          role={attribution?.role ?? undefined}
          project={attribution?.organization ?? undefined}
        />
      );
    }
    case "embedded-asset-block": {
      const asset = ctx.assets[node.data?.target?.sys?.id];
      return asset ? <Figure asset={asset} caption={node.data?.caption} /> : null;
    }
    case "code-block":
      return (
        <Box
          as="pre"
          marginBottom="6"
          padding={{ base: "4", md: "5" }}
          borderRadius="2xl"
          overflowX="auto"
          backgroundImage="linear-gradient(135deg, {colors.hibiscus.true.900}, {colors.hibiscus.true.800})"
          color="gray.true.50"
          fontFamily="mono"
          fontSize="sm"
          lineHeight="tall"
          css={CODE_BLOCK_CSS}
        >
          <Box as="code" dangerouslySetInnerHTML={{ __html: node.data?.html ?? "" }} />
        </Box>
      );
    case "table":
      return (
        <Box marginBottom="6" overflowX="auto">
          <Table.Root size="sm" variant="outline" fontSize="sm">
            <Table.Body>{renderChildren(node, nested)}</Table.Body>
          </Table.Root>
        </Box>
      );
    case "table-row":
      return <Table.Row>{renderChildren(node, ctx)}</Table.Row>;
    case "table-header-cell":
      return <Table.ColumnHeader>{renderChildren(node, ctx)}</Table.ColumnHeader>;
    case "table-cell":
      return <Table.Cell>{renderChildren(node, ctx)}</Table.Cell>;
    default:
      return null;
  }
}

export interface ArticleBodyProps {
  body: RichTextNode;
  assets: Record<string, BlogAsset>;
}

export default function ArticleBody({ body, assets }: ArticleBodyProps) {
  return <>{renderNode(body, { assets, nested: false })}</>;
}

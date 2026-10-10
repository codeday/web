import * as m from "@codeday/i18n/messages";
import { getLocale } from "@codeday/i18n/runtime";
import { Box, Card, Eyebrow, Image } from "@codeday/topo/Atom";
import React from "react";

import { categoryLabel } from "@/lib/blog/categories";
import { formatPublishDate, imageUrl } from "@/lib/blog/format";
import type { BlogPostSummary } from "@/lib/blog/types";

export interface PostCardProps {
  post: BlogPostSummary;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Card
      asChild
      variant="plain"
      className="group"
      height="full"
      textDecoration="none"
      color="black"
      backgroundImage="linear-gradient(160deg, {colors.hibiscus.50} 0%, {colors.current.background} 100%)"
      transitionProperty="transform, border-color"
      transitionDuration="moderate"
      _hover={{ borderColor: "gray.400", transform: "translateY(calc({spacing.1} * -1))" }}
      focusVisibleRing="outside"
      focusRingColor="hibiscus.600"
    >
      <Box as="a" {...({ href: `/blog/${post.slug}` } as any)}>
        <Box display="flex" flexDirection="column" flex="1" paddingInline="5" paddingBlock="4">
          <Eyebrow color="hibiscus.600">{categoryLabel(post.category)}</Eyebrow>
          <Box
            as="h3"
            marginTop="2"
            fontSize="xl"
            fontWeight="700"
            lineHeight="shorter"
            letterSpacing="tight"
            _groupHover={{ textDecoration: "underline" }}
          >
            {post.title}
          </Box>
          <Box marginTop="2" fontSize="sm" lineHeight="moderate" color="current.textLight">
            {post.previewText}
          </Box>
          <Box marginTop="auto" paddingTop="4" fontSize="xs" color="current.textLight">
            <Box paddingTop="3" borderTopWidth="1px" borderColor="current.border">
              {post.author.name} · {formatPublishDate(post.publishDate, getLocale())} ·{" "}
              {m.www_blog_reading_time({ minutes: post.readingMinutes })}
            </Box>
          </Box>
        </Box>
        {post.previewImage && (
          <Box order={-1} padding="2" paddingBottom="0">
            <Image
              src={imageUrl(post.previewImage.url, 800)}
              alt={post.previewImage.alt}
              loading="lazy"
              width="full"
              aspectRatio="16/9"
              objectFit="cover"
              borderRadius="xl"
            />
          </Box>
        )}
      </Box>
    </Card>
  );
}

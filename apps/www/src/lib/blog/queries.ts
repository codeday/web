import { graphql } from "@/gql";

export const BlogPageQuery = graphql(`
  query BlogPageQuery($locale: String!) {
    ...PageComponent
  }
`);

export const BlogPostsQuery = graphql(`
  query BlogPostsQuery($locale: String!, $skip: Int!, $limit: Int!, $where: CmsBlogPostFilter!) {
    cms {
      blogPosts(
        where: $where
        order: [publishDate_DESC, sys_id_DESC]
        limit: $limit
        skip: $skip
        locale: $locale
      ) {
        total
        items {
          ...BlogPostSummary
        }
      }
    }
  }
`);

export const BlogFeaturedPostQuery = graphql(`
  query BlogFeaturedPostQuery($locale: String!) {
    cms {
      blogPosts(
        where: { featured: true }
        order: [publishDate_DESC, sys_id_DESC]
        limit: 1
        locale: $locale
      ) {
        items {
          ...BlogPostSummary
        }
      }
    }
  }
`);

export const BlogPostQuery = graphql(`
  query BlogPostQuery($locale: String!, $slug: String!) {
    cms {
      blogPosts(where: { slug: $slug }, limit: 1, locale: $locale) {
        items {
          ...BlogPostSummary
          subhead
          heroImageCaption
          heroImage {
            url
            description
            width
            height
          }
          body {
            json
            links {
              assets {
                block {
                  sys {
                    id
                  }
                  url
                  description
                  width
                  height
                  contentType
                }
              }
            }
          }
        }
      }
    }
  }
`);

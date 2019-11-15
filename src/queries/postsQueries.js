/* eslint-disable import/prefer-default-export */
import { graphql } from "gatsby"

export const postsFragment = graphql`
  fragment PostsFragment on MarkdownRemarkConnection {
    edges {
      post: node {
        excerpt(pruneLength: 200)
        id
        fields {
          slug
        }
        frontmatter {
          title
          description
          templateKey
          externalLink
          date(formatString: "MMMM DD, YYYY")
          tags
          featuredPost
          featuredImage {
            childImageSharp {
              fluid(maxWidth: 500, quality: 80) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
    }
  }
`

/* eslint-disable no-shadow */
/* eslint-disable react/prop-types */
/* eslint-disable react/require-default-props */
'use client'

import SEO from "../components/header/SEO"

import useRestoreScrollTop from "../contexts/useRestoreScrollTop"
import { IndexPageTemplate } from "./IndexPageTemplate"

const IndexPage = ({ jumbotronProps, blogPosts, portfolioItems, uri }) => {
  useRestoreScrollTop([uri])
  return (
    <>
      <SEO title="Home" />
      <IndexPageTemplate
        jumbotronProps={jumbotronProps}
        blogPosts={blogPosts}
        portfolioItems={portfolioItems}
      />
    </>
  )
}
// export const query = graphql`
//   query IndexPageTemplate {
//     markdownRemark(
//       frontmatter: {
//         templateKey: { eq: "IndexPage" }
//         isTemplate: { ne: true }
//       }
//     ) {
//       frontmatter {
//         jumbotronProps: jumbotron {
//           headline
//           subtitle
//           image {
//             childImageSharp {
//               fluid(maxWidth: 2048, quality: 80) {
//                 ...GatsbyImageSharpFluid
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// `

export default IndexPage

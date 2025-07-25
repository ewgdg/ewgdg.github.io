/* eslint-disable react/prop-types */
'use client'
import React from "react"
// import { graphql } from "gatsby"
import { useSearchParams } from 'next/navigation'
import SEO from "../components/header/SEO"
import useRestoreScrollTop from "../contexts/useRestoreScrollTop"
import useBlogPostCards from "../components/others/useBlogPostCards"
import { setComponentState } from "../contexts/useRestoreComponentState"
// import "../queries/postsQueries"
import { BlogPageTemplate } from "./BlogPageTemplate"

function BlogPage({ data, uri }) {
  const tableName = "blogTable"

  const searchParams = useSearchParams()
  const tags = searchParams.get('tags')  // will be null if not present

  if (tags) {
    setComponentState([uri, tableName, "keywords"], tags)
  }
  const { frontmatter } = data
  const location_hash = typeof window !== 'undefined' ? window.location.hash : null
  useRestoreScrollTop([uri], location_hash)
  // flatten blog data
  const cardTableDataList = useBlogPostCards(data.posts)
  return (
    <>
      <SEO title="Blog" />

      <BlogPageTemplate
        jumbotronProps={frontmatter.jumbotronProps}
        uri={uri}
        blogRollData={cardTableDataList}
        tableName={tableName}
      />
    </>
  )
}

export default BlogPage

// export const query = graphql`
//   query BlogPageTemplate {
//     markdownRemark(
//       frontmatter: { templateKey: { eq: "BlogPage" }, isTemplate: { ne: true } }
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
//     allMarkdownRemark(
//       sort: { order: DESC, fields: [frontmatter___date] }
//       filter: {
//         frontmatter: {
//           templateKey: { eq: "BlogPost" }
//           isPortfolio: { ne: true }
//           isTemplate: { ne: true }
//         }
//       }
//     ) {
//       ...PostsFragment
//     }
//   }
// `

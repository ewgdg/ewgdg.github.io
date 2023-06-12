/* eslint-disable react/prop-types */
import React from "react"
import { graphql } from "gatsby"
import * as queryString from "query-string"
import SEO from "../components/header/SEO"
import useRestoreScrollTop from "../contexts/useRestoreScrollTop"
import useFlattenMarkdownData from "../components/others/useFlattenMarkdownData"
import { setComponentState } from "../contexts/useRestoreComponentState"
import "../queries/postsQueries"
import { BlogPageTemplate } from "./BlogPageTemplate"

function BlogPage({ data, uri, location }) {
  const tableName = "blogTable"
  if (location.search) {
    const queryParams = queryString.parse(location.search)
    if (queryParams.tags) {
      setComponentState([uri, tableName, "keywords"], queryParams.tags)
    }
  }
  const { frontmatter } = data.markdownRemark
  useRestoreScrollTop([uri], location.hash)
  // flatten blog data
  const cardTableDataList = useFlattenMarkdownData(data.allMarkdownRemark)
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

export const query = graphql`
  query BlogPageTemplate {
    markdownRemark(
      frontmatter: { templateKey: { eq: "BlogPage" }, isTemplate: { ne: true } }
    ) {
      frontmatter {
        jumbotronProps: jumbotron {
          headline
          subtitle
          image {
            childImageSharp {
              fluid(maxWidth: 2048, quality: 80) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
    }
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      filter: {
        frontmatter: {
          templateKey: { eq: "BlogPost" }
          isPortfolio: { ne: true }
          isTemplate: { ne: true }
        }
      }
    ) {
      ...PostsFragment
    }
  }
`

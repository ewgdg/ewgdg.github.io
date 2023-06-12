/* eslint-disable no-shadow */
/* eslint-disable react/prop-types */
/* eslint-disable react/require-default-props */
import React from "react"
import { graphql } from "gatsby"

import PropTypes from "prop-types"

import SEO from "../components/header/SEO"

import useRestoreScrollTop from "../contexts/useRestoreScrollTop"
import { IndexPageTemplate } from "./IndexPageTemplate"

const IndexPage = ({ data, uri }) => {
  const { frontmatter } = data.markdownRemark
  useRestoreScrollTop([uri])
  return (
    <>
      <SEO title="Home" />
      <IndexPageTemplate jumbotronProps={frontmatter.jumbotronProps} />
    </>
  )
}
IndexPage.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      // eslint-disable-next-line react/forbid-prop-types
      frontmatter: PropTypes.object,
    }),
  }),
}
export const query = graphql`
  query IndexPageTemplate {
    markdownRemark(
      frontmatter: {
        templateKey: { eq: "IndexPage" }
        isTemplate: { ne: true }
      }
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
  }
`

export default IndexPage

/* eslint-disable react/prop-types */
import React from "react"
import { graphql } from "gatsby"

import SEO from "../components/header/SEO"

import useResetScrollTop from "../contexts/useResetScrollTop"
import { AboutPageTemplate } from "./AboutPageTemplate"

export default function AboutPage({ data }) {
  const { frontmatter } = data.markdownRemark
  const { facts } = frontmatter

  useResetScrollTop()
  return (
    <>
      <SEO title="About" />
      <AboutPageTemplate
        jumbotronProps={frontmatter.jumbotronProps}
        facts={facts}
      />
    </>
  )
}
export const query = graphql`
  query AboutPageTemplate {
    markdownRemark(
      frontmatter: {
        templateKey: { eq: "AboutPage" }
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
        facts {
          title
          description
          image {
            childImageSharp {
              fluid(maxWidth: 700, quality: 60) {
                ...GatsbyImageSharpFluid
              }
            }
          }
          links
        }
      }
    }
  }
`

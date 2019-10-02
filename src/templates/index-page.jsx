/* eslint-disable react/require-default-props */
import React from "react"
import { Link, graphql } from "gatsby"

import PropTypes from "prop-types"

import ObjectFitSection from "../components/decorators/ObjectFitSection"
import PageContainer from "../components/pageScroll/Container"
import Section from "../components/pageScroll/Section"
import HeaderContainer from "../components/header/HeaderContainer"
import Layout from "../components/Layout"

import SEO from "../components/Seo"

import PortfolioPreview from "../components/widgets/PortfolioPreview"
import AboutPreview from "../components/widgets/AboutPreview"
import BlogPreview from "../components/widgets/BlogPreview"

export const IndexPageTemplate = ({ jumbotronProps }) => {
  console.log(jumbotronProps)
  return (
    <PageContainer>
      <Section>
        <HeaderContainer
          headerProps={{ color: "white", position: "absolute" }}
          jumbotronProps={jumbotronProps}
        />
      </Section>
      <Section>
        <ObjectFitSection>
          <AboutPreview />
        </ObjectFitSection>
      </Section>
      <Section>
        <ObjectFitSection>
          <PortfolioPreview />
        </ObjectFitSection>
      </Section>
      <Section>
        <ObjectFitSection>
          <BlogPreview />
        </ObjectFitSection>
      </Section>
    </PageContainer>
  )
}
IndexPageTemplate.propTypes = {}

const IndexPage = ({ data }) => {
  const { frontmatter } = data.markdownRemark
  const image = frontmatter.jumbotronProps.image.childImageSharp.fluid
  return (
    <Layout>
      <SEO title="Home" />
      <IndexPageTemplate
        jumbotronProps={{ ...frontmatter.jumbotronProps, image }}
      />
    </Layout>
  )
}
IndexPage.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.object,
    }),
  }),
}
export const query = graphql`
  query IndexPageTemplate {
    markdownRemark(frontmatter: { templateKey: { eq: "index-page" } }) {
      frontmatter {
        jumbotronProps {
          headline
          subtitle
          image {
            childImageSharp {
              fluid(maxWidth: 2048, quality: 100) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
    }
  }
`
// export const query = graphql`
//   query {
//     fileName: file(relativePath: { eq: "45-cos-crop-upper.jpg" }) {
//       childImageSharp {
//         fluid(maxWidth: 1980) {
//           ...GatsbyImageSharpFluid
//         }
//       }
//     }
//   }
// `

export default IndexPage

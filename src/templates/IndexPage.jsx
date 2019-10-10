/* eslint-disable react/prop-types */
/* eslint-disable react/require-default-props */
import React from "react"
import { Link, graphql } from "gatsby"

import PropTypes from "prop-types"

import ParallaxSection from "../components/decorators/ParallaxSection"
import PageContainer from "../components/pageScroll/Container"
import Section from "../components/pageScroll/Section"
import HeaderContainer from "../components/header/HeaderContainer"
import Layout from "../components/Layout"

import SEO from "../components/Seo"

import PortfolioPreview from "../components/widgets/PortfolioPreview"
import AboutPreview from "../components/widgets/AboutPreview"
import BlogPreview from "../components/widgets/BlogPreview"
import Footer from "../components/footer/Footer"

export const IndexPageTemplate = ({ jumbotronProps }) => {
  return (
    <PageContainer>
      <Section>
        <HeaderContainer
          headerProps={{ color: "white", position: "absolute" }}
          jumbotronProps={jumbotronProps}
        />
      </Section>
      <Section>
        <ParallaxSection>
          <AboutPreview />
        </ParallaxSection>
      </Section>
      <Section>
        <ParallaxSection>
          <PortfolioPreview />
        </ParallaxSection>
      </Section>
      <Section>
        <ParallaxSection>
          <BlogPreview />
        </ParallaxSection>
      </Section>
      <Section style={{ height: "auto" }}>
        <Footer />
      </Section>
    </PageContainer>
  )
}
IndexPageTemplate.propTypes = {}

const IndexPage = ({ data }) => {
  const { frontmatter } = data.markdownRemark

  return (
    <Layout appendFooter={false}>
      <SEO title="Home" />
      <IndexPageTemplate jumbotronProps={frontmatter.jumbotronProps} />
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
    markdownRemark(frontmatter: { templateKey: { eq: "IndexPage" } }) {
      frontmatter {
        jumbotronProps: jumbotron {
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

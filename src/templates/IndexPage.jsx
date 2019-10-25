/* eslint-disable no-shadow */
/* eslint-disable react/prop-types */
/* eslint-disable react/require-default-props */
import React from "react"
import { graphql } from "gatsby"

import PropTypes from "prop-types"

import ParallaxSection from "../components/sections/ParallaxSection"
import PageContainer from "../components/pageScroll/Container"
import Section from "../components/pageScroll/Section"
import HeaderContainer from "../components/header/HeaderContainer"

import SEO from "../components/header/SEO"

import PortfolioWiget from "../components/widgets/PortfolioWidget"
import AboutWidget from "../components/widgets/AboutWidget"
import BlogWidget from "../components/widgets/BlogWidget"
import Footer from "../components/footer/Footer"
import useRestoreScrollTop from "../contexts/useRestoreScrollTop"

export const IndexPagePreview = ({ jumbotronProps }) => {
  return (
    <div>
      <HeaderContainer
        headerProps={{ color: "white", position: "absolute" }}
        jumbotronProps={jumbotronProps}
      />
    </div>
  )
}
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
          <AboutWidget />
        </ParallaxSection>
      </Section>
      <Section>
        <ParallaxSection>
          <PortfolioWiget />
        </ParallaxSection>
      </Section>
      <Section>
        <ParallaxSection>
          <BlogWidget />
        </ParallaxSection>
      </Section>
      <Section style={{ height: "auto" }}>
        <Footer />
      </Section>
    </PageContainer>
  )
}
IndexPageTemplate.propTypes = {}

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

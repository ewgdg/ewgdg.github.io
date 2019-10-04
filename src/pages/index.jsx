import React from "react"
import { Link, graphql } from "gatsby"

import PropTypes from "prop-types"

import ParallaxSection from "../components/decorators/ParallaxSection"
import PageContainer from "../components/pageScroll/Container"
import Section from "../components/pageScroll/Section"
import HeaderContainer from "../components/header/HeaderContainer"
import Layout from "../components/Layout"
import Image from "../components/Image"
import SEO from "../components/Seo"
import FlyingSprite from "../components/sprite/FlyingSprite"
import Synap from "../components/background/Synap"
import AboutPreview from "../components/widgets/AboutPreview"
import testImg from "../images/45-cos-crop-upper.jpg"
import BlogPreview from "../components/widgets/BlogPreview"
import PortfolioPreview from "../components/widgets/PortfolioPreview"

const IndexPage = ({ data }) => {
  return (
    <Layout>
      <SEO title="Home" />
      <ParallaxSection>
        <About3 />
      </ParallaxSection>
      <About2 />
      <div
        style={{
          width: "800px",
          height: "800px",
          backgroundColor: "transparent",
          position: "static",
        }}
      />
      <Synap style={{ opacity: 0.3, width: "100%", height: "100vh" }} />
      {/* <PageContainer>
        <Section>
          <ObjectFitSection> */}
      <HeaderContainer
        imageFluid={data.fileName.childImageSharp.fluid}
        headerProps={{ color: "white", position: "absolute" }}
      />

      {/* <img src={testImg} alt="" style={{ height: "100vh" }} /> */}
      {/* </ObjectFitSection>
        </Section>
      </PageContainer> */}
      <div
        style={{
          width: "800px",
          height: "800px",
          backgroundColor: "transparent",
          position: "static",
        }}
      />

      <About />

      <div
        style={{
          width: "800px",
          height: "800px",
          backgroundColor: "transparent",
          position: "static",
        }}
      />

      <h1>Hi people</h1>
      <p>Welcome to your new Gatsby site.</p>
      <p>Now go build something great.</p>
      <div style={{ maxWidth: "300px", marginBottom: "1.45rem" }}>
        <Image />
      </div>
      <Link to="/page-2/">Go to page 2</Link>
    </Layout>
  )
}
IndexPage.propTypes = {
  data: PropTypes.shape({
    fileName: PropTypes.any,
  }).isRequired,
}

export const query = graphql`
  query {
    fileName: file(relativePath: { eq: "45-cos-crop-upper.jpg" }) {
      childImageSharp {
        fluid(maxWidth: 1980) {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
`
export default IndexPage

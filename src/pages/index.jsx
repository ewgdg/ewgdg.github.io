import React from "react"
import { Link, graphql } from "gatsby"

import PropTypes from "prop-types"
import PageContainer from "../components/pageScroll/Container"
import Section from "../components/pageScroll/Section"
import HeaderContainer from "../components/header/HeaderContainer"
import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"
import FlyingSprite from "../components/sprite/FlyingSprite"

const IndexPage = ({ data }) => {
  return (
    <Layout>
      <SEO title="Home" />
      {/* <PageContainer>
        <Section>
          <HeaderContainer
            imageFluid={data.fileName.childImageSharp.fluid}
            headerProps={{ color: "white", position: "absolute" }}
          />
        </Section>
      </PageContainer> */}
      <div
        style={{
          width: "800px",
          height: "800px",
          backgroundColor: "transparent",
          position: "relative",
          zIndex: "5",
        }}
      />
      <FlyingSprite />
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

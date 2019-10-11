/* eslint-disable react/prop-types */
import React, { useEffect, useRef } from "react"
import { graphql } from "gatsby"
import uuid from "uuid/v4"
import GridList from "@material-ui/core/GridList"
import GridListTile from "@material-ui/core/GridListTile"
import { makeStyles } from "@material-ui/styles"
import Grid from "@material-ui/core/Grid"
import Layout from "../components/layouts/PersistedLayout"
import SEO from "../components/Seo"
import HeaderContainer from "../components/header/HeaderContainer"
import Bubble from "../components/bubbles/Bubble"
import ParallaxSection from "../components/sections/ParallaxSection"
import BubbleTank from "../components/bubbles/BubbleTank"
import Footer from "../components/footer/Footer"
import useResetScrollTop from "../contexts/useResetScrollTop"

export const AboutPageTemplate = ({ jumbotronProps, facts }) => {
  const tileData = []
  tileData.length = 20
  tileData.fill(1)
  const cellHeight = 200
  const cellsPerRow = 5

  return (
    <div>
      <HeaderContainer
        headerProps={{ color: "white", position: "absolute" }}
        jumbotronProps={jumbotronProps}
      />
      <BubbleTank
        data={facts}
        cellHeight={cellHeight}
        cellsPerRow={cellsPerRow}
        header="Some fun facts about me"
      />
      <Footer />
    </div>
  )
}

export default function AboutPage({ data }) {
  const { frontmatter } = data.markdownRemark
  const { facts } = frontmatter

  useResetScrollTop()
  return (
    <>
      <SEO title="Home" />
      <AboutPageTemplate
        jumbotronProps={frontmatter.jumbotronProps}
        facts={facts}
      />
    </>
  )
}
export const query = graphql`
  query AboutPageTempate {
    markdownRemark(frontmatter: { templateKey: { eq: "AboutPage" } }) {
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
        facts {
          title
          description
          image {
            childImageSharp {
              fluid(maxWidth: 700, quality: 80) {
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

/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Container from "@material-ui/core/Container"

import ImageBasedCard from "../thumbnail/ImageBasedCard"
import CardDivision from "../thumbnail/CardDivision"
import AnimatedTitle from "../titles/AnimatedTitle"

import FlexContainer from "../sections/FlexContainer"
import useFlattenMarkdownData from "../others/useFlattenMarkdownData"
import SlideInSection from "../sections/SlideInSection"
// import "../../queries/postsQueries" //no need, gatsby export it to global space

function PortfolioPreview() {
  const { allMarkdownRemark } = useStaticQuery(graphql`
    query {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 2
        filter: {
          frontmatter: { isPortfolio: { eq: true }, featuredPost: { eq: true } }
        }
      ) {
        ...PostsFragment
      }
    }
  `)
  const flatten = useFlattenMarkdownData(allMarkdownRemark)

  return (
    <FlexContainer>
      <Container style={{ maxHeight: "100%" }}>
        <div style={{ textAlign: "center" }}>
          <AnimatedTitle title="Games" />
          <p>I enjoy gaming, and I made myself some small games:</p>
        </div>
        <SlideInSection>
          <CardDivision>
            {flatten.map((postProps, i) => (
              <ImageBasedCard key={i} {...postProps} />
            ))}
          </CardDivision>
        </SlideInSection>
      </Container>
    </FlexContainer>
  )
}

export default PortfolioPreview

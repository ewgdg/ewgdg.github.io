'use client'

/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
import React from "react"
// GraphQL queries will be replaced with static data or API calls
import Container from "@mui/material/Container"

import ImageBasedCard from "../thumbnail/ImageBasedCard"
import CardDivision from "../thumbnail/CardDivision"
import AnimatedTitle from "../titles/AnimatedTitle"

import FlexContainer from "../sections/FlexContainer"
import useBlogPostCards from "../others/useBlogPostCards"
import SlideInSection from "../sections/SlideInSection"
// import "../../queries/postsQueries" // Removed Gatsby query

function PortfolioPreview({ portfolioItems = [] }) {
  const flatten = useBlogPostCards(portfolioItems)

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

'use client'

/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
import React from "react"
// GraphQL queries will be replaced with static data or API calls
import Container from "@mui/material/Container"

import ImageBasedCard from "../thumbnail/image-based-card"
import CardDivision from "../thumbnail/card-division"
import AnimatedTitle from "../titles/animated-title"

import FlexContainer from "../sections/flex-container"
import useBlogPostCards from "../others/use-blog-post-cards"
import SlideInSection from "../sections/slide-in-section"

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

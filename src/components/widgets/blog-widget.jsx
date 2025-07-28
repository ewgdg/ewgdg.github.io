'use client'

/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
import React from "react"
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid"
import Button from "@mui/material/Button"
// GraphQL queries will be replaced with static data or API calls
import MediaCard from "../thumbnail/media-card"
import CardDivision from "../thumbnail/card-division"
import StyledTitle from "../titles/styled-title"
import FlexContainer from "../sections/flex-container"
import useBlogPostCards from "../others/use-blog-post-cards"
import FadeInSection from "../sections/fade-in-section"

function BlogPreview({ blogPosts = [] }) {
  const flatten = useBlogPostCards(blogPosts)
  return (
    <FlexContainer>
      <Container style={{ maxHeight: "100%", height: "600px" }}>
        <div style={{ height: "15%" }}>
          <StyledTitle title="Blog" style={{ height: "50%" }} />
          <p
            style={{
              display: "block",
              textAlign: "center",
              height: "50%",
              boxSizing: "border-box",
            }}
          >
            Know what I am thinking:
          </p>
        </div>
        {/* use fade in instead of slide in bc text rendering stutters when animated */}
        <FadeInSection>
          <CardDivision style={{ marginBottom: "25px" }}>
            {flatten.map((cardData, i) => (
              <MediaCard {...cardData} key={i} />
            ))}
          </CardDivision>
        </FadeInSection>
        <Grid
          container
          justifyContent="center"
          alignItems="flex-end"
          style={{ maxHeight: "10%" }}
        >
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              window.location.href = "/blog"
            }}
          >
            View more
          </Button>
        </Grid>
      </Container>
    </FlexContainer>
  )
}

export default BlogPreview

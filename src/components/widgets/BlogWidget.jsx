/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
import React from "react"
import Container from "@material-ui/core/Container"
import Grid from "@material-ui/core/Grid"
import Button from "@material-ui/core/Button"
import { graphql, useStaticQuery, navigate } from "gatsby"
import MediaCard from "../thumbnail/MediaCard"
import CardContainer from "../thumbnail/CardContainer"
import StyledTitle from "../titles/StyledTitle"
import FlexContainer from "../sections/FlexContainer"
import useFlattenMarkdownData from "../others/useFlattenMarkdownData"
import SlideInSection from "../sections/SlideInSection"

function BlogPreview() {
  const { allMarkdownRemark } = useStaticQuery(graphql`
    query {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 2
        filter: {
          frontmatter: {
            templateKey: { eq: "BlogPost" }
            featuredPost: { eq: true }
            isPortfolio: { ne: true }
            isTemplate: { ne: true }
          }
        }
      ) {
        edges {
          post: node {
            excerpt(pruneLength: 400)
            id
            fields {
              slug
            }
            frontmatter {
              title
              description
              templateKey
              date(formatString: "MMMM DD, YYYY")
              tags
              featuredPost
              featuredImage {
                childImageSharp {
                  fluid(maxWidth: 500, quality: 100) {
                    ...GatsbyImageSharpFluid
                  }
                }
              }
            }
          }
        }
      }
    }
  `)
  const flatten = useFlattenMarkdownData(allMarkdownRemark)
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
        <div style={{ height: "75%" }}>
          <SlideInSection>
            <CardContainer style={{ marginBottom: "25px" }}>
              {flatten.map((cardData, i) => (
                <MediaCard {...cardData} key={i} />
              ))}
            </CardContainer>
          </SlideInSection>
        </div>
        <Grid
          container
          justify="center"
          alignItems="flex-end"
          style={{ maxHeight: "10%" }}
        >
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              navigate("/blog")
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

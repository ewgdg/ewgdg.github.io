/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Container from "@material-ui/core/Container"

import ImageBasedCard from "../thumbnail/ImageBasedCard"
import CardContainer from "../thumbnail/CardContainer"
import AnimatedTitle from "../titles/AnimatedTitle"

import FlexContainer from "../sections/FlexContainer"
import useFlattenMarkdownData from "../others/useFlattenMarkdownData"
import SlideInSection from "../sections/SlideInSection"

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
              externalLink
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
      <Container style={{ maxHeight: "100%" }}>
        <div style={{ textAlign: "center" }}>
          <AnimatedTitle title="Games" />
          <p>I enjoy gaming, and I made myself some small games:</p>
        </div>
        <SlideInSection>
          <CardContainer>
            {flatten.map((postProps, i) => (
              <ImageBasedCard key={i} {...postProps} />
            ))}
          </CardContainer>
        </SlideInSection>
      </Container>
    </FlexContainer>
  )
}

export default PortfolioPreview

import React, { useEffect, useContext, useRef } from "react"
import { TweenMax, TimelineLite, Power2 } from "gsap/TweenMax"
import "gsap/TextPlugin"
import { getController, ScrollMagic } from "plugins/scrollmagic"
import LayoutContext from "contexts/LayoutContext"
import Jumbotron from "components/header/Jumbotron"
import { useStaticQuery, graphql } from "gatsby"
import MediaCard from "components/thumbnail/MediaCard"
import ImageBasedCard from "components/thumbnail/ImageBasedCard"
import CardContainer from "components/thumbnail/CardContainer"
import AnimatedTitle from "components/titles/AnimatedTitle"
import Container from "@material-ui/core/Container"
import ParallaxSection from "../sections/ParallaxSection"
import FlexContainer from "../sections/FlexContainer"

function PortfolioPreview() {
  return (
    <FlexContainer>
      <Container style={{ maxHeight: "100%" }}>
        <div style={{ textAlign: "center" }}>
          <AnimatedTitle title="Games" />
          <p>I enjoy gaming, and I made myself some small games:</p>
        </div>

        <CardContainer>
          <ImageBasedCard />
          <ImageBasedCard />
        </CardContainer>
      </Container>
    </FlexContainer>
  )
}

export default PortfolioPreview

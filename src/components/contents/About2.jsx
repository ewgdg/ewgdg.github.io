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
import AnimatedTitle from "components/heading/AnimatedTitle"
import Container from "@material-ui/core/Container"
import ObjectFitSection from "../landing/ObjectFitSection"

function About2() {
  return (
    <Container>
      <div style={{ textAlign: "center" }}>
        <AnimatedTitle title="Games" />
        <p>I enjoy gaming, and I made myself some small games:</p>

        <div>
          <CardContainer>
            <ImageBasedCard />

            <ImageBasedCard />
          </CardContainer>
        </div>
      </div>
    </Container>
  )
}

export default About2

/* eslint-disable react/prop-types */
'use client'
import React from "react"
import HeaderContainer from "../components/header/header-container"
import Footer from "../components/footer/footer"
import PageContainer, { SectionTypes } from "../components/page-scroll/container"
import Section from "../components/page-scroll/section"
import BubbleTank from "../components/bubbles/bubble-tank"

export function AboutPagePreview({ jumbotronProps }) {
  return (
    <div>
      <HeaderContainer
        headerProps={{ color: "white", position: "absolute" }}
        jumbotronProps={jumbotronProps}
      />
    </div>
  )
}

export function AboutPageTemplate({ jumbotronProps, facts }) {
  const tileData = []
  tileData.length = 20
  tileData.fill(1)
  const cellHeight = 200
  const cellsPerRow = 5

  return (
    <div>
      <PageContainer sectionType={SectionTypes.Flexible}>
        <Section>
          <HeaderContainer
            headerProps={{ color: "white", position: "absolute" }}
            jumbotronProps={jumbotronProps}
          />
        </Section>
        <BubbleTank
          data={facts}
          cellHeight={cellHeight}
          cellsPerRow={cellsPerRow}
          header="Some fun facts about me"
        />
        <Section height="auto">
          <Footer />
        </Section>
      </PageContainer>
    </div>
  )
}

export default AboutPageTemplate

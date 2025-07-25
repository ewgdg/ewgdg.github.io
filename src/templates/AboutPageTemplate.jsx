/* eslint-disable react/prop-types */
'use client'
import React from "react"
import HeaderContainer from "../components/header/HeaderContainer"
import Footer from "../components/footer/Footer"
import PageContainer, { SectionTypes } from "../components/pageScroll/Container"
import Section from "../components/pageScroll/Section"
import BubbleTank from "../components/bubbles/BubbleTank"

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

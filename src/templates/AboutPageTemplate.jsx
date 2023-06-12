/* eslint-disable react/prop-types */
import React from "react"
import HeaderContainer from "../components/header/HeaderContainer"
import BubbleTank from "../components/bubbles/BubbleTank"
import Footer from "../components/footer/Footer"
import PageContainer, { SectionTypes } from "../components/pageScroll/Container"
import Section from "../components/pageScroll/Section"

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
      <PageContainer sectionType={SectionTypes.LongSection}>
        <Section>
          <HeaderContainer
            headerProps={{ color: "white", position: "absolute" }}
            jumbotronProps={jumbotronProps}
          />
        </Section>
        <Section height="auto">
          <BubbleTank
            data={facts}
            cellHeight={cellHeight}
            cellsPerRow={cellsPerRow}
            header="Some fun facts about me"
          />
        </Section>
        <Section height="auto">
          <Footer />
        </Section>
      </PageContainer>
    </div>
  )
}

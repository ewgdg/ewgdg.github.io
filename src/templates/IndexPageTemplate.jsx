/* eslint-disable react/prop-types */
import React from "react"
import ParallaxSection from "../components/sections/ParallaxSection"
import PageContainer from "../components/pageScroll/Container"
import Section from "../components/pageScroll/Section"
import HeaderContainer from "../components/header/HeaderContainer"
import PortfolioWidget from "../components/widgets/PortfolioWidget"
import AboutWidget from "../components/widgets/AboutWidget"
import BlogWidget from "../components/widgets/BlogWidget"
import Footer from "../components/footer/Footer"

export function IndexPagePreview({ jumbotronProps }) {
  return (
    <div>
      <HeaderContainer
        headerProps={{ color: "white", position: "absolute" }}
        jumbotronProps={jumbotronProps}
      />
    </div>
  )
}

export function IndexPageTemplate({ jumbotronProps }) {
  return (
    <PageContainer>
      <Section>
        <HeaderContainer
          headerProps={{ color: "white", position: "absolute", chatbox: true }}
          jumbotronProps={jumbotronProps}
        />
      </Section>
      <Section>
        <ParallaxSection>
          <AboutWidget />
        </ParallaxSection>
      </Section>
      <Section>
        <ParallaxSection>
          <PortfolioWidget />
        </ParallaxSection>
      </Section>
      <Section>
        <ParallaxSection>
          <BlogWidget />
        </ParallaxSection>
      </Section>
      <Section height="auto">
        <Footer />
      </Section>
    </PageContainer>
  )
}

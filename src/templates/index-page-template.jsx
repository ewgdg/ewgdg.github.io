/* eslint-disable react/prop-types */
'use client'
import React from "react"
import ParallaxSection from "../components/sections/parallax-section"
import PageContainer from "../components/page-scroll/container"
import Section from "../components/page-scroll/section"
import HeaderContainer from "../components/header/header-container"
import PortfolioWidget from "../components/widgets/portfolio-widget"
import AboutWidget from "../components/widgets/about-widget"
import BlogWidget from "../components/widgets/blog-widget"
import Footer from "../components/footer/footer"

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

export function IndexPageTemplate({ jumbotronProps, blogPosts, portfolioItems }) {
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
          <PortfolioWidget portfolioItems={portfolioItems} />
        </ParallaxSection>
      </Section>
      <Section>
        <ParallaxSection>
          <BlogWidget blogPosts={blogPosts} />
        </ParallaxSection>
      </Section>
      <Section height="auto">
        <Footer />
      </Section>
    </PageContainer>
  )
}

/* eslint-disable react/prop-types */
'use client'
import React, { useEffect, useState } from "react"
import { useSearchParams } from 'next/navigation'
import { debounce } from "../lib/performance/throttle"
import CardTable from "../components/thumbnail/card-table"
import useBlogPostCards from "../components/others/use-blog-post-cards"
import PageContainer from "../components/page-scroll/container"
import Section from "../components/page-scroll/section"
import HeaderContainer from "../components/header/header-container"
import Footer from "../components/footer/footer"
import ParallaxSection from "../components/sections/parallax-section"
import { setComponentState } from "../lib/contexts/use-restore-component-state"
import useLayoutContext from "../lib/contexts/use-layout-context"
import { calcViewportHeight } from "../lib/dom/viewport"

function BlogPagePreview({ jumbotronProps }) {
  return (
    <HeaderContainer
      headerProps={{ color: "white", position: "absolute" }}
      jumbotronProps={jumbotronProps}
    />
  )
}

function BlogPageFrame({ jumbotronProps, children }) {
  return (
    <div>
      <PageContainer>
        <Section>
          <HeaderContainer
            headerProps={{ color: "white", position: "absolute" }}
            jumbotronProps={jumbotronProps}
          />
        </Section>
        {children}
        <Section height="auto">
          <Footer />
        </Section>
      </PageContainer>
    </div>
  )
}

function BlogCardsLoadingSection() {
  return (
    <Section id="search">
      <ParallaxSection innerDivStyle={{ height: calcViewportHeight(100) }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            color: "white",
          }}
        >
          Loading posts...
        </div>
      </ParallaxSection>
    </Section>
  )
}

function BlogCardsSection({
  uri,
  blogRollData,
  tableName = "blogTable",
}) {
  const [itemsPerPage, setItemsPerPage] = useState(4)
  useEffect(() => {
    function calculateItemsPerPage() {
      let items = 4
      if (window.innerHeight < 625) {
        items = 2
      }
      return items
    }
    setItemsPerPage(calculateItemsPerPage())
    const onresize = debounce(() => {
      setItemsPerPage(calculateItemsPerPage())
    }, 100)
    window.addEventListener("resize", onresize)

    return () => {
      window.removeEventListener("resize", onresize)
    }
  }, [])

  return (
    <Section id="search">
      <ParallaxSection innerDivStyle={{ height: calcViewportHeight(100) }}>
        <CardTable
          datalist={blogRollData}
          name={tableName}
          uri={uri}
          itemsPerPage={itemsPerPage}
        />
      </ParallaxSection>
    </Section>
  )
}

function BlogPostsSection({ posts, uri, tableName = "blogTable" }) {
  const searchParams = useSearchParams()
  const tags = searchParams.get('tags')
  const context = useLayoutContext()

  if (tags) {
    setComponentState([uri, tableName, "keywords"], tags, context)
  }

  const blogRollData = useBlogPostCards(posts)

  return (
    <BlogCardsSection
      blogRollData={blogRollData}
      tableName={tableName}
      uri={uri}
    />
  )
}

function BlogPageTemplate({
  jumbotronProps,
  uri,
  blogRollData,
  tableName = "blogTable",
}) {
  return (
    <BlogPageFrame jumbotronProps={jumbotronProps}>
      <BlogCardsSection
        blogRollData={blogRollData}
        tableName={tableName}
        uri={uri}
      />
    </BlogPageFrame>
  )
}

export { BlogCardsLoadingSection, BlogCardsSection, BlogPageFrame, BlogPageTemplate, BlogPagePreview, BlogPostsSection }
export default BlogPageTemplate

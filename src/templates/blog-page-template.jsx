/* eslint-disable react/prop-types */
'use client'
import React, { Suspense, useEffect, useState } from "react"
import { useSearchParams } from 'next/navigation'
import { debounce } from "../lib/performance/throttle"
import CardTable from "../components/thumbnail/card-table"
import useBlogPostCards from "../components/others/use-blog-post-cards"
import PageContainer from "../components/page-scroll/container"
import Section from "../components/page-scroll/section"
import HeaderContainer from "../components/header/header-container"
import Footer from "../components/footer/footer"
import ParallaxSection from "../components/sections/parallax-section"
import { calcViewportHeight } from "../lib/dom/viewport"

function BlogPagePreview({ jumbotronProps }) {
  return (
    <HeaderContainer
      headerProps={{ color: "white", position: "absolute" }}
      jumbotronProps={jumbotronProps}
    />
  )
}

function BlogPageFrame({
  jumbotronProps,
  children,
  enabled = true,
  ...pageContainerProps
}) {
  return (
    <PageContainer enabled={enabled} {...pageContainerProps}>
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
  )
}

function BlogCardsSection({
  blogRollData,
  initialKeywords = "",
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
          requestedKeywords={initialKeywords}
          itemsPerPage={itemsPerPage}
        />
      </ParallaxSection>
    </Section>
  )
}

function BlogTagFilter({ onChange }) {
  const searchParams = useSearchParams()
  const tags = searchParams.get('tags') || ''

  useEffect(() => {
    if (tags) onChange(tags)
  }, [onChange, tags])

  return null
}

function BlogPostsSection({ posts }) {
  const [requestedKeywords, setRequestedKeywords] = useState('')
  const blogRollData = useBlogPostCards(posts)

  return (
    <>
      <BlogCardsSection
        blogRollData={blogRollData}
        initialKeywords={requestedKeywords}
      />
      <Suspense fallback={null}>
        <BlogTagFilter onChange={setRequestedKeywords} />
      </Suspense>
    </>
  )
}

export { BlogPageFrame, BlogPagePreview, BlogPostsSection }

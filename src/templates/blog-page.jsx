/* eslint-disable react/prop-types */
'use client'
import React from "react"
import { useSearchParams } from 'next/navigation'
import SEO from "../components/header/seo"
import useRestoreScrollTop from "../lib/contexts/use-restore-scroll-top"
import useBlogPostCards from "../components/others/use-blog-post-cards"
import { setComponentState } from "../lib/contexts/use-restore-component-state"
import useLayoutContext from "../lib/contexts/use-layout-context"
import { BlogPageTemplate } from "./blog-page-template"

function BlogPage({ data, uri }) {
  const tableName = "blogTable"

  const searchParams = useSearchParams()
  const tags = searchParams.get('tags')  // will be null if not present

  const context = useLayoutContext()
  if (tags) {
    setComponentState([uri, tableName, "keywords"], tags, context)
  }
  const { frontmatter } = data
  const location_hash = typeof window !== 'undefined' ? window.location.hash : null
  useRestoreScrollTop([uri], location_hash)
  // flatten blog data
  const cardTableDataList = useBlogPostCards(data.posts)
  return (
    <>
      <SEO title="Blog" />

      <BlogPageTemplate
        jumbotronProps={frontmatter.jumbotronProps}
        uri={uri}
        blogRollData={cardTableDataList}
        tableName={tableName}
      />
    </>
  )
}

export default BlogPage


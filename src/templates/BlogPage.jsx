/* eslint-disable react/prop-types */
'use client'
import React from "react"
import { useSearchParams } from 'next/navigation'
import SEO from "../components/header/SEO"
import useRestoreScrollTop from "../contexts/useRestoreScrollTop"
import useBlogPostCards from "../components/others/useBlogPostCards"
import { setComponentState } from "../contexts/useRestoreComponentState"
import useLayoutContext from "../contexts/useLayoutContext"
import { BlogPageTemplate } from "./BlogPageTemplate"

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


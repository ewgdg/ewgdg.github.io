/* eslint-disable no-shadow */
/* eslint-disable react/prop-types */
/* eslint-disable react/require-default-props */
'use client'

import SEO from "../components/header/seo"

import useRestoreScrollTop from "../lib/contexts/use-restore-scroll-top"
import { IndexPageTemplate } from "./index-page-template"

const IndexPage = ({ jumbotronProps, blogPosts, portfolioItems, uri }) => {
  useRestoreScrollTop([uri])
  return (
    <>
      <SEO title="Home" />
      <IndexPageTemplate
        jumbotronProps={jumbotronProps}
        blogPosts={blogPosts}
        portfolioItems={portfolioItems}
      />
    </>
  )
}

export default IndexPage

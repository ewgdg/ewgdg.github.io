/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/no-danger */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
'use client'
import React from "react"
// import { kebabCase } from "lodash"

import "github-markdown-css/github-markdown-light.css"
import "prismjs/themes/prism.css"
import "prismjs/plugins/line-numbers/prism-line-numbers.css"

import Footer from "../components/footer/footer"
import HeaderContainer from "../components/header/header-container"

import useRestoreScrollTop from "../lib/contexts/use-restore-scroll-top"
import { BlogPostTemplate, useStyles } from "./blog-post-template"

const BlogPost = ({ data, uri }) => {
  const post = data
  useRestoreScrollTop([uri])
  const classes = useStyles()
  return (
    <div className={classes.pageContainer}>
      <HeaderContainer
        headerProps={{
          color: "black",
          position: "static",
          style: { boxShadow: "none" },
        }}
      />
      <BlogPostTemplate
        content={post.processedContent}
        description={post.frontmatter.description}
        publicationDate={post.frontmatter.date}
        lastModified={post.frontmatter.lastModified}
        // helmet={
        //   <Helmet titleTemplate="%s | Blog">
        //     <title>{`${post.frontmatter.title}`}</title>
        //     <meta
        //       name="description"
        //       content={`${post.frontmatter.description}`}
        //     />
        //   </Helmet>
        // }
        tags={post.frontmatter.tags}
        title={post.frontmatter.title}
        includeBackButton={!post.frontmatter.isPortfolio}
        featuredImage={post.frontmatter.featuredImage}
      />
      <Footer className="footer" />
    </div>
  )
}

export default BlogPost

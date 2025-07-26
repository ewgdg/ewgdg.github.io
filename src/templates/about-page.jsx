/* eslint-disable react/prop-types */
'use client'
import React from "react"

import SEO from "../components/header/seo"

import useResetScrollTop from "../lib/contexts/use-reset-scroll-top"
import { AboutPageTemplate } from "./about-page-template"

export default function AboutPage({ data }) {
  const { frontmatter } = data.markdownRemark
  const { facts } = frontmatter

  useResetScrollTop()
  return (
    <>
      <SEO title="About" />
      <AboutPageTemplate
        jumbotronProps={frontmatter.jumbotronProps}
        facts={facts}
      />
    </>
  )
}

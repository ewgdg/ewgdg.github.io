/* eslint-disable react/prop-types */
'use client'
import React from "react"

import SEO from "../components/header/SEO"

import useResetScrollTop from "../contexts/useResetScrollTop"
import { AboutPageTemplate } from "./AboutPageTemplate"

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

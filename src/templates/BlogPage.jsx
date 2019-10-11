/* eslint-disable react/prop-types */
import React, { useCallback, useLayoutEffect } from "react"
import { graphql } from "gatsby"
import CardTable from "../components/thumbnail/CardTable"
import Layout from "../components/layouts/PersistedLayout"
import SEO from "../components/Seo"
import PageContainer from "../components/pageScroll/Container"
import Section from "../components/pageScroll/Section"
import HeaderContainer from "../components/header/HeaderContainer"
import Footer from "../components/footer/Footer"

import useRestoreScrollTop from "../contexts/useRestoreScrollTop"

function BlogPageTemplate({ jumbotronProps, uri }) {
  const data = []
  data.length = 10
  data.fill("1")

  return (
    <div>
      <PageContainer>
        <Section>
          <HeaderContainer
            headerProps={{ color: "white", position: "absolute" }}
            jumbotronProps={jumbotronProps}
          />
        </Section>
        <Section>
          <CardTable datalist={data} name="BlogTable" uri={uri} />
        </Section>
        <Section style={{ height: "auto" }}>
          <Footer />
        </Section>
      </PageContainer>
    </div>
  )
}
export { BlogPageTemplate }

function BlogPage({ data, uri }) {
  const { frontmatter } = data.markdownRemark
  useRestoreScrollTop([uri])

  return (
    <>
      <SEO title="Blog" />

      <BlogPageTemplate jumbotronProps={frontmatter.jumbotronProps} uri={uri} />
    </>
  )
}

export default BlogPage

export const query = graphql`
  query BlogPageTemplate {
    markdownRemark(frontmatter: { templateKey: { eq: "BlogPage" } }) {
      frontmatter {
        jumbotronProps: jumbotron {
          headline
          subtitle
          image {
            childImageSharp {
              fluid(maxWidth: 2048, quality: 100) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
    }
  }
`

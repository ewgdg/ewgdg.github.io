/* eslint-disable react/prop-types */
import React, { useCallback, useLayoutEffect, useEffect, useState } from "react"
import { graphql } from "gatsby"
import { debounce } from "utilities/throttle"
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
  const [itemsPerPage, setItemsPerPage] = useState(4)
  console.log(itemsPerPage)
  useEffect(() => {
    function calculateItemsPerPage() {
      let items = 4
      console.log(window.innerHeight)
      if (window.innerHeight < 600) {
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
    <div>
      <PageContainer>
        <Section>
          <HeaderContainer
            headerProps={{ color: "white", position: "absolute" }}
            jumbotronProps={jumbotronProps}
          />
        </Section>
        <Section>
          <CardTable
            datalist={data}
            name="BlogTable"
            uri={uri}
            itemsPerPage={itemsPerPage}
          />
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

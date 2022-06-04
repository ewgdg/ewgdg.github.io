/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react"
import { graphql } from "gatsby"
import * as queryString from "query-string"
import { debounce } from "../utils/throttle"
import CardTable from "../components/thumbnail/CardTable"
import SEO from "../components/header/SEO"
import PageContainer from "../components/pageScroll/Container"
import Section from "../components/pageScroll/Section"
import HeaderContainer from "../components/header/HeaderContainer"
import Footer from "../components/footer/Footer"
import useRestoreScrollTop from "../contexts/useRestoreScrollTop"
import useFlattenMarkdownData from "../components/others/useFlattenMarkdownData"
import { setComponentState } from "../contexts/useRestoreComponentState"
import "../queries/postsQueries"
import ParallaxSection from "../components/sections/ParallaxSection"

function BlogPagePreview({ jumbotronProps }) {
  return (
    <HeaderContainer
      headerProps={{ color: "white", position: "absolute" }}
      jumbotronProps={jumbotronProps}
    />
  )
}

function BlogPageTemplate({
  jumbotronProps,
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
    <div>
      <PageContainer>
        <Section>
          <HeaderContainer
            headerProps={{ color: "white", position: "absolute" }}
            jumbotronProps={jumbotronProps}
          />
        </Section>
        <Section id="search">
          <ParallaxSection innerDivStyle={{ height: "100vh" }}>
            <CardTable
              datalist={blogRollData}
              name={tableName}
              uri={uri}
              itemsPerPage={itemsPerPage}
            />
          </ParallaxSection>
        </Section>
        <Section height="auto">
          <Footer />
        </Section>
      </PageContainer>
    </div>
  )
}
export { BlogPageTemplate, BlogPagePreview }

function BlogPage({ data, uri, location }) {
  const tableName = "blogTable"
  if (location.search) {
    const queryParams = queryString.parse(location.search)
    if (queryParams.tags) {
      setComponentState([uri, tableName, "keywords"], queryParams.tags)
    }
  }
  const { frontmatter } = data.markdownRemark
  useRestoreScrollTop([uri], location.hash)
  // flatten blog data
  const cardTableDataList = useFlattenMarkdownData(data.allMarkdownRemark)
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

export const query = graphql`
  query BlogPageTemplate {
    markdownRemark(
      frontmatter: { templateKey: { eq: "BlogPage" }, isTemplate: { ne: true } }
    ) {
      frontmatter {
        jumbotronProps: jumbotron {
          headline
          subtitle
          image {
            childImageSharp {
              fluid(maxWidth: 2048, quality: 80) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
    }
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      filter: {
        frontmatter: {
          templateKey: { eq: "BlogPost" }
          isPortfolio: { ne: true }
          isTemplate: { ne: true }
        }
      }
    ) {
      ...PostsFragment
    }
  }
`

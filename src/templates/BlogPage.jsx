/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react"
import { graphql } from "gatsby"
import { debounce } from "../utilities/throttle"
import CardTable from "../components/thumbnail/CardTable"
import SEO from "../components/header/SEO"
import PageContainer from "../components/pageScroll/Container"
import Section from "../components/pageScroll/Section"
import HeaderContainer from "../components/header/HeaderContainer"
import Footer from "../components/footer/Footer"

import useRestoreScrollTop from "../contexts/useRestoreScrollTop"
import useFlattenMarkdownData from "../components/others/useFlattenMarkdownData"

function BlogPagePreview({ jumbotronProps }) {
  return (
    <HeaderContainer
      headerProps={{ color: "white", position: "absolute" }}
      jumbotronProps={jumbotronProps}
    />
  )
}

function BlogPageTemplate({ jumbotronProps, uri, blogRollData }) {
  const data = []
  data.length = 10
  data.fill("1")
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
        <Section>
          <CardTable
            datalist={blogRollData}
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
export { BlogPageTemplate, BlogPagePreview }

function BlogPage({ data, uri }) {
  const { frontmatter } = data.markdownRemark
  useRestoreScrollTop([uri])
  // flatten blog data
  const cardTableDataList = useFlattenMarkdownData(data.allMarkdownRemark)
  return (
    <>
      <SEO title="Blog" />

      <BlogPageTemplate
        jumbotronProps={frontmatter.jumbotronProps}
        uri={uri}
        blogRollData={cardTableDataList}
      />
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
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      filter: {
        frontmatter: {
          templateKey: { eq: "BlogPost" }
          portfolio: { ne: true }
          isTemplate: { ne: true }
        }
      }
    ) {
      edges {
        post: node {
          excerpt(pruneLength: 400)
          id
          fields {
            slug
          }
          frontmatter {
            title
            templateKey
            date(formatString: "MMMM DD, YYYY")
            tags
            description
            featuredPost
            featuredImage {
              childImageSharp {
                fluid(maxWidth: 500, quality: 100) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    }
  }
`

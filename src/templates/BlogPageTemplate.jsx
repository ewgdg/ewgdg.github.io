/* eslint-disable react/prop-types */
'use client'
import React, { useEffect, useState } from "react"
import { debounce } from "../utils/throttle"
import CardTable from "../components/thumbnail/CardTable"
import PageContainer from "../components/pageScroll/Container"
import Section from "../components/pageScroll/Section"
import HeaderContainer from "../components/header/HeaderContainer"
import Footer from "../components/footer/Footer"
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
export default BlogPageTemplate

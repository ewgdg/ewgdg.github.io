/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState, useEffect } from "react"
import Container from "../components/pageScroll/Container"
import Section from "../components/pageScroll/Section"
import Layout from "../components/layout"
import LayoutContext from "../contexts/LayoutContext"

export default function test() {
  const [scrollTop, setScrollTop] = useState(0)
  useEffect(() => {
    console.log("rerender")
  })
  return (
    <Layout>
      {/* <LayoutContext.Consumer>
        {contextValue => {
          console.log("contextValue")
          console.log(contextValue)
          return (
            <button
              type="button"
              onClick={() => {
                console.log(contextValue.scrollLayer)
              }}
            >
              {" "}
              log context
            </button>
          )
        }}
      </LayoutContext.Consumer> */}
      {/* <div style={{ height: "800px" }}>test other head</div> */}
      <Container>
        <Section>
          <p>test</p>
        </Section>
        <Section>
          <div>test2</div>
        </Section>
      </Container>
      <button
        type="button"
        onClick={() => {
          setScrollTop(window.scrollTop)
        }}
      >
        scrollTop window
      </button>
      <button
        type="button"
        onClick={() => {
          setScrollTop(document.body.scrollTop)
        }}
      >
        body
      </button>
      <button
        type="button"
        onClick={() => {
          setScrollTop(document.documentElement.scrollTop)
        }}
      >
        html
      </button>
      <button
        type="button"
        onClick={() => {
          setScrollTop(document.querySelector(".scrollDiv").scrollTop)
        }}
      >
        scrollDiv
      </button>
      <p>scrollTop value read: {scrollTop} </p>
      {/* <div style={{ height: "800px" }}>test other bottom</div>
      <div style={{ height: "800px" }}>test other bottom</div>
      <div style={{ height: "800px" }}>test other bottom</div>
      <div style={{ height: "800px" }}>test other bottom</div>
      <div style={{ height: "800px" }}>test other bottom</div>
      <div style={{ height: "800px" }}>test other bottom</div> */}
    </Layout>
  )
}

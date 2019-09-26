/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-one-expression-per-line */
/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, { useMemo, useRef, useState, useEffect, useCallback } from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"

import "./layout.css"

import FlyingSprite from "./sprite/FlyingSprite"
import LayoutContext from "../contexts/LayoutContext"

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  // const [value, setValue] = useState(0)

  const contextValueRef = useRef({ scrollLayer: null })
  const setContextCallBack = useCallback(
    e => {
      contextValueRef.current.scrollLayer = e
    },
    [contextValueRef]
  )

  return (
    <LayoutContext.Provider value={contextValueRef.current}>
      <div
        id="layoutBody"
        style={{ position: "relative", height: "100vh", width: "100vw" }}
      >
        <div className="scrollDiv" ref={setContextCallBack}>
          {/* change the position to absolute instead of fixed 
        because i want the scrollDiv to handle the scroll triggered by the sprite */}
          <FlyingSprite style={{ position: "absolute" }} />

          {/* <LayoutContext.Provider value={layer}> */}
          {/* <button
          type="button"
          onClick={() => {
            setValue(prev => prev + 1)
            console.log(contextValue)
          }}
        >
          increase value
        </button>
        <p>value: {value}</p> */}

          <div>
            {/* style={{
          margin: '0 auto',
          maxWidth: 960,
          padding: '0px 1.0875rem 1.45rem',
          paddingTop: 0,
        }} */}
            <main>{children}</main>
            <footer>
              © {new Date().getFullYear()}, Built with{" "}
              <a href="https://www.gatsbyjs.org">Gatsby</a>
            </footer>
          </div>
          {/* </LayoutContext.Provider> */}
        </div>
      </div>
    </LayoutContext.Provider>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout

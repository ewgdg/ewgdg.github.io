/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-one-expression-per-line */
/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, {
  useMemo,
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"
import Footer from "./footer/Footer"
import "./layout.css"
import "typeface-roboto"
// import ScrollMagic from "scrollmagic-with-ssr"

import FlyingSprite from "./sprite/FlyingSprite"
import LayoutContext from "../contexts/LayoutContext"
import Synap from "./background/Synap"

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

  // // const [value, setValue] = useState(0)
  // const scrollMagicController = useMemo(() => {
  //   return new ScrollMagic.Controller()
  // }, [])

  const contextValueRef = useRef({
    scrollLayer: null,
  })

  // if the context is not resolved then the children will not be mounted
  const [resolved, setResolved] = useState(false)

  const setContextCallBack = useCallback(
    e => {
      contextValueRef.current = { ...contextValueRef.current, scrollLayer: e }
      setResolved(!!e)
      if (e) e.focus()
    },
    [contextValueRef]
  )

  return (
    <LayoutContext.Provider value={contextValueRef.current}>
      <div
        id="layoutBody"
        style={{ position: "relative", maxHeight: "100vh", maxWidth: "100vw" }}
      >
        <Synap style={{ opacity: 0.3, width: "100vw", height: "100vh" }} />
        <div
          id="scrollDiv"
          tabIndex="0"
          className="scrollDiv"
          ref={setContextCallBack}
          style={{
            overflowY: "scroll !important",
            overflowX: "hidden",
            height: "100vh",
            width: "auto",
            margin: 0,
            padding: 0,
            outline: "none",
            boxSizing: "border-box",
            /* position:relative; */
            /* touch-action: none; */
            touchAction: "pan-x pinch-zoom",
          }}
        >
          <FlyingSprite style={{ position: "fixed" }} />

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
          {resolved && (
            <div>
              {/* style={{
          margin: '0 auto',
          maxWidth: 960,
          padding: '0px 1.0875rem 1.45rem',
          paddingTop: 0,
        }} */}
              <div>{children}</div>
              {/* <footer>
                © {new Date().getFullYear()}, Built with{" "}
                <a href="https://www.gatsbyjs.org">Gatsby</a>
              </footer> */}
              <Footer />
            </div>
          )}
        </div>
      </div>
    </LayoutContext.Provider>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout

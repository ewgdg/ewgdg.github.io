/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-one-expression-per-line */
'use client'
import React, { useState, useCallback, useEffect } from "react"
import PropTypes from "prop-types"
// import { useStaticQuery, graphql } from "gatsby"

// Moved global CSS imports to layout.js
// import ScrollMagic from "scrollmagic-with-ssr"

import FlyingSprite from "../sprite/FlyingSprite"
import LayoutContext, { contextValueRef } from "../../contexts/LayoutContext"
import Synap from "../background/Synap"
import { debounce } from "../../utils/throttle"

const Layout = ({ children }) => {
  // if the context is not resolved then the children will not be mounted
  const [resolved, setResolved] = useState(false)

  const setContextCallBack = useCallback(
    e => {
      contextValueRef.current = {
        ...contextValueRef.current,
        scrollLayer: e,
      }

      setResolved(!!e)
      if (e) e.focus()
    },
    [contextValueRef]
  )

  // Add timeout fallback to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!resolved) {
        console.warn('PersistedLayout: Forcing render after timeout')
        setResolved(true)
      }
    }, 1000) // 1 second fallback

    return () => clearTimeout(timeout)
  }, [resolved])

  useEffect(() => {
    const { scrollLayer } = contextValueRef.current
    // get init scrollHeight
    contextValueRef.current.scrollHeight = scrollLayer.scrollHeight
    const onResize = debounce(() => {
      // reset scrollTop when resize

      scrollLayer.scrollTop = Math.round(
        (scrollLayer.scrollTop / contextValueRef.current.scrollHeight) *
          scrollLayer.scrollHeight
      )
      contextValueRef.current.scrollHeight = scrollLayer.scrollHeight
    }, 100)
    window.addEventListener("resize", onResize)

    return () => {
      window.removeEventListener("resize", onResize)
    }
  }, [contextValueRef.current.scrollLayer])
  return (
    <LayoutContext.Provider value={contextValueRef.current}>
      <div
        id="layoutBody"
        style={{
          position: "relative",
          maxHeight: "100vh",
          maxWidth: "100vw",
        }}
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

          {resolved && <div>{children}</div>}
        </div>
      </div>
    </LayoutContext.Provider>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

Layout.defaultProps = {}

export default Layout

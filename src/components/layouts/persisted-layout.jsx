/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-one-expression-per-line */
'use client'
import React, { useState, useCallback, useEffect } from "react"
import PropTypes from "prop-types"

// Moved global CSS imports to layout.js
// import ScrollMagic from "scrollmagic-with-ssr"

import FlyingSprite from "../sprite/flying-sprite"
import LayoutContext, { contextValueRef } from "../../lib/contexts/layout-context"
import Synap from "../background/synap"
import { debounce } from "../../lib/performance/throttle"

const Layout = ({ children }) => {
  // if the context is not resolved then the children will not be mounted
  const [resolved, setResolved] = useState(false)

  const setScrollLayerRefCallBack = useCallback(
    e => {
      // Clean up previous resize listener if it exists
      if (contextValueRef.current.resizeCleanup) {
        contextValueRef.current.resizeCleanup()
        contextValueRef.current.resizeCleanup = null
      }

      contextValueRef.current = {
        ...contextValueRef.current,
        scrollLayer: e,
      }

      if (e) {
        // get init scrollHeight
        contextValueRef.current.scrollHeight = e.scrollHeight

        const onResize = debounce(() => {
          // reset scrollTop when resize
          e.scrollTop = Math.round(
            (e.scrollTop / contextValueRef.current.scrollHeight) *
            e.scrollHeight
          )
          contextValueRef.current.scrollHeight = e.scrollHeight
        }, 100)

        window.addEventListener("resize", onResize)

        // Store cleanup function
        contextValueRef.current.resizeCleanup = () => {
          window.removeEventListener("resize", onResize)
        }
      }

      setResolved(!!e)
      // Remove automatic focus to prevent aria-hidden conflicts with modals
      // if (e) e.focus()
    },
    []
  )

  // Cleanup resize listener on component unmount
  useEffect(() => {
    return () => {
      if (contextValueRef.current.resizeCleanup) {
        contextValueRef.current.resizeCleanup()
        contextValueRef.current.resizeCleanup = null
      }
    }
  }, [])
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
          // the tabIndex is to make the div focusable and so that it can receive keyboard events
          // tabIndex="0"
          className="scrollDiv"
          ref={setScrollLayerRefCallBack}
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

'use client'

import React, { useMemo, useRef, useEffect, useContext, useState, useCallback } from "react"
import { makeStyles } from "@mui/styles"
import {
  isAnyInViewport,
  // isAboveViewportBottom,
  // isBelowViewportTop,
  isBottomInViewport,
  isTopInViewport,
} from "../../lib/dom/viewport"
import {
  scrollIntoView,
  scrollByAnimated,
  clearAnimationQueue,
  ScrollDetector,
} from "../../lib/dom/scroll"
import LayoutContext from "../../lib/contexts/layout-context"

const useStyles = makeStyles({
  root: {
    border: 0,
    borderRadius: 3,
    overflow: "hidden",
    // Block all touch actions for full control
    touchAction: "pinch-zoom", // safari does not support "pan-x" well
    // Disable momentum scrolling since we're controlling it
    WebkitOverflowScrolling: "auto",
  },
})

const SectionTypes = {
  FullView: "FullView",
  Flexible: "Flexible",
}

// Mobile detection utilities (moved to component level)
const isMobile = () => {
  if (typeof window === 'undefined') return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(navigator.userAgent) ||
    ('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0)
}

const isIOS = () => {
  if (typeof window === 'undefined') return false
  // Prefer userAgentData if available, fallback to userAgent and deprecated platform
  const ua = navigator.userAgent || '';
  const isAppleDevice = /iPad|iPhone|iPod/.test(ua);
  return isAppleDevice;
}

const isSafari = () => {
  if (typeof window === 'undefined') return false
  const ua = navigator.userAgent.toLowerCase()
  return (
    ua.includes('safari') &&
    !ua.includes('chrome') &&
    !ua.includes('android') &&
    'safari' in window
  )
}

// The scroll event cannot be canceled or interrupted, so use mouse, touch and button events instead.
const getHandlers = (container, context, sectionType) => {
  // create dom event handler, same as useCallback( function factory(param)(args) ) //no need useMemo if it is inside useEffect
  return (() => {
    let isScrolling = false
    let isZooming = false
    let isTargetClickable = false

    const touchPointYList = []
    const touchPointTimeStamp = []
    let isPointerDown = false

    function preventDefault(e) {
      if (e.cancelable || !e.isCustomEvent) {
        // e.preventDefault()
        // stop propagate to scroll layer so that custom handler can take control of scrolling
        // do not use preventDefault so that browser can support other default behaviour like click
        e.stopPropagation()
      }
    }
    function scrollPage(direction, event, scrollLayer = context.scrollLayer) {
      if (isScrolling) {
        preventDefault(event)
        event.preventDefault()
        return
      }

      let useFallback = false
      let activeSection = null
      let activeSectionI = 0
      let isInViewPortTest
      let scrollOffsetY = 0

      // Enhanced viewport calculation for mobile
      const getViewportHeight = () => {
        // Use visual viewport on mobile if available (better for mobile browsers)
        // if (window.visualViewport && isMobile()) {
        //   return window.visualViewport.height
        // }
        // return window.innerHeight || document.documentElement.clientHeight
        return scrollLayer.clientHeight
      }

      const marginForViewPortTest = Math.max(
        Math.min(getViewportHeight() * 0.01, 5),
        1
      )
      if (sectionType === SectionTypes.Flexible) {
        if (direction === "up") {
          isInViewPortTest = elem =>
            isTopInViewport(elem, -marginForViewPortTest, marginForViewPortTest)
        } else {
          isInViewPortTest = elem =>
            isBottomInViewport(
              elem,
              marginForViewPortTest,
              -marginForViewPortTest
            )
        }
      } else {
        isInViewPortTest = elem => isAnyInViewport(elem, marginForViewPortTest)
      }

      // ignore the scroll event if the container is not in viewport
      if (!container || !isAnyInViewport(container)) {
        // useFallback = true
        // fall back to default behavior
        return
      }
      // have to query every time cause the child sections may change
      // todo: implement composite reference container to avoid query, manually forward a sub reference container to each children, so children will update it dynamically
      const childSections = container.querySelectorAll(':scope section');
      // find the first/last active section that is in viewport
      const size = childSections.length
      let i0
      let step
      if (sectionType === SectionTypes.FullView) {
        if (direction === "up") {
          i0 = size - 1
          step = -1
        } else if (direction === "down") {
          i0 = 0
          step = 1
        }
      }
      else {
        if (direction === "down") {
          i0 = size - 1
          step = -1
        } else if (direction === "up") {
          i0 = 0
          step = 1
        }
      }
      for (let i = i0; i < size && i >= 0; i += step) {
        const elem = childSections[i]

        if (isInViewPortTest(elem)) {
          activeSection = elem
          activeSectionI = i
          break
        }
        // todo: early termination check or binary search
      }
      if (!activeSection) {
        // useFallback = true
        return
      }

      let target = null

      if (direction === "up") {
        // scrolling up
        const prevI = activeSectionI - 1
        if (prevI >= 0 && childSections[prevI]) {
          target = childSections[prevI]
          if (sectionType === SectionTypes.Flexible) {
            // scroll to the bottom of prev section
            scrollOffsetY = -(
              target.offsetHeight - getViewportHeight()
            )
          }
        } else {
          target = activeSection
        }
      } else if (direction === "down") {
        // scrolling down
        const nextI = activeSectionI + 1
        if (nextI < childSections.length && childSections[nextI]) {
          target = childSections[nextI]
        } else {
          target = activeSection
        }
      } else {
        return
      }

      if (target) {
        if (!isScrolling) clearAnimationQueue()

        isScrolling = true

        preventDefault(event)

        const scrollDuration = 777
        const promise = scrollIntoView(target, scrollLayer, scrollDuration, scrollOffsetY)
        promise.then(() => {
          isScrolling = false
        }).catch((error) => {
          console.warn('Scroll animation failed:', error)
          isScrolling = false
        })
      }
    }

    const wheelHandler = e => {
      if (isZooming) {
        return
      }
      const delta = e.deltaY
      if (Math.abs(delta) <= 2) {
        return
      }
      preventDefault(e)
      e.preventDefault()
      if (delta < 0) {
        // scrolling up
        scrollPage("up", e)
      } else if (delta > 0) {
        // scrolling down
        scrollPage("down", e)
      }
    }

    function isClickable(elem) {
      const { tagName } = elem
      return (
        tagName === "INPUT" ||
        tagName === "BUTTON" ||
        tagName === "A" ||
        tagName === "TEXTAREA" ||
        tagName === "AREA" ||
        tagName === "SELECT" ||
        elem.hasAttribute("clickable")
      )
    }
    function pointerDownHandler(e) {
      // check event path, if found clickable, ignore this pointer move

      let elem = e.target || e.srcElement
      isTargetClickable = false
      while (elem) {
        if (isClickable(elem)) {
          isTargetClickable = true
          break
        }
        elem = elem.parentElement
      }

      // if (isTargetClickable) {
      //   return
      // }
      isPointerDown = true

      touchPointYList.length = 0
      touchPointTimeStamp.length = 0

      if (isScrolling) {
        preventDefault(e)
        return
      }

      preventDefault(e)
      clearAnimationQueue()
      const touchPoint = e

      touchPointYList.push(touchPoint.clientY)
      touchPointTimeStamp.push(performance.now())
    }
    function pointerMoveHandler(e) {
      if (!isPointerDown) {
        return
      }

      if (isScrolling) {
        preventDefault(e)
        e.preventDefault()
        return
      }

      preventDefault(e)

      const touchPoint = e
      let verticalMove = 0
      if (touchPointYList.length > 0) {
        verticalMove =
          touchPoint.clientY - touchPointYList[touchPointYList.length - 1]
      }
      touchPointYList.push(touchPoint.clientY)
      touchPointTimeStamp.push(performance.now())

      while (touchPointYList.length > 5) {
        touchPointYList.shift()
        touchPointTimeStamp.shift()
      }

      if (Math.abs(verticalMove) > 0) {
        // scrollByAnimated(context.scrollLayer, -verticalMove, 1)
        context.scrollLayer.scrollTop -= verticalMove
        ScrollDetector.updateAll()
      }
    }
    function pointerUpHandler(e) {
      if (!isPointerDown) return
      isPointerDown = false

      if (isScrolling || touchPointYList.length <= 0) {
        preventDefault(e)
        e.preventDefault()
        return
      }

      if (touchPointYList.length <= 0) {
        return
      }

      const touchPoint = e

      const touchEndY = touchPoint.clientY

      const verticalMove = touchEndY - touchPointYList[0]
      let idlingTime = performance.now()

      for (let i = touchPointYList.length - 1; i >= 0; i -= 1) {
        if (Math.abs(touchEndY - touchPointYList[i]) >= 2 || i === 0) {
          idlingTime -= touchPointTimeStamp[i]
          break
        }
      }

      let ready = true
      // Unified gesture detection for all devices
      const gestureThreshold = isMobile() || isTargetClickable ? 6 : 3    // Slightly higher threshold on mobile for touch precision
      const timeThreshold = isMobile() ? 500 : 500     // Slightly longer time on mobile
      // discard subtle motion
      if (Math.abs(verticalMove) <= gestureThreshold) {
        ready = false
        // scroll back to target
        isScrolling = true
        const promise = scrollByAnimated(context.scrollLayer, verticalMove, 50)
        promise.then(() => {
          isScrolling = false
        }).catch((error) => {
          console.warn('Scroll animation failed:', error)
          isScrolling = false
        })
      }
      else if (idlingTime > timeThreshold) {
        ready = false
      }

      if (ready && verticalMove > 0) {
        scrollPage("up", e)
      } else if (ready && verticalMove < 0) {
        scrollPage("down", e)
      }
    }

    function pointerCancelHandler(e) {
      if (!isPointerDown) return

      touchPointYList.splice(0)
      touchPointTimeStamp.splice(0)
      isPointerDown = false

      preventDefault(e)
      e.preventDefault()
    }
    function keyDownHandler(e) {
      if (e.key === "Control") {
        // ctrl key is pressed
        isZooming = true
      } else if (e.key === "ArrowUp") {
        scrollPage("up", e)
      } else if (e.key === "ArrowDown") {
        scrollPage("down", e)
      }
    }
    function keyUpHandler(e) {
      if (e.key === "Control") {
        // ctrl key is released
        isZooming = false
      }
    }
    return [
      wheelHandler,
      keyUpHandler,
      keyDownHandler,
      pointerDownHandler,
      pointerMoveHandler,
      pointerUpHandler,
      pointerCancelHandler,
    ]
  })()
}

// a container component whose children should be of type Section
function Container({ children, sectionType = SectionTypes.FullView }) {
  const classes = useStyles()
  const context = useContext(LayoutContext)

  // Store cleanup function to be called when ref changes
  const cleanupRef = useRef(null)

  // Ref callback to handle container element changes
  const containerRefCallback = useCallback((container) => {
    // Clean up previous listeners if they exist
    if (cleanupRef.current) {
      cleanupRef.current()
      cleanupRef.current = null
    }

    // If container is null (unmounting), just return
    if (!container) return

    // Set up event listeners for the new container
    const [
      wheelHandler,
      keyUpHandler,
      keyDownHandler,
      pointerDownHandler,
      pointerMoveHandler,
      pointerUpHandler,
      pointerCancelHandler,
    ] = getHandlers(container, context, sectionType)
    const { scrollLayer } = context

    container.addEventListener("wheel", wheelHandler, { passive: false })

    // Add keyboard listeners to document since scrollLayer is no longer focusable
    document.addEventListener("keydown", keyDownHandler)
    document.addEventListener("keyup", keyUpHandler)

    const hasPointerEvents = 'PointerEvent' in window
    if (scrollLayer && hasPointerEvents) {
      // Use modern Pointer Events API - non-passive for full control on all devices
      scrollLayer.addEventListener("pointerdown", pointerDownHandler, { passive: false })
      scrollLayer.addEventListener("pointermove", pointerMoveHandler, { passive: false })
      scrollLayer.addEventListener("pointerup", pointerUpHandler, { passive: false })
      scrollLayer.addEventListener("pointercancel", pointerCancelHandler, { passive: false })
      scrollLayer.addEventListener("pointerleave", pointerCancelHandler, { passive: false })
    }

    // Store cleanup function
    cleanupRef.current = () => {
      container.removeEventListener("wheel", wheelHandler)

      document.removeEventListener("keydown", keyDownHandler)
      document.removeEventListener("keyup", keyUpHandler)

      // Remove scrollLayer event listeners 
      if (scrollLayer && hasPointerEvents) {
        // Remove pointer events
        scrollLayer.removeEventListener("pointerdown", pointerDownHandler)
        scrollLayer.removeEventListener("pointermove", pointerMoveHandler)
        scrollLayer.removeEventListener("pointerup", pointerUpHandler)
        scrollLayer.removeEventListener("pointercancel", pointerCancelHandler)
        scrollLayer.removeEventListener("pointerleave", pointerCancelHandler)
      }
    }
  }, [context, sectionType])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current()
        cleanupRef.current = null
      }
    }
  }, [])

  return (
    <div
      className={classes.root}
      ref={containerRefCallback}
      id="pageContainer"
    >
      {children}
    </div>
  )
}

export default React.memo(Container)
export { SectionTypes }

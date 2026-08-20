'use client'

import React, {
  useRef,
  useEffect,
  useLayoutEffect,
  useContext,
  useCallback,
} from "react"
import { makeStyles } from "@mui/styles"
import {
  isAnyInViewport,
  isBottomInViewport,
  isTopInViewport,
} from "../../lib/dom/viewport"
import {
  scrollIntoView,
  clearAnimationQueue,
  cancelScrollLayerAnimations,
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

const TOUCH_DRAG_THRESHOLD_PX = 5
const PRECISE_POINTER_DRAG_THRESHOLD_PX = 5
const GESTURE_IDLE_TIMEOUT_MS = 500
// Compatibility clicks follow pointer completion; later activation must not inherit this token.
const COMPATIBILITY_CLICK_WINDOW_MS = 500
const GESTURE_HISTORY_SIZE = 10

// The scroll event cannot be canceled or interrupted, so use mouse, touch and button events instead.
const getHandlers = (container, context, sectionType) => {
  // create dom event handler, same as useCallback( function factory(param)(args) ) //no need useMemo if it is inside useEffect
  return (() => {
    let isScrolling = false
    let isZooming = false
    let gestureState = "idle"
    let activePointerId = null
    let activePointerType = "mouse"
    let gestureStartY = null
    let previousPointerY = null
    let interactiveTarget = null
    let clickSuppression = null
    let clickSuppressionExpiry = null
    let capturedPointerId = null

    const touchPointYList = []
    const touchPointTimeStamp = []

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

      let activeSection = null
      let activeSectionI = 0
      let isInViewPortTest
      let scrollOffsetY = 0

      const getViewportHeight = () => scrollLayer.clientHeight

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
      if (!elem?.tagName) return false

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

    function findInteractiveTarget(target) {
      let elem = target
      while (elem && elem !== context.scrollLayer) {
        if (isClickable(elem)) return elem
        elem = elem.parentElement
      }
      return null
    }

    function gestureThreshold(pointerType) {
      return pointerType === "touch"
        ? TOUCH_DRAG_THRESHOLD_PX
        : PRECISE_POINTER_DRAG_THRESHOLD_PX
    }

    function resetGesture() {
      gestureState = "idle"
      activePointerId = null
      activePointerType = "mouse"
      gestureStartY = null
      previousPointerY = null
      interactiveTarget = null
      touchPointYList.length = 0
      touchPointTimeStamp.length = 0
    }

    function recordPointerPoint(clientY) {
      touchPointYList.push(clientY)
      touchPointTimeStamp.push(performance.now())

      while (touchPointYList.length > GESTURE_HISTORY_SIZE) {
        touchPointYList.shift()
        touchPointTimeStamp.shift()
      }
    }

    function clearClickSuppression() {
      if (clickSuppressionExpiry !== null) {
        clearTimeout(clickSuppressionExpiry)
        clickSuppressionExpiry = null
      }
      clickSuppression = null
    }

    function armClickSuppression(target, pointerId) {
      if (!target) return

      clearClickSuppression()
      clickSuppression = { target, pointerId }
      clickSuppressionExpiry = setTimeout(() => {
        clickSuppression = null
        clickSuppressionExpiry = null
      }, COMPATIBILITY_CLICK_WINDOW_MS)
    }

    function capturePointer(pointerId) {
      if (typeof context.scrollLayer.setPointerCapture === "function") {
        context.scrollLayer.setPointerCapture(pointerId)
        capturedPointerId = pointerId
      }
    }

    function releaseCapturedPointer() {
      if (capturedPointerId === null) return

      const pointerId = capturedPointerId
      capturedPointerId = null
      const { hasPointerCapture, releasePointerCapture } = context.scrollLayer
      const ownsPointer = typeof hasPointerCapture !== "function" ||
        hasPointerCapture.call(context.scrollLayer, pointerId)

      if (ownsPointer && typeof releasePointerCapture === "function") {
        releasePointerCapture.call(context.scrollLayer, pointerId)
      }
    }

    function cleanupGesture() {
      releaseCapturedPointer()
      resetGesture()
      clearClickSuppression()
    }

    function pointerDownHandler(e) {
      if (gestureState !== "idle") return

      // A fresh press starts a new gesture, so an earlier compatibility click can no longer belong to it.
      clearClickSuppression()

      if (isScrolling) {
        preventDefault(e)
        e.preventDefault()
        return
      }

      interactiveTarget = findInteractiveTarget(e.target || e.srcElement)
      gestureState = interactiveTarget ? "pending" : "dragging"
      activePointerId = e.pointerId
      activePointerType = e.pointerType || "mouse"
      gestureStartY = e.clientY
      previousPointerY = e.clientY
      recordPointerPoint(e.clientY)

      clearAnimationQueue()

      if (gestureState === "dragging") {
        capturePointer(activePointerId)
        preventDefault(e)
      }
    }

    function pointerMoveHandler(e) {
      if (gestureState === "idle" || e.pointerId !== activePointerId) return

      if (isScrolling) {
        preventDefault(e)
        e.preventDefault()
        return
      }

      const verticalMove = e.clientY - previousPointerY
      previousPointerY = e.clientY
      recordPointerPoint(e.clientY)

      if (gestureState === "pending") {
        if (
          Math.abs(e.clientY - gestureStartY) <=
          gestureThreshold(activePointerType)
        ) {
          return
        }

        gestureState = "dragging"
        capturePointer(activePointerId)
      }

      preventDefault(e)
      e.preventDefault()

      if (Math.abs(verticalMove) > 0) {
        context.scrollLayer.scrollTop -= verticalMove
        ScrollDetector.updateAll()
      }
    }

    function pointerUpHandler(e) {
      if (gestureState === "idle" || e.pointerId !== activePointerId) return

      const completedGestureState = gestureState
      const completedInteractiveTarget = interactiveTarget
      const completedPointerId = activePointerId
      const touchEndY = e.clientY
      const completedPointerType = activePointerType

      if (completedGestureState === "pending") {
        resetGesture()
        return
      }

      releaseCapturedPointer()
      armClickSuppression(completedInteractiveTarget, completedPointerId)
      preventDefault(e)
      e.preventDefault()

      if (isScrolling || touchPointYList.length <= 0) {
        resetGesture()
        return
      }

      let ready = true
      const completedGestureThreshold = gestureThreshold(completedPointerType)
      const timeThreshold = GESTURE_IDLE_TIMEOUT_MS

      let recentVerticalMove = 0
      let recentVerticalMovePassThreshold = false
      for (let i = touchPointYList.length - 1; i >= 0; i -= 1) {
        if (i === touchPointYList.length - 1) {
          recentVerticalMove += touchEndY - touchPointYList[i]
        } else {
          recentVerticalMove += touchPointYList[i + 1] - touchPointYList[i]
        }

        if (Math.abs(recentVerticalMove) > completedGestureThreshold) {
          recentVerticalMovePassThreshold = true
          break
        }
      }

      if (!recentVerticalMovePassThreshold) {
        ready = false
      }

      let idlingTime = performance.now()
      for (let i = touchPointYList.length - 1; i >= 0; i -= 1) {
        if (Math.abs(touchEndY - touchPointYList[i]) >= 2 || i === 0) {
          idlingTime -= touchPointTimeStamp[i]
          break
        }
      }

      if (idlingTime > timeThreshold) {
        ready = false
      }

      resetGesture()

      if (ready && recentVerticalMove > 0) {
        scrollPage("up", e)
      } else if (ready && recentVerticalMove < 0) {
        scrollPage("down", e)
      }
    }

    function pointerCancelHandler(e) {
      if (gestureState === "idle" || e.pointerId !== activePointerId) return

      const canceledInteractiveTarget = gestureState === "dragging"
        ? interactiveTarget
        : null
      const canceledPointerId = activePointerId
      releaseCapturedPointer()
      resetGesture()
      armClickSuppression(canceledInteractiveTarget, canceledPointerId)

      preventDefault(e)
      e.preventDefault()
    }

    function pointerLeaveHandler(e) {
      if (gestureState !== "pending" || e.pointerId !== activePointerId) return

      resetGesture()
    }

    function lostPointerCaptureHandler(e) {
      if (
        capturedPointerId !== e.pointerId ||
        gestureState !== "dragging" ||
        activePointerId !== e.pointerId
      ) {
        return
      }

      const lostInteractiveTarget = interactiveTarget
      const lostPointerId = activePointerId
      capturedPointerId = null
      resetGesture()
      armClickSuppression(lostInteractiveTarget, lostPointerId)
    }

    function clickCaptureHandler(e) {
      const exposesPointerIdentity = Number.isFinite(e.pointerId)
      if (
        e.detail === 0 ||
        !clickSuppression ||
        !clickSuppression.target.contains(e.target) ||
        (exposesPointerIdentity && e.pointerId !== clickSuppression.pointerId)
      ) {
        return
      }

      clearClickSuppression()
      e.preventDefault()
      e.stopImmediatePropagation()
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
      pointerLeaveHandler,
      lostPointerCaptureHandler,
      clickCaptureHandler,
      cleanupGesture,
    ]
  })()
}

// a container component whose children should be of type Section
function Container({
  children,
  sectionType = SectionTypes.FullView,
  enabled = true,
  className = "",
  ...rootProps
}) {
  const classes = useStyles()
  const context = useContext(LayoutContext)

  // Store cleanup function to be called when ref changes
  const cleanupRef = useRef(null)
  const wasEnabledRef = useRef(enabled)

  useLayoutEffect(() => {
    if (wasEnabledRef.current && !enabled) {
      // Listener cleanup cannot stop a GSAP tween that is already mutating the retained layer.
      cancelScrollLayerAnimations(context.scrollLayer)
    }
    wasEnabledRef.current = enabled
  }, [context.scrollLayer, enabled])

  // Ref callback to handle container element changes
  const containerRefCallback = useCallback((container) => {
    // Clean up previous listeners if they exist
    if (cleanupRef.current) {
      cleanupRef.current()
      cleanupRef.current = null
    }

    // Disabled containers stay mounted but must not own global navigation input.
    if (!container || !enabled) return

    // Set up event listeners for the new container
    const [
      wheelHandler,
      keyUpHandler,
      keyDownHandler,
      pointerDownHandler,
      pointerMoveHandler,
      pointerUpHandler,
      pointerCancelHandler,
      pointerLeaveHandler,
      lostPointerCaptureHandler,
      clickCaptureHandler,
      cleanupGesture,
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
      scrollLayer.addEventListener("pointerleave", pointerLeaveHandler, { passive: false })
      scrollLayer.addEventListener("lostpointercapture", lostPointerCaptureHandler)
      scrollLayer.addEventListener("click", clickCaptureHandler, true)
    }

    // Store cleanup function
    cleanupRef.current = () => {
      cleanupGesture()
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
        scrollLayer.removeEventListener("pointerleave", pointerLeaveHandler)
        scrollLayer.removeEventListener("lostpointercapture", lostPointerCaptureHandler)
        scrollLayer.removeEventListener("click", clickCaptureHandler, true)
      }
    }
  }, [context, enabled, sectionType])

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
      {...rootProps}
      className={`${classes.root} ${className}`}
      ref={containerRefCallback}
      id="pageContainer"
    >
      {children}
    </div>
  )
}

export default React.memo(Container)
export { SectionTypes }

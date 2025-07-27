'use client'

/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { useRef, useContext, useEffect } from "react"
import { gsap } from "gsap"
import LayoutContext from "../../lib/contexts/layout-context"
import { debounce } from "../../lib/performance/throttle"
import { ScrollDetector } from "../../lib/dom/scroll"

/* 
 wrap the child component into a div container for animation purpose,
 gradually moves the given child component down and hide the overflow part,
 when scrolling down the page 
*/
function ParallaxSection({
  children,
  style,
  triggerHook = 0,
  maxProgressValue = 50,
  progressUnit = "%",
  fade = 0,
  innerDivStyle,
  className,
}) {
  const containerRef = useRef(null)
  const contentRef = useRef(null)
  const context = useContext(LayoutContext)

  useEffect(() => {
    if (!context.scrollLayer) return

    const contentElement = contentRef.current

    const scene = new ScrollDetector({
      scrollLayer: context.scrollLayer,
      triggerElement: containerRef.current,
      triggerHook,
      duration: context.scrollLayer.clientHeight,
      throttleLimit: 0,
    })
    scene.setEventListener(progress => {
      if (!contentRef.current) return

      const yValue = progress * maxProgressValue
      const newOpacity = 1 - progress * fade

      // Direct GSAP manipulation - no React re-render, GPU accelerated
      gsap.set(contentRef.current, {
        y: progressUnit === 'px' ? yValue : `${yValue}${progressUnit}`,
        opacity: newOpacity
      })
    })

    const onResize = debounce(() => {
      scene.updateDuration(context.scrollLayer.clientHeight)
    }, 100)
    // reset trigger elem when resizing as start position may changes
    window.addEventListener("resize", onResize)

    return () => {
      scene.destroy()
      // Reset to initial position with GSAP
      if (contentElement) {
        gsap.set(contentElement, { y: 0, opacity: 1 })
      }
      window.removeEventListener("resize", onResize)
    }
  }, [context, maxProgressValue, children, triggerHook, progressUnit, fade])

  if (!context.scrollLayer) return null

  return (
    <div
      className={`parallax-section ${className || ""}`}
      ref={containerRef}
      style={{
        overflow: "hidden",
        width: "100%",
        height: "100%",
        ...style,
      }}
    >
      <div
        ref={contentRef}
        style={{
          position: "relative",
          transform: "translate3d(0,0,0)", // Initial transform, will be updated by GSAP
          backfaceVisibility: "hidden",
          opacity: 1, // Initial opacity, will be updated by GSAP
          ...innerDivStyle,
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default ParallaxSection

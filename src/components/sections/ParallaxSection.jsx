'use client'

/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { useRef, useContext, useEffect, useState } from "react"
import LayoutContext from "../../contexts/LayoutContext"
import { debounce } from "../../utils/throttle"
import { ScrollDetector } from "../../utils/scroll"

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
  const [y, setY] = useState(0)
  const [opacity, setOpacity] = useState(1)
  const context = useContext(LayoutContext)

  useEffect(() => {
    if (!context.scrollLayer) return

    const scene = new ScrollDetector({
      scrollLayer: context.scrollLayer,
      triggerElement: containerRef.current,
      triggerHook,
      duration: context.scrollLayer.clientHeight,
      throttleLimit: 0,
    })
    scene.setEventListener(progress => {
      const newY = `${progress * maxProgressValue}${progressUnit}`
      const newOpacity = 1 - progress * fade
      setY(newY)
      setOpacity(newOpacity)
    })

    const onResize = debounce(() => {
      scene.updateDuration(context.scrollLayer.clientHeight)
    }, 100)
    // reset trigger elem when resizing as start position may changes
    window.addEventListener("resize", onResize)

    return () => {
      scene.destroy()
      setY(0)
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
          transform: `translate3d(0,${y},0)`,
          backfaceVisibility: "hidden",
          opacity: `${opacity}`,
          ...innerDivStyle,
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default ParallaxSection

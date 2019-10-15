/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { useRef, useContext, useEffect, useState } from "react"
// import Img from "gatsby-image"

// import { getController, ScrollMagic } from "../../plugins/scrollmagic"
import LayoutContext from "../../contexts/LayoutContext"
import throttle, { debounce } from "../../utilities/throttle"
import { ScrollDetector } from "../../utilities/scroll"

/* 
 wrap the child component into div container,
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
}) {
  const containerRef = useRef(null)
  const contentRef = useRef(null)
  const [y, setY] = useState(0)
  const [opacity, setOpacity] = useState(1)
  const context = useContext(LayoutContext)
  if (!context.scrollLayer) return null
  useEffect(() => {
    // const controller = getController(context.scrollLayer)

    // const scene = new ScrollMagic.Scene({
    //   triggerElement: containerRef.current,
    //   triggerHook,
    //   duration: context.scrollLayer.clientHeight,
    //   reverse: true,
    // })
    // scene
    //   .on("progress", event => {
    //     const { progress } = event

    //     const newY = `${progress * maxProgressValue}${progressUnit}`
    //     const newOpacity = 1 - progress * fade
    //     setY(newY)
    //     setOpacity(newOpacity)
    //   })
    //   .addTo(controller)
    // .addIndicators()
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
      // scene.refresh()
      scene.updateDuration(context.scrollLayer.clientHeight)
      // scene.progress(old)
    }, 100)
    // reset trigger elem when resizing as start position may changes
    window.addEventListener("resize", onResize)

    return () => {
      // console.log("destroy")
      // controller.removeScene(scene)
      scene.destroy()
      setY(0)
      window.removeEventListener("resize", onResize)
    }
  }, [
    context,
    maxProgressValue,
    children,
    triggerHook,
    progressUnit,
    triggerHook,
  ])

  return (
    <div
      className="objectFit"
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
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default ParallaxSection

/* eslint-disable import/no-unresolved */
/* eslint-disable react/prop-types */
import React, {
  useLayoutEffect,
  useRef,
  useContext,
  useEffect,
  useState,
} from "react"
// import Img from "gatsby-image"
import { TweenMax, TimelineLite, Power3, Power1, Power0 } from "gsap/TweenMax"
import { getController, ScrollMagic } from "plugins/scrollmagic"
import { ScrollDetector } from "utilities/scroll"
import LayoutContext from "contexts/LayoutContext"
import { debounce } from "utilities/throttle"

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
    const controller = getController(context.scrollLayer)

    // const lastTimeStamp = performance.now()
    const scene = new ScrollMagic.Scene({
      triggerElement: containerRef.current,
      triggerHook,
      duration: context.scrollLayer.clientHeight,
      reverse: true,
    })
    scene
      .on("progress", event => {
        // const currentTime = performance.now()
        // const diff = currentTime - lastTimeStamp
        // lastTimeStamp = currentTime
        // if (diff > 60) {
        //   // if there is a lag, ignore the event
        //   return
        // }

        const { progress } = event
        // const progress = Math.min(
        //   1,
        //   Math.max(
        //     0,
        //     (event.scrollPos - event.startPos) / (event.endPos - event.startPos)
        //   )
        // )
        const newY = `${progress * maxProgressValue}${progressUnit}`
        const newOpacity = 1 - progress * fade
        setY(newY)
        setOpacity(newOpacity)

        // console.log(`newY ${newY}`)
        // contentRef.current.style.position = "fixed"
        // contentRef.current.style.zIndex = 0
      })
      .addTo(controller)
    // .addIndicators()

    const onResize = debounce(() => {
      scene.refresh()
      scene.duration(context.scrollLayer.clientHeight)
      // scene.progress(old)
    }, 100)
    // reset trigger elem when resizing as start position may changes
    window.addEventListener("resize", onResize)

    return () => {
      // console.log("destroy")
      controller.removeScene(scene)
      scene.destroy(true)
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

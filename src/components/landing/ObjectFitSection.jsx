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
import throttle from "utilities/throttle"

function ObjectFitSection({ children }) {
  const containerRef = useRef(null)
  const contentRef = useRef(null)
  const [y, setY] = useState(0)
  const context = useContext(LayoutContext)
  useEffect(() => {
    const controller = getController(context.scrollLayer)

    let lastTimeStamp = performance.now()
    const scene = new ScrollMagic.Scene({
      triggerElement: "#objectFit",
      triggerHook: 0,
      duration: "100%",
      reverse: true,
    })
    scene
      .on("progress", event => {
        const currentTime = performance.now()
        const diff = currentTime - lastTimeStamp
        lastTimeStamp = currentTime
        if (diff > 33.4) {
          // if there is a lag, ignore the scroll event
          return
        }
        const { progress } = event
        const newY = progress * 0.5 * 100
        setY(newY)
      })
      .addTo(controller)
      .addIndicators()

    return () => {
      controller.removeScene(scene)
    }
  }, [])

  return (
    <div
      id="objectFit"
      ref={containerRef}
      style={{
        overflow: "hidden",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        id="contentfit"
        ref={contentRef}
        style={{ transform: `translate(0,${y}%)` }}
      >
        {children}
      </div>
    </div>
  )
}

export default ObjectFitSection

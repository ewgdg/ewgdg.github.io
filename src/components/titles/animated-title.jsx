/* eslint-disable react/prop-types */
import React, { useRef, useContext, useEffect } from "react"
import { gsap, Power2 } from "gsap"
import TextPlugin from "gsap/TextPlugin"
import { ScrollDetector } from "../../lib/dom/scroll"
import LayoutContext from "../../lib/contexts/layout-context"

// eslint-disable-next-line no-unused-vars
// const plugins = [TextPlugin]
gsap.registerPlugin(TextPlugin);

function AnimatedTitle({ title }) {
  const context = useContext(LayoutContext)
  const headlineRef = useRef(null)
  useEffect(() => {
    const animation = gsap.timeline()
    animation
      .to(headlineRef.current, {
        duration: 0.7,
        text: `-------  ${title}  -------`,
        ease: Power2.easeInOut,
      })
      .add("endAnimation")

    animation.pause()
    const scrollDetector = new ScrollDetector({
      scrollLayer: context.scrollLayer,
      triggerElement: headlineRef.current,
      triggerHook: 0.5,
      duration: 0,
      throttleLimit: 0,
      offset: 0,
    })
    scrollDetector.setEventListener(progress => {
      if (progress > 0) {
        animation.play(0)
      } else {
        // animation.reverse()
      }
    })
    scrollDetector.update()
    return () => {
      animation.progress(0)
      animation.kill()
      scrollDetector.destroy()
    }
    // eslint-disable-next-line react/destructuring-assignment
  }, [context.scrollLayer, title])
  return (
    <h2 ref={headlineRef} style={{ textAlign: "center" }}>
      <strong>{title}</strong>
    </h2>
  )
}

export default AnimatedTitle

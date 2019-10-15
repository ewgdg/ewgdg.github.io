import React, { useRef, useContext, useEffect } from "react"
import { TimelineLite, Power2 } from "gsap/TweenMax"
import { ScrollDetector } from "../../utilities/scroll"
import LayoutContext from "../../contexts/LayoutContext"

function AnimatedTitle({ title }) {
  const context = useContext(LayoutContext)
  const headlineRef = useRef(null)
  useEffect(() => {
    const animation = new TimelineLite()
    animation
      .to(headlineRef.current, 0.7, {
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
    })
    scrollDetector.setEventListener(progress => {
      if (progress > 0) {
        animation.play()
      } else {
        animation.reverse()
      }
    })
    scrollDetector.update()
    return () => {
      animation.progress(0)
      animation.kill()
      scrollDetector.destroy()
    }
  }, [context])
  return (
    <h2 ref={headlineRef} style={{ textAlign: "center" }}>
      <strong>{title}</strong>
    </h2>
  )
}

export default AnimatedTitle

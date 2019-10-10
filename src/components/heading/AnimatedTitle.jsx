import React, { useRef, useContext, useEffect } from "react"
import LayoutContext from "contexts/LayoutContext"
import { TimelineLite, Power2 } from "gsap/TweenMax"
import { getController, ScrollMagic } from "plugins/scrollmagic"
import { ScrollDetector } from "utilities/scroll"

function AnimatedTitle({ title }) {
  const context = useContext(LayoutContext)
  const headlineRef = useRef(null)
  useEffect(() => {
    const controller = getController(context.scrollLayer)
    const scene = new ScrollMagic.Scene({
      triggerElement: headlineRef.current,
      reverse: true,
    })
    const animation = new TimelineLite()
    animation
      .to(headlineRef.current, 0.7, {
        text: `-------  ${title}  -------`,
        ease: Power2.easeInOut,
      })
      .add("endAnimation")
    // animation.to("#texttest", 0.7, { text: "my second test" }, 0.2)
    // scene.setTween(animation).addTo(controller)
    animation.pause()
    const scrollDetector = new ScrollDetector(
      context.scrollLayer,
      headlineRef.current,
      0.5,
      0,
      0
    )
    scrollDetector.setEventListener(progress => {
      if (progress > 0) {
        animation.play()
      } else {
        animation.reverse()
      }
    })
    scrollDetector.update()
    return () => {
      // controller.removeScene(scene)
      // scene.destroy()
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

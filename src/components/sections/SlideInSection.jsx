/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/prop-types */
import React, { useRef, useContext, useEffect } from "react"
import { TweenLite, Power2 } from "gsap/TweenMax"
import LayoutContext from "../../contexts/LayoutContext"
import { ScrollDetector } from "../../utilities/scroll"
/* slide the child in when the child elem is inside viewport */
function SlideInSection({
  triggerHook = 1,
  duration = 1.1,
  fromY = 50,
  children,
  style,
}) {
  const containerRef = useRef(null)
  const context = useContext(LayoutContext)
  const { scrollLayer } = context
  if (!scrollLayer) return null
  useEffect(() => {
    const scene = new ScrollDetector({
      scrollLayer: context.scrollLayer,
      triggerElement: containerRef.current,
      triggerHook,
      duration: 0,
      throttleLimit: 0,
    })
    const animation = TweenLite.from(containerRef.current, duration, {
      opacity: 0.1,
      y: fromY,
      ease: Power2.easeOut,
    })

    animation.pause()
    scene.setEventListener(progress => {
      if (progress > 0) {
        animation.play(0)
      } else {
        // animation.progress(0)
      }
    })

    return () => {
      // resume state
      animation.progress(1)
      animation.kill()
      scene.destroy()
    }
  }, [context, children, triggerHook])
  return (
    <div ref={containerRef} style={style} className="slide-in">
      {children}
    </div>
  )
}

export default SlideInSection

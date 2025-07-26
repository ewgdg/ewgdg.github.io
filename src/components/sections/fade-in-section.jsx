/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/prop-types */
import React, { useRef, useContext, useLayoutEffect } from "react"
import { gsap, Power3 } from "gsap"
import LayoutContext from "../../lib/contexts/layout-context"
import { ScrollDetector } from "../../lib/dom/scroll"
/* Fade the child in when the child elem is inside viewport */
function FadeInSection({ triggerHook = 1, duration = 1.3, children, style }) {
  const containerRef = useRef(null)
  const context = useContext(LayoutContext)
  const { scrollLayer } = context

  useLayoutEffect(() => {
    if (!scrollLayer) return

    const scene = new ScrollDetector({
      scrollLayer: context.scrollLayer,
      triggerElement: containerRef.current,
      triggerHook,
      duration: 0,
      throttleLimit: 0,
    })

    const animation = gsap.fromTo(
      containerRef.current,
      {
        autoAlpha: 0.02,
      },
      {
        autoAlpha: 1,
        ease: Power3.easeInOut,
        paused: true,
        duration,
      }
    )
    animation.progress(1)

    scene.setEventListener(progress => {
      if (progress > 0) {
        // the progress is not 0 to avoid bug on opacity
        animation.progress(0.0001)
        animation.play()
      } else {
        animation.progress(1)
      }
    })

    return () => {
      // resume state
      animation.progress(1)
      animation.pause()
      animation.kill()
      scene.destroy()
    }
  }, [context, children, triggerHook, duration, scrollLayer])

  if (!scrollLayer) return null

  return (
    <div ref={containerRef} style={style} className="fade-in">
      {children}
    </div>
  )
}

export default FadeInSection

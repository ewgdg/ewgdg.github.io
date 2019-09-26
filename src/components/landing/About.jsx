/* eslint-disable import/no-unresolved */
/* eslint-disable new-cap */
import React, { useLayoutEffect, useRef, useState } from "react"
import { TweenMax, TimelineLite, Power3, Power1 } from "gsap/TweenMax"
import * as ScrollMagic from "scrollmagic"
// import "scrollmagic/scrollmagic/minified/plugins/animation.gsap.min"
// import "scrollmagic/scrollmagic/minified/plugins/debug.addIndicators.min"

import "animation.gsap"
import "debug.addIndicators"
// import { TimelineMax } from "gsap/TimelineMax"
import CharSequence from "components/landing/CharSequence"
import { makeStyles } from "@material-ui/styles"

const useStyles = makeStyles({
  charSequenceContainer: {
    width: "20%",
    height: "25%",
    textAlign: "center",
    fontSize: "3.5em",
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    top: 0,
    left: 0,
  },
  charSequenceBackground: {
    backgroundImage:
      "linear-gradient(141deg, #9fb8ad 0%, #1fc8db 51%, #2cb5e8 75%)",
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: -1,
    opacity: 0.6,
  },
  ribbon: {
    width: "100%",
    height: "35vh",
    backgroundColor: "rgb(255, 32, 126)",
    opacity: 0.6,
  },
  skewed: {
    transform: "skewY(-15deg)",
  },
  textContainerInsideRibbon: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
})

function About() {
  const ribbonContainerRef = useRef(null)
  const ribbonRef = useRef(null)
  const charSequenceBackgroundRef = useRef(null)
  const charRefs = useRef([])

  const classes = useStyles()
  // add scrollmagic controll
  useLayoutEffect(() => {
    console.log(`render? ${ribbonRef.current}`)
    const controller = new ScrollMagic.Controller()

    let animation = new TimelineLite()
    // animate ribbon
    animation
      .add("startAnimation")
      .from(ribbonRef.current, 0.7, {
        scaleX: 0,
        transformOrigin: "right",
        ease: Power3.easeInOut,
      })
      .add("ribbonFinished")
      .from(charSequenceBackgroundRef.current, 0.7, {
        scaleX: 0,
        transformOrigin: "left",
        ease: Power3.easeInOut,
      })

    animation
      .staggerTo(
        charRefs.current,
        0.15,
        {
          fontSize: "2em",
          stagger: 0.1,
          ease: Power1.easeInOut,
        },
        undefined,
        "startAnimation+=0.2"
      )
      .staggerTo(
        charRefs.current,
        0.15,
        {
          fontSize: "1em",
          stagger: 0.1,
          ease: Power1.easeInOut,
        },
        undefined,
        "startAnimation+=0.35"
      )
      .staggerFrom(
        "div#animatedLineGroup div.animatedline",
        0.1,
        {
          opacity: 0,
          stagger: 0.05,
        },
        undefined,
        "ribbonFinished"
      )

    const containerScene = new ScrollMagic.Scene({
      triggerElement: "#ribbonContainer",
    })
    containerScene
      // .setTween(blockTween)
      .setTween(animation)
      .addIndicators()
      .addTo(controller)

    // document.querySelector("div.scrollDiv").addEventListener("wheel", e => {
    //   console.log(e)
    // })
    return () => {
      animation = null
      if (controller && controller.destroy) controller.destroy()
    }
  }, [ribbonContainerRef, ribbonRef, charRefs, charSequenceBackgroundRef])

  return (
    <>
      <div style={{ position: "relative" }}>
        <div className={classes.charSequenceContainer}>
          <CharSequence string="About" charRefs={charRefs} />
          <div
            ref={charSequenceBackgroundRef}
            className={classes.charSequenceBackground}
          />
        </div>
        <div
          id="ribbonContainer"
          ref={ribbonContainerRef}
          className={classes.skewed}
        >
          <div id="ribbon" ref={ribbonRef} className={classes.ribbon} />
        </div>
        <div className={classes.textContainerInsideRibbon}>
          <div id="animatedLineGroup">
            <div className="animatedline">line 1 testing</div>
            <div className="animatedline">line 2 testing</div>
            <div className="animatedline">line 3 testing</div>
            <div className="animatedline">line 3 testing</div>
            <div className="animatedline">line 3 testing</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default About

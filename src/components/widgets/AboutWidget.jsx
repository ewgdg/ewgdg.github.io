/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable import/no-unresolved */
/* eslint-disable new-cap */
import React, { useRef, useEffect, useContext } from "react"
import { TimelineLite, Power3, Power1 } from "gsap"

import { makeStyles } from "@material-ui/styles"
import { Link } from "gatsby"
import LayoutContext from "../../contexts/LayoutContext"

import CharSequence from "../sections/CharSequence"
import { ScrollDetector } from "../../utils/scroll"
import FlexContainer from "../sections/FlexContainer"

const useStyles = makeStyles({
  charSequenceContainer: {
    height: "4rem",
    width: "100%",
    fontSize: "3.5rem",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: "20%",
  },
  charSequenceBackground: {
    backgroundImage:
      "linear-gradient(130deg, #a7fcf5 15%, #1fc8cb 50%, #2cb5d8 75%)",
    position: "absolute",
    top: 0,
    left: 0,
    width: "120%",
    height: "100%",
    zIndex: -1,
    opacity: 0.6,
  },
  ribbon: {
    width: "100%",
    height: "350px",
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
    flexDirection: "column",
    padding: "0 10% 0 10%",
  },
})

function About() {
  const ribbonContainerRef = useRef(null)
  const ribbonRef = useRef(null)
  const charSequenceBackgroundRef = useRef(null)
  const charRefs = useRef([])
  const context = useContext(LayoutContext)
  if (!context.scrollLayer) return null
  const classes = useStyles()
  // add scroll animation controll
  useEffect(() => {
    const animation = new TimelineLite()
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
        ".animatedline",
        0.1,
        {
          opacity: 0,
          stagger: 0.05,
        },
        undefined,
        "ribbonFinished"
      )
      .add("endAnimation")

    animation.pause()

    const scrollDetector = new ScrollDetector({
      scrollLayer: context.scrollLayer,
      triggerElement: ribbonContainerRef.current,
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
      animation.progress(1)
      animation.kill()

      scrollDetector.destroy()
    }
  }, [context])

  return (
    <FlexContainer>
      <div style={{ width: "100%", height: "auto" }}>
        <div style={{ display: "inline-block" }}>
          <div className={classes.charSequenceContainer}>
            <CharSequence string="About" charRefs={charRefs} />
            <div
              ref={charSequenceBackgroundRef}
              className={classes.charSequenceBackground}
            />
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <div
            id="ribbonContainer"
            ref={ribbonContainerRef}
            className={classes.skewed}
          >
            <div id="ribbon" ref={ribbonRef} className={classes.ribbon} />
          </div>
          <div className={classes.textContainerInsideRibbon}>
            <div id="animatedLineGroup">
              <h2 className="animatedline">
                My passion is about solving challenging problem.
              </h2>
              <div>
                <div className="animatedline">
                  And that is{" "}
                  <Link to="/blog/2019-10-30-why-i-created-this-page">why</Link>{" "}
                  I made this page.
                </div>
                <div className="animatedline">
                  I like technology and computer programming and many more.
                </div>
                <div className="animatedline" style={{ opacity: 0.8 }}>
                  If you want to learn more about me, keep{" "}
                  <Link to="/about">reading</Link>.
                </div>
                <div className="animatedline" style={{ opacity: 0.6 }}>
                  Or send me an{" "}
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      padding: "0",
                      color: "#069",
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                    type="button"
                    onClick={() => {
                      window.location.href = "m&a&i#l#&t#o:$x#&i$a$n&#$.$z$#5$1#&$2$#^$#g$m#a$i&$l#$.$c#o&#m$"
                        .replace(/\^/g, "@")
                        .replace(/[#&$]/g, "")
                    }}
                  >
                    email.
                  </button>
                </div>
                <div className="animatedline" style={{ opacity: 0.4 }}>
                  ... ...
                </div>
                <div className="animatedline" style={{ opacity: 0.2 }}>
                  ...
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FlexContainer>
  )
}

export default About

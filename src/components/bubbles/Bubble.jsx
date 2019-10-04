/* eslint-disable react/prop-types */
import React, { useEffect, useRef } from "react"
import { makeStyles } from "@material-ui/styles"
import { useState } from "react"
import { TweenLite } from "gsap/TweenLite"
import { Elastic } from "gsap/EasePack"
import TimelineLite from "gsap/TimelineLite"
import FlexContainer from "../decorators/FlexContainer"

const useStyles = makeStyles({
  circle: {
    borderRadius: "50%",
    border: ({ radius }) => `${radius * 0.07}px solid black`,
    display: "inline-block",
    backgroundColor: "#bbb",
    width: ({ radius }) => `${radius ? radius * 2 : 100}px`,
    height: ({ radius }) => `${radius ? radius * 2 : 100}px`,
    fontSize: ({ radius }) => `${radius * 0.33}px`,
    pointerEvents: "auto",
  },
})
function random(min, max, isInteger = true) {
  let res = Math.random() * (max - min + 1)
  if (isInteger) res = Math.floor(res)
  return res + min
}

// compoenent
function Bubble({ style, children, className, radius, boundings }) {
  const [pos, setPos] = useState({ x: style.left, y: style.top })
  const ref = useRef(null)
  useEffect(() => {
    let y = parseFloat(style.top.replace("px", ""))
    let x = parseFloat(style.left.replace("px", ""))

    let targetY = y
    let targetX = x
    let rafId

    let targetCosTheta = 0
    let targetSinTheta = 0

    function setNextTarget() {
      targetX = random(boundings.minX, boundings.maxX)
      targetY = random(boundings.minY, boundings.maxY)
      const hypotenuse = Math.sqrt(
        (targetX - x) * (targetX - x) + (targetY - y) * (targetY - y)
      )
      targetCosTheta = hypotenuse > 0 ? (targetX - x) / hypotenuse : 0
      targetSinTheta = hypotenuse > 0 ? (targetY - y) / hypotenuse : 0
    }
    let lastTimestamp
    const speed = 0.03
    function animationStep(timestamp) {
      if (
        (x === targetX || targetCosTheta === 0) &&
        (y === targetY || targetSinTheta === 0)
      ) {
        setNextTarget()
      }
      const elapsed = timestamp - lastTimestamp
      const progress = elapsed * speed
      x += progress * targetCosTheta
      x = targetCosTheta > 0 ? Math.min(x, targetX) : Math.max(x, targetX)
      y += progress * targetSinTheta
      y = targetSinTheta > 0 ? Math.min(y, targetY) : Math.max(y, targetY)

      setPos({ x: `${x}px`, y: `${y}px` })
      lastTimestamp = timestamp
      rafId = requestAnimationFrame(animationStep)
    }
    function startAnimation() {
      rafId = requestAnimationFrame(timestamp => {
        lastTimestamp = timestamp
        animationStep(timestamp)
      })
    }
    startAnimation()

    // on mouseover
    function onmouseenter() {
      TweenLite.to(ref.current, 2.5, {
        scale: 1.2,
        ease: Elastic.easeOut.config(1, 0.2),
      })

      cancelAnimationFrame(rafId)
    }
    function onmouseleave() {
      TweenLite.to(ref.current, 2, {
        scale: 1,
        ease: Elastic.easeOut.config(1, 0.25),
      })
      // animation.reverse()
      startAnimation()
    }
    ref.current.addEventListener("mouseenter", onmouseenter)
    ref.current.addEventListener("mouseleave", onmouseleave)

    return () => {
      cancelAnimationFrame(rafId)
      ref.current.removeEventListener("mouseenter", onmouseenter)
      ref.current.removeEventListener("mouseleave", onmouseleave)
    }
  }, [boundings.x, boundings.y, radius, style.top, style.left])

  const classes = useStyles({ radius })
  return (
    <div
      style={{ ...style, left: pos.x, top: pos.y }}
      className={`${classes.circle} ${className}`}
      ref={ref}
    >
      <FlexContainer style={{ margin: 0, height: "100%" }}>
        {children}
      </FlexContainer>
    </div>
  )
}

export default Bubble

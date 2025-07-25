'use client'

/* eslint-disable react/prop-types */
import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
import { makeStyles } from "@mui/styles"
// import from tweenmax since it auto import the plugins
import { gsap, Elastic } from "gsap"
// import { CSSPlugin } from "gsap/TweenMax"
// import { Elastic } from "gsap/EasePack"
import Image from "next/image"
import FlexContainer from "../sections/FlexContainer"
import TransitionsModal, {
  useModalController,
} from "../modals/TransitionsModal"

// prevent plugins from being dropped by treeshaking, not necessary for tweenmax
// const plugins = [CSSPlugin]

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
    userSelect: "none",
    WebkitUserSelect: "none",
    "&:focus": {
      outline: "none",
    },
  },
})
function random(min, max, isInteger = true) {
  let res = Math.random() * (max - min + (isInteger ? 1 : 0))
  if (isInteger) res = Math.floor(res)
  return res + min
}

function Bubble({
  style,
  children,
  className,
  radius,
  bounds,
  title,
  description,
  links,
  image,
}) {
  const ref = useRef(null)
  const [pos, setPos] = useState({ x: style.left, y: style.top })
  const { top, left, ...otherStyle } = style
  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    let { x, y } = pos

    let targetY = y
    let targetX = x
    let rafId

    let targetCosTheta = 0
    let targetSinTheta = 0

    const currentRef = ref.current  // Use currentRef to ensure the same reference

    function setNextTarget() {
      targetX = random(bounds.minX, bounds.maxX, false)
      targetY = random(bounds.minY, bounds.maxY, false)
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

      setPos({ x: x, y: y })
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
    let isHover = false
    function onmouseenter() {
      isHover = true
      gsap.to(currentRef, {
        duration: 2,
        scale: 1.2,
        ease: Elastic.easeOut.config(1, 0.2),
      })

      cancelAnimationFrame(rafId)
    }
    function onmouseleave() {
      if (!isHover) return
      isHover = false
      gsap.to(currentRef, {
        duration: 2,
        scale: 1,
        ease: Elastic.easeOut.config(1, 0.2),
      })
      // animation.reverse()
      startAnimation()
    }

    currentRef.addEventListener("mouseenter", onmouseenter)
    currentRef.addEventListener("mouseleave", onmouseleave)

    return () => {
      cancelAnimationFrame(rafId)
      currentRef.removeEventListener("mouseenter", onmouseenter)
      currentRef.removeEventListener("mouseleave", onmouseleave)
    }
  }, [bounds, radius])

  const classes = useStyles({ radius })
  const [
    modalOpenState,
    modalHandleOpen,
    modalHandleClose,
  ] = useModalController()

  const imageStyle = {
    width: "100%",
    height: "300px",
    maxHeight: "55vh",
    objectFit: "contain",
  }
  return (
    <>
      <div
        style={{ ...otherStyle, left: pos.x, top: pos.y }}
        className={`${classes.circle} ${className || ""}`}
        ref={ref}
        role="button"
        onClick={() => {
          modalHandleOpen()
          const event = new Event("mouseleave")
          ref.current.dispatchEvent(event)
        }}
        clickable="true"
      // tabIndex="0"
      >
        <FlexContainer style={{ margin: 0, height: "100%" }}>
          {children}
        </FlexContainer>
      </div>
      <TransitionsModal
        open={modalOpenState}
        handleClose={modalHandleClose}
        title={title}
        links={links}
        description={description}
      >
        {image &&
          <Image src={image} alt={title} width={0} height={0} style={imageStyle} sizes="(max-width: 768px) 100vw, 50vw" />}
      </TransitionsModal>
    </>
  )
}

export default Bubble

'use client'

/* eslint-disable react/prop-types */
import React, { useMemo, useRef, useEffect } from "react"
import { gsap } from "gsap"
import { Box } from "@mui/material"
// import { useContext } from "react"
// import useLayoutContext from "../../contexts/useLayoutContext"
function getViewPortDimension() {
  const w = Math.max(
    document.documentElement.clientWidth,
    window.innerWidth || 0
  )
  const h = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight || 0
  )
  return { width: w, height: h }
}

function getInitialAngle() {
  const region = Math.floor(Math.random() * 4) // quadrant
  return [Math.floor(Math.random() * 51) + 20 + region * 90, region]
}
class FlyingSpriteObject {
  constructor(timeStamp, speed, dimension) {
    this.spriteDimension = { x: dimension.x, y: dimension.y }
    this.position = this.generateInitPos()
    this.lastTimeStamp = timeStamp
    const [angle, angleRegion] = getInitialAngle()
    this.angle = angle
    this.region = angleRegion
    this.rotateY = this.region === 0 || this.region === 3 ? 180 : 0
    this.speed = speed
  }

  generateInitPos() {
    let { width: maxX, height: maxY } = getViewPortDimension()
    maxY -= this.spriteDimension.y
    maxX -= this.spriteDimension.x

    return {
      x: Math.floor(Math.random() * (maxX + 1)),
      y: Math.floor(Math.random() * (maxY + 1)),
    }
  }

  getSpritePosition(timeStamp) {
    // angle tells the moving direction

    const time = timeStamp - this.lastTimeStamp
    const dist = Math.round(time * this.speed)
    const radians = (this.angle * Math.PI) / 180
    const distx = dist * Math.cos(radians)
    const disty = dist * Math.sin(radians)
    const { width, height } = getViewPortDimension()
    const maxX = width - this.spriteDimension.x
    const maxY = height - this.spriteDimension.y
    let x = this.position.x + distx
    let y = this.position.y + disty

    let newAngle
    let newAngleRegion
    if (x < 0 || x > maxX) {
      switch (this.angleRegion) {
        case 0:
          newAngle = 180 - this.angle
          newAngleRegion = 1
          break
        case 1:
          newAngle = 180 - this.angle
          newAngleRegion = 0
          break
        case 2:
          newAngle = 540 - this.angle
          newAngleRegion = 3
          break
        case 3:
          newAngle = 540 - this.angle
          newAngleRegion = 2
          break
        default:
          ;[newAngle, newAngleRegion] = getInitialAngle()
          break
      }
    }
    if (y < 0 || y > maxY) {
      switch (this.angleRegion) {
        case 0:
          newAngle = 360 - this.angle
          newAngleRegion = 3
          break
        case 1:
          newAngle = 360 - this.angle
          newAngleRegion = 2
          break
        case 2:
          newAngle = 360 - this.angle
          newAngleRegion = 1
          break
        case 3:
          newAngle = 360 - this.angle
          newAngleRegion = 0
          break
        default:
          ;[newAngle, newAngleRegion] = getInitialAngle()
          break
      }
    }

    if (newAngle) {
      this.rotateY = newAngleRegion === 0 || newAngleRegion === 3 ? 180 : 0
      this.angle = Math.max(
        Math.min(newAngle + Math.random() * 20 - 10, newAngleRegion * 90 + 70),
        20 + newAngleRegion * 90
      )
      this.angleRegion = newAngleRegion
    }

    x = Math.max(0, Math.min(x, maxX))
    y = Math.max(0, Math.min(y, maxY))
    this.lastTimeStamp = timeStamp
    this.position.x = x
    this.position.y = y
    return { x, y, rotateY: this.rotateY }
  }
}

function startAnimationFlyingSprite(
  elementRef,
  speed = 1,
  spriteDimension
) {
  let flyingSpriteObject
  let ticker
  
  function animationStep() {
    if (!elementRef.current) return
    
    const timeStamp = performance.now()
    const pos = flyingSpriteObject.getSpritePosition(timeStamp)
    
    // Direct DOM manipulation with GSAP - no React re-render, GPU accelerated
    gsap.set(elementRef.current, { 
      x: pos.x, 
      y: pos.y, 
      rotationY: pos.rotateY,
      display: 'block'
    })
  }

  // Initialize the sprite object
  const initTimeStamp = performance.now()
  flyingSpriteObject = new FlyingSpriteObject(
    initTimeStamp,
    speed,
    spriteDimension
  )
  
  // Use GSAP ticker for smooth 60fps updates
  ticker = gsap.ticker.add(animationStep)

  return () => {
    if (ticker) {
      gsap.ticker.remove(ticker)
    }
  }
}

// Constants
const SPRITE_DIMENSION = { x: 130, y: 134 }

function FlyingSprite({ style }) {
  const imgSrc = "/img/bulin.png" // Static asset path
  const spriteRef = useRef(null)

  // const context = useLayoutContext();
  const styleProps = useMemo(
    () => ({
      backgroundImage: imgSrc,
      dimension: SPRITE_DIMENSION,
      bulinZindex: 3,
    }),
    [imgSrc]
  )

  useEffect(() => {
    const cancelAnimation = startAnimationFlyingSprite(
      spriteRef,
      0.3,
      SPRITE_DIMENSION
    )
    return cancelAnimation
  }, [])

  return (
    <Box
      ref={spriteRef}
      sx={{
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: styleProps.bulinZindex,
        width: `${styleProps.dimension.x}px`,
        height: `${styleProps.dimension.y}px`,
        backgroundImage: `url(${styleProps.backgroundImage})`,
        backgroundRepeat: "no-repeat",
        '@keyframes bulinFly': {
          '100%': {
            backgroundPositionX: '-910px',
          },
        },
        animationName: 'bulinFly',
        animationDuration: '0.5s',
        animationFillMode: 'forwards',
        animationIterationCount: 'infinite',
        animationTimingFunction: 'steps(7)',
        transform: 'translate3d(0px, 0px, 0) rotateY(0deg)', // Initial transform, will be updated by GSAP
        display: "none", // Initially hidden, will be shown by animation
        // pointerEvents: "none",
        ...style,
      }}
    />
  )
}

export default FlyingSprite

/* eslint-disable react/prop-types */
import React, { useMemo, useState, useEffect } from "react"
import { makeStyles } from "@material-ui/styles"
import { graphql, useStaticQuery } from "gatsby"
import { useContext } from "react"
import useLayoutContext from "../../contexts/useLayoutContext"

const useStyles = makeStyles({
  bulin: {
    position: "fixed",
    left: "0",
    top: "0",
    "z-index": ({ bulinZindex }) => bulinZindex,
    width: ({ dimension: { x } }) => `${x}px`,
    height: ({ dimension: { y } }) => `${y}px`,
    "background-image": ({ backgroundImage }) => `url(${backgroundImage})`,
    "background-repeat": "no-repeat",
    "animation-name": "$bulinFly",
    "animation-duration": "0.5s",
    "animation-fill-mode": "forwards",
    "animation-iteration-count": "infinite",
    "animation-timing-function": "steps(7)",
    transform: "rotateY(180deg)",
    // "pointer-events": "none",
  },
  "@keyframes bulinFly": {
    "100%": {
      "background-position-x": "-910px",
    },
  },
})
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
  setDomElemState,
  speed = 1,
  spriteDimension
) {
  let flyingSpriteObject
  let rafId
  function animationStep(timeStamp) {
    rafId = requestAnimationFrame(animationStep)
    const pos = flyingSpriteObject.getSpritePosition(timeStamp)
    setDomElemState({ ...pos, display: true })
  }

  rafId = requestAnimationFrame(timeStamp => {
    // init pos
    flyingSpriteObject = new FlyingSpriteObject(
      timeStamp,
      speed,
      spriteDimension
    )
    // step
    animationStep(timeStamp)
  })

  return () => {
    cancelAnimationFrame(rafId)
  }
}

function FlyingSprite({ style }) {
  const query = graphql`
    query {
      file(relativePath: { eq: "bulin.png" }) {
        publicURL
      }
    }
  `
  const imgSrc = useStaticQuery(query).file.publicURL
  const spriteDimension = { x: 130, y: 134 }

  // const context = useLayoutContext();
  const styleProps = useMemo(
    () => ({
      backgroundImage: imgSrc,
      dimension: spriteDimension,
      bulinZindex: 3,
    }),
    [imgSrc, spriteDimension]
  )

  const [spriteState, setSpriteState] = useState({
    display: false,
    x: 0,
    y: 0,
    rotateY: 0,
  })

  const classes = useStyles(styleProps)

  useEffect(() => {
    const cancelAnimation = startAnimationFlyingSprite(
      setSpriteState,
      0.3,
      spriteDimension
    )
    return cancelAnimation
  }, [setSpriteState])

  return (
    <div
      className={classes.bulin}
      style={{
        transform: `translate3d(${spriteState.x}px,${spriteState.y}px, 0) rotateY(${spriteState.rotateY}deg)`,
        display: spriteState.display ? "block" : "none",
        ...style,
      }}
    />
  )
}

export default FlyingSprite

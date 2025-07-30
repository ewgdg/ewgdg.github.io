'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles({
  waterContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `
        linear-gradient(
          0deg,
          rgba(0, 120, 200, 0.08) 0%,
          rgba(0, 160, 220, 0.15) 30%,
          rgba(80, 180, 255, 0.22) 100%
        )
      `,
      pointerEvents: 'none',
      zIndex: 2,
    }
  },

  waterContent: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    height: '100%',
    filter: 'url(#waterDistortion)',
    willChange: 'filter',
  },

  svgFilter: {
    position: 'absolute',
    width: 0,
    height: 0,
    overflow: 'hidden',
  },

  causticOverlay: {
    position: 'absolute',
    top: '-20%',
    left: '-20%',
    right: '-20%',
    bottom: '-20%',
    width: '140%',
    height: '140%',
    background: `
      radial-gradient(ellipse 320px 180px at 25% 25%, rgba(255, 255, 255, 0.12) 0%, rgba(245, 252, 255, 0.09) 15%, rgba(230, 245, 255, 0.06) 30%, rgba(210, 235, 255, 0.03) 50%, rgba(190, 225, 255, 0.015) 65%, transparent 85%),
      radial-gradient(ellipse 280px 220px at 75% 75%, rgba(255, 255, 255, 0.1) 0%, rgba(240, 248, 255, 0.075) 12%, rgba(220, 240, 255, 0.05) 25%, rgba(200, 230, 255, 0.025) 40%, rgba(180, 220, 255, 0.01) 55%, transparent 80%),
      radial-gradient(ellipse 350px 160px at 50% 10%, rgba(255, 255, 255, 0.08) 0%, rgba(250, 253, 255, 0.06) 10%, rgba(235, 248, 255, 0.04) 22%, rgba(215, 238, 255, 0.02) 35%, rgba(195, 228, 255, 0.008) 50%, transparent 75%),
      radial-gradient(ellipse 200px 140px at 15% 80%, rgba(255, 255, 255, 0.06) 0%, rgba(240, 250, 255, 0.04) 8%, rgba(220, 240, 255, 0.025) 20%, rgba(200, 230, 255, 0.01) 40%, transparent 65%),
      radial-gradient(ellipse 240px 120px at 85% 30%, rgba(255, 255, 255, 0.05) 0%, rgba(245, 252, 255, 0.035) 10%, rgba(225, 242, 255, 0.02) 25%, rgba(205, 232, 255, 0.008) 45%, transparent 70%)
    `,
    animation: '$causticMovement1 15s ease-in-out infinite, $causticMovement2 18s ease-in-out infinite reverse',
    pointerEvents: 'none',
    zIndex: 3,
    mixBlendMode: 'screen',
    willChange: 'transform, opacity',
  },

  '@keyframes causticMovement1': {
    '0%': {
      transform: 'translate(0, 0) scale(1) rotate(0deg)',
      opacity: 0.6,
    },
    '25%': {
      transform: 'translate(4px, -2px) scale(1.05) rotate(1deg)',
      opacity: 0.8,
    },
    '50%': {
      transform: 'translate(-2px, 5px) scale(0.95) rotate(-0.5deg)',
      opacity: 0.7,
    },
    '75%': {
      transform: 'translate(6px, 2px) scale(1.08) rotate(1.5deg)',
      opacity: 0.9,
    },
    '100%': {
      transform: 'translate(0, 0) scale(1) rotate(0deg)',
      opacity: 0.6,
    }
  },

  '@keyframes causticMovement2': {
    '0%': {
      transform: 'translate(0, 0) skewX(0deg)',
    },
    '30%': {
      transform: 'translate(-3px, 3px) skewX(0.5deg)',
    },
    '60%': {
      transform: 'translate(2px, -4px) skewX(-0.3deg)',
    },
    '100%': {
      transform: 'translate(0, 0) skewX(0deg)',
    }
  }
})

export default function SVGWaterDistortion({
  children,
  style = {},
  intensity = 0.8,
  turbulenceScale = 50,
  enableCaustics = true,
  enableInteraction = true,
  ...props
}) {
  const classes = useStyles()
  const turbulenceRef = useRef(null)
  const animationRef = useRef(null)
  const containerRef = useRef(null)

  // Interactive states
  const [isClicked, setIsClicked] = useState(false)
  const [clickIntensity, setClickIntensity] = useState(1)

  // Mouse click handler
  const handleClick = useCallback((event) => {
    // Only respond to clicks that haven't been handled already and don't have pointer-events enabled elements
    if (enableInteraction &&
      !event.defaultPrevented &&
      !event.target.closest('[clickable="true"], button, a, [role="button"]')) {
      setIsClicked(true)
      setClickIntensity(2.5) // Strong initial burst

      // Start intensity reduction
      const interval = setInterval(() => {
        setClickIntensity(prev => {
          const newIntensity = prev * 0.95 // Exponential decay
          if (newIntensity <= 1.05) {
            setIsClicked(false)
            clearInterval(interval)
            return 1
          }
          return newIntensity
        })
      }, 50) // Update every 50ms for smooth transition
    }
  }, [enableInteraction])

  useEffect(() => {
    const turbulence = turbulenceRef.current
    if (!turbulence) return

    let startTime = performance.now()

    const animate = (currentTime) => {
      const elapsed = (currentTime - startTime) / 1000 // Convert to seconds

      // Create highly irregular, organic turbulence patterns
      const noise1 = Math.sin(elapsed * 0.7) * Math.cos(elapsed * 0.23)
      const noise2 = Math.cos(elapsed * 0.43) * Math.sin(elapsed * 0.67)
      const noise3 = Math.sin(elapsed * 0.91) * Math.cos(elapsed * 0.31)

      // Base frequencies with click intensity modification
      let baseFrequency1 = 0.008 + noise1 * 0.012 + noise3 * 0.004
      let baseFrequency2 = 0.006 + noise2 * 0.009 + noise1 * 0.003

      // Apply click-based intensity enhancement
      if (isClicked) {
        const clickMultiplier = clickIntensity + Math.sin(elapsed * 4) * 0.2
        baseFrequency1 *= clickMultiplier
        baseFrequency2 *= clickMultiplier
      }

      // Add irregular seed changes for more organic variation
      const seedVariation = Math.floor(elapsed * 3.7 + noise2 * 50) % 1000

      turbulence.setAttribute('baseFrequency', `${Math.abs(baseFrequency1)} ${Math.abs(baseFrequency2)}`)
      turbulence.setAttribute('seed', seedVariation)

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isClicked, clickIntensity])

  return (
    <div
      ref={containerRef}
      className={classes.waterContainer}
      onClick={handleClick}
      style={style}
      {...props}
    >
      {/* SVG Filter Definition */}
      <svg className={classes.svgFilter}>
        <defs>
          <filter id="waterDistortion" x="-20%" y="-20%" width="140%" height="140%">
            {/* Generate smooth organic turbulence */}
            <feTurbulence
              ref={turbulenceRef}
              id="turbulence1"
              baseFrequency="0.008 0.006"
              numOctaves="3"
              seed="1"
              stitchTiles="noStitch"
              type="fractalNoise"
              result="noise1"
            />

            {/* Generate secondary fine detail */}
            <feTurbulence
              id="turbulence2"
              baseFrequency="0.024 0.012"
              numOctaves="2"
              seed="73"
              stitchTiles="noStitch"
              type="fractalNoise"
              result="noise2"
            />

            {/* Blend patterns smoothly */}
            <feBlend
              in="noise1"
              in2="noise2"
              mode="lighten"
              result="combinedNoise"
            />

            {/* Convert combined noise to displacement map */}
            <feDisplacementMap
              in="SourceGraphic"
              in2="combinedNoise"
              scale={intensity * 9 * (isClicked ? clickIntensity : 1)}
              xChannelSelector="R"
              yChannelSelector="B"
              result="displacement"
            />

            {/* Add subtle color shift for underwater effect */}
            <feColorMatrix
              in="displacement"
              type="matrix"
              values="0.95 0.05 0.1 0 0.02
                      0.1 1.0 0.15 0 0.01
                      0.15 0.1 1.05 0 0.03
                      0 0 0 1 0"
              result="colorShift"
            />

            {/* Slight blur for underwater softness */}
            <feGaussianBlur
              in="colorShift"
              stdDeviation="0.3"
              result="blur"
            />

            {/* Composite everything together */}
            <feComposite
              in="blur"
              in2="SourceGraphic"
              operator="over"
            />
          </filter>
        </defs>
      </svg>

      <div className={classes.waterContent}>
        {children}
      </div>

      {enableCaustics && (
        <div className={classes.causticOverlay} />
      )}
    </div>
  )
}
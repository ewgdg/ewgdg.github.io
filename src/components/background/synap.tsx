/* eslint-disable react/jsx-props-no-spreading */

import React, { useLayoutEffect, useRef } from "react"
import { debounce } from "../../lib/performance/throttle"
import { Application, Container, Graphics, type Ticker } from "pixi.js"
import SynapGraph from "./synap-graph"

type SynapProps = {
  style?: React.CSSProperties
}

const TARGET_ANIMATION_FPS = 30
const ANIMATION_FRAME_INTERVAL_MS = 1000 / TARGET_ANIMATION_FPS
const PIXI_BASE_FRAME_MS = 1000 / 60

function Synap({ style }: SynapProps) {
  const refContainer = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    const container = refContainer.current; // <--- Save value
    if (!container) return;

    // The application will create a canvas element
    let app: Application | null = null
    try {
      app = new Application()
    } catch (error) {
      console.warn('Failed to create PIXI application:', error)
      return
    }
    if (!app) return

    const pixiApp = app

    let mounted = true;
    let tickerCallback: ((ticker: Ticker) => void) | null = null;
    let canvasSize: [number, number] | null = null;
    let onResize: (() => void) | null = null;
    let onVisibilityChange: (() => void) | null = null;
    let reducedMotionMediaQuery: MediaQueryList | null = null;
    let onReducedMotionChange: (() => void) | null = null;
    let isTickerActive = false;
    let frameAccumulatorMs = 0;
    let cleanup: (() => void) | null = null;

    // Initialize app asynchronously
    (async () => {
      try {
        await pixiApp.init({
          backgroundAlpha: 0,
          resizeTo: container,
          antialias: true,
          autoStart: false,
          // backgroundColor: 'white',
        })
        pixiApp.ticker.maxFPS = TARGET_ANIMATION_FPS
        cleanup = () => {
          pixiApp.destroy(true, true)
        }

        // Check if component is still mounted
        if (!mounted) {
          cleanup()
          return
        }

        if (pixiApp.canvas) {
          container.appendChild(pixiApp.canvas)
          canvasSize = [pixiApp.canvas.width, pixiApp.canvas.height]

          // Now that app is initialized, set up all PIXI-related functionality
          setupPIXIApp()
        } else {
          console.warn('PIXI app canvas not available after init')
        }
      } catch (error) {
        console.warn('Failed to initialize PIXI application:', error)
      }
    })();

    function setupPIXIApp() {
      reducedMotionMediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
      loadApp()

      onVisibilityChange = () => {
        updateTickerState()
      }
      onReducedMotionChange = () => {
        updateTickerState()
      }
      document.addEventListener("visibilitychange", onVisibilityChange)
      reducedMotionMediaQuery.addEventListener("change", onReducedMotionChange)
      updateTickerState()

      // Set up resize handler
      onResize = debounce(() => {
        if (!pixiApp.canvas || !canvasSize) return
        const currentCanvasSize: [number, number] = [pixiApp.canvas.width, pixiApp.canvas.height]
        if (
          currentCanvasSize[0] <= canvasSize[0] &&
          currentCanvasSize[1] <= canvasSize[1]
        ) {
          return
        }
        canvasSize = currentCanvasSize
        resetApp()
        loadApp()
      }, 100)

      window.addEventListener("resize", onResize)
    }

    // initTask is already running from the IIFE above

    function shouldAnimate() {
      return mounted && !document.hidden && !reducedMotionMediaQuery?.matches
    }

    function startTicker() {
      if (!tickerCallback || isTickerActive || !shouldAnimate()) return
      frameAccumulatorMs = 0
      pixiApp.ticker.add(tickerCallback)
      pixiApp.ticker.start()
      isTickerActive = true
    }

    function stopTicker() {
      if (!tickerCallback || !isTickerActive) return
      pixiApp.ticker.remove(tickerCallback)
      pixiApp.ticker.stop()
      isTickerActive = false
      frameAccumulatorMs = 0
    }

    function updateTickerState() {
      if (shouldAnimate()) {
        startTicker()
      } else {
        stopTicker()
      }
    }

    function resetApp() {
      // Detach ticker before destroying stage children; PIXI can otherwise tick stale Graphics refs.
      stopTicker()
      tickerCallback = null
      pixiApp.stage.removeChildren().forEach(child => {
        child.destroy()
      })
    }

    function loadApp() {
      // Use a simple initialization since no assets need loading
      function initGraphics() {
        const color = 0x787878
        const opacity = 1
        const lineWidth = 1
        const circleRadius = 4
        const graphicNodes: Graphics[] = []

        const dotContainer = new Container()
        const lineContainer = new Container()
        const edgeGraphics = new Graphics()

        // draw line first then dots
        lineContainer.addChild(edgeGraphics)
        pixiApp.stage.addChild(lineContainer)
        pixiApp.stage.addChild(dotContainer)

        type Point = [number, number]
        type Edge = [Point, Point]
        const graph = new SynapGraph(135, pixiApp.canvas)
        graph.generateGraph()

        const nodes = graph.nodes as Point[]
        const edges = graph.edges as Edge[]

        nodes.forEach(e => {
          const graphicNode = new Graphics()

          graphicNodes.push(graphicNode)

          graphicNode
            .circle(0, 0, circleRadius)
            .fill({ color: color, alpha: opacity });
          [graphicNode.x, graphicNode.y] = e;

          dotContainer.addChild(graphicNode)
        })

        function drawEdges() {
          edgeGraphics.clear()
          edges.forEach(e => {
            const [from, to] = e
            edgeGraphics
              .moveTo(from[0], from[1])
              .lineTo(to[0], to[1])
          })
          edgeGraphics.stroke({ width: lineWidth, color: color, alpha: opacity })
        }

        drawEdges()
        pixiApp.render()

        const speed = 0.25
        tickerCallback = (ticker) => {
          // Clamp elapsed time so background motion does not jump after throttled/hidden frames.
          frameAccumulatorMs += Math.min(ticker.elapsedMS, ANIMATION_FRAME_INTERVAL_MS)
          if (frameAccumulatorMs < ANIMATION_FRAME_INTERVAL_MS) return

          const deltaFrames = frameAccumulatorMs / PIXI_BASE_FRAME_MS
          frameAccumulatorMs = 0

          for (let i = 0; i < graphicNodes.length; i += 1) {
            const graphicNode = graphicNodes[i]

            const movingDistance = speed * deltaFrames
            graph.updateNode(i, movingDistance)
            const node = nodes[i];
            [graphicNode.x, graphicNode.y] = node;
          }

          drawEdges()
        }

        updateTickerState()
      }

      initGraphics()
    }

    // onResize handler is now set up in setupPIXIApp after initialization

    return () => {
      mounted = false
      if (onVisibilityChange) {
        document.removeEventListener("visibilitychange", onVisibilityChange)
      }
      if (reducedMotionMediaQuery && onReducedMotionChange) {
        reducedMotionMediaQuery.removeEventListener("change", onReducedMotionChange)
      }
      if (onResize) {
        window.removeEventListener("resize", onResize)
      }
      stopTicker()
      if (cleanup) {
        cleanup()
      }

      if (container) {
        container.childNodes.forEach(child => {
          container.removeChild(child)
        })
      }
      app = null
    }
  }, [])

  return (
    <div
      ref={refContainer}
      style={{
        position: "fixed",
        zIndex: -1,
        touchAction: "none",
        top: 0,
        left: 0,
        pointerEvents: "none",
        userSelect: "none",
        WebkitUserSelect: "none",
        ...style,
      }}
    />
  )
}

export default Synap

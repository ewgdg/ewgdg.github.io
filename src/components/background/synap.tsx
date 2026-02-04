/* eslint-disable react/jsx-props-no-spreading */

import React, { useLayoutEffect, useRef } from "react"
import { debounce } from "../../lib/performance/throttle"
import { Application, Container, Graphics, type Ticker } from "pixi.js"
import SynapGraph from "./synap-graph"

type SynapProps = {
  style?: React.CSSProperties
}

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
    let cleanup: (() => void) | null = null;

    // Initialize app asynchronously
    (async () => {
      try {
        await pixiApp.init({
          backgroundAlpha: 0,
          resizeTo: container,
          antialias: true,
          autoStart: true,
          // backgroundColor: 'white',
        })
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
      loadApp()

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

    function resetApp() {
      // to destroy ticker, need to detach the old ticker before destory to avoid app re-trigger destroy call
      if (tickerCallback) {
        pixiApp.ticker.remove(tickerCallback)
        tickerCallback = null
      }
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
        const graphicEdges: Graphics[] = []

        const dotContainer = new Container()
        const lineContainer = new Container()

        // draw line first then dots
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

        edges.forEach(e => {
          const graphicEdge = new Graphics()
          graphicEdges.push(graphicEdge)
          const [from, to] = e
          graphicEdge
            .moveTo(from[0], from[1])
            .lineTo(to[0], to[1])
            .stroke({ width: lineWidth, color: color, alpha: opacity })
          lineContainer.addChild(graphicEdge)
        })

        const speed = 0.25
        tickerCallback = (ticker) => {
          for (let i = 0; i < graphicNodes.length; i += 1) {
            const graphicNode = graphicNodes[i]

            const movingDistance = speed * ticker.deltaTime
            graph.updateNode(i, movingDistance)
            const node = nodes[i];
            [graphicNode.x, graphicNode.y] = node;
          }

          for (let i = 0; i < graphicEdges.length; i += 1) {
            const edge = edges[i]
            const graphicEdge = graphicEdges[i]
            const [from, to] = edge
            graphicEdge.clear()
            graphicEdge
              .moveTo(from[0], from[1])
              .lineTo(to[0], to[1])
              .stroke({ width: lineWidth, color: color, alpha: opacity })
          }
        }

        pixiApp.ticker.add(tickerCallback)
      }

      initGraphics()
    }

    // onResize handler is now set up in setupPIXIApp after initialization

    return () => {
      mounted = false
      if (cleanup) {
        cleanup()
      }

      if (container) {
        container.childNodes.forEach(child => {
          container.removeChild(child)
        })
      }
      app = null
      if (onResize) {
        window.removeEventListener("resize", onResize)
      }
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

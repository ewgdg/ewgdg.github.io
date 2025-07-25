/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */

import React, { useLayoutEffect, useRef } from "react"
// import * as PIXI from "pixi.js"
import { debounce } from "../../utils/throttle"
import { Application, Container, Graphics } from 'pixi.js';
import SynapGraph from "./SynapGraph"
// console.log(PIXI)
function Synap({ style }) {
  const refContainer = useRef(null)

  useLayoutEffect(() => {
    const container = refContainer.current; // <--- Save value
    if (!container) return;

    // The application will create a canvas element
    let app
    try {
      app = new Application()
    } catch (error) {
      console.warn('Failed to create PIXI application:', error)
      return
    }

    let mounted = true;
    let tickerCallback = null;
    let canvasSize = null;
    let onResize = null;
    let cleanup = null;

    // Initialize app asynchronously
    (async () => {
      try {
        await app.init({
          backgroundAlpha: 0,
          resizeTo: container,
          antialias: true,
          autoStart: true,
          // backgroundColor: 'white',
        })
        cleanup = () => {
          tra
          app.destroy(rendererDestroyOptions = true, options = true)
        }

        // Check if component is still mounted
        if (!mounted) {
          cleanup()
          return
        }

        if (app.canvas) {
          container.appendChild(app.canvas)
          canvasSize = [app.canvas.width, app.canvas.height]

          // Now that app is initialized, set up all PIXI-related functionality
          setupPIXIApp()
        } else {
          console.warn('PIXI app canvas not available after init')
        }
      } catch (error) {
        console.warn('Failed to initialize PIXI application:', error)
      }
    })();

    const setupPIXIApp = () => {
      loadApp()

      // Set up resize handler
      onResize = debounce(() => {
        if (!app.canvas || !canvasSize) return
        const currentCanvasSize = [app.canvas.width, app.canvas.height]
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
        app.ticker.remove(tickerCallback)
        tickerCallback = null
      }
      app.stage.removeChildren().forEach(child => {
        child.destroy()
      })
    }

    const loadApp = () => {
      // Use a simple initialization since no assets need loading
      const initGraphics = () => {
        const color = 0x787878
        const opacity = 1
        const lineWidth = 1
        const circleRadius = 4
        const graphicNodes = []
        const graphicEdges = []

        const dotContainer = new Container()
        const lineContainer = new Container()

        // draw line first then dots
        app.stage.addChild(lineContainer)
        app.stage.addChild(dotContainer)

        const graph = new SynapGraph(135, app.canvas)
        graph.generateGraph()

        graph.nodes.forEach(e => {
          const graphicNode = new Graphics()

          graphicNodes.push(graphicNode)

          graphicNode
            .circle(0, 0, circleRadius)
            .fill({ color: color, alpha: opacity });
          [graphicNode.x, graphicNode.y] = e;

          dotContainer.addChild(graphicNode)
        })

        graph.edges.forEach(e => {
          const graphicEdge = new Graphics()
          graphicEdges.push(graphicEdge)
          graphicEdge
            .moveTo(...e[0])
            .lineTo(...e[1])
            .stroke({ width: lineWidth, color: color, alpha: opacity })
          lineContainer.addChild(graphicEdge)
        })

        const speed = 0.25
        tickerCallback = (ticker) => {
          for (let i = 0; i < graphicNodes.length; i += 1) {
            const graphicNode = graphicNodes[i]

            const movingDistance = speed * ticker.deltaTime
            graph.updateNode(i, movingDistance)
            const node = graph.nodes[i];
            [graphicNode.x, graphicNode.y] = node;
          }

          for (let i = 0; i < graphicEdges.length; i += 1) {
            const edge = graph.edges[i]
            const graphicEdge = graphicEdges[i]
            graphicEdge.clear()
            graphicEdge
              .moveTo(...edge[0])
              .lineTo(...edge[1])
              .stroke({ width: lineWidth, color: color, alpha: opacity })
          }
        }

        app.ticker.add(tickerCallback)
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

/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
// import * as PIXI from "pixi.js"
import * as PIXI from "plugins/PIXI"
import React, { useLayoutEffect, useRef } from "react"
import { debounce } from "utilities/throttle"
import SynapGraph from "./SynapGraph"
// console.log(PIXI)
function Synap({ style }) {
  const refContainer = useRef(null)

  useLayoutEffect(() => {
    // The application will create a canvas element
    let app = new PIXI.Application({
      transparent: true,
      resizeTo: refContainer.current,
      antialias: true,
      autoStart: true,
      // forceCanvas: true,
    })

    refContainer.current.appendChild(app.view)

    let tickerCallback = null

    let canvasSize = [app.view.width, app.view.height]

    function resetApp() {
      // to destroy ticker, need to detach the old ticker before destory to avoid app re-trigger destroy call
      app.ticker.remove(tickerCallback)
      app.stage.removeChildren().forEach(child => {
        child.destroy()
      })
    }

    const loadApp = () => {
      app.loader.load((loader, resources) => {
        const color = 0x787878
        const opacity = 1
        const lineWidth = 1
        const circleRadius = 4
        const graphicNodes = []
        const graphicEdges = []

        const dotContainer = new PIXI.Container()
        const lineContainer = new PIXI.Container()

        // draw line first then dots
        app.stage.addChild(lineContainer)
        app.stage.addChild(dotContainer)

        const graph = new SynapGraph(135, app.view)
        graph.generateGraph()

        graph.nodes.forEach(e => {
          const graphicNode = new PIXI.Graphics()

          graphicNodes.push(graphicNode)

          graphicNode.beginFill(color, opacity)
          graphicNode.lineStyle(2, 0xffffff, 1, 1)
          graphicNode.drawCircle(0, 0, circleRadius)
          graphicNode.endFill()
          ;[graphicNode.x, graphicNode.y] = e

          dotContainer.addChild(graphicNode)
        })

        graph.edges.forEach(e => {
          const graphicEdge = new PIXI.Graphics()
          graphicEdges.push(graphicEdge)
          graphicEdge.lineStyle(lineWidth, color, opacity, 0.5, true)
          graphicEdge.moveTo(...e[0])
          graphicEdge.lineTo(...e[1])
          lineContainer.addChild(graphicEdge)
        })

        const speed = 0.25
        tickerCallback = deltaTime => {
          for (let i = 0; i < graphicNodes.length; i += 1) {
            const graphicNode = graphicNodes[i]

            const movingDistance = speed * deltaTime
            graph.updateNode(i, movingDistance)
            const node = graph.nodes[i]
            ;[graphicNode.x, graphicNode.y] = node
          }

          for (let i = 0; i < graphicEdges.length; i += 1) {
            const edge = graph.edges[i]
            const graphicEdge = graphicEdges[i]
            graphicEdge.clear()
            graphicEdge.lineStyle(lineWidth, color, opacity, 0.5, true)
            graphicEdge.moveTo(...edge[0])
            graphicEdge.lineTo(...edge[1])

            graphicEdge.endFill()
          }
        }

        app.ticker.add(tickerCallback)
      })
    }
    loadApp()

    const onResize = debounce(() => {
      const currentCanvasSize = [app.view.width, app.view.height]
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

    return () => {
      app.destroy(true)
      refContainer.current.childNodes.forEach(child => {
        refContainer.current.removeChild(child)
      })
      app = null
      window.removeEventListener("resize", onResize)
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
        ...style,
      }}
    />
  )
}

export default Synap

/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useRef, useLayoutEffect } from "react"
import * as PIXI from "pixi.js"
import SynapGraph from "./SynapGraph"

function Synap({ style }) {
  const refContainer = useRef(null)
  useLayoutEffect(() => {
    // The application will create a canvas element
    const app = new PIXI.Application({
      transparent: true,
      resizeTo: refContainer.current,
    })

    refContainer.current.appendChild(app.view)

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

      const graph = new SynapGraph(100, app.view)
      graph.generateGraph()

      graph.nodes.forEach(e => {
        const graphicNode = new PIXI.Graphics()

        graphicNodes.push(graphicNode)

        graphicNode.beginFill(color, opacity)
        graphicNode.lineStyle(2, 0xffffff, 1, 1)
        graphicNode.drawCircle(0, 0, circleRadius)
        graphicNode.endFill()

        // add to container
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

      const speed = 0.2
      app.ticker.add(deltaTime => {
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
      })
    })

    return () => {
      refContainer.current.removeChild(app.view)
      app.destroy()
    }
  }, [])
  return (
    <div
      ref={refContainer}
      style={{
        position: "fixed",
        zIndex: -1,
        ...style,
      }}
    />
  )
}

export default Synap

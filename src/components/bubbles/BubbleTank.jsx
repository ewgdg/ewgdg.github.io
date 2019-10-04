/* eslint-disable react/prop-types */
import React, { useEffect, useRef } from "react"
import uuid from "uuid/v4"
import GridList from "@material-ui/core/GridList"
import GridListTile from "@material-ui/core/GridListTile"
import { makeStyles } from "@material-ui/styles"
import ListSubheader from "@material-ui/core/ListSubheader"
import Bubble from "./Bubble"
import ParallaxSection from "../decorators/ParallaxSection"

const useStyles = makeStyles({
  gridList: {
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    // transform: "translateZ(0)",
    pointerEvents: "none",
    overflow: "hidden",
    backgroundColor: "rgba(12, 164, 255, 0.3)",
  },
})

const useTileStyles = makeStyles({
  root: {
    // border: "1px solid red",
    // height: "50vh",
    margin: 0,
    padding: 0,
    overflow: "visible",
  },
  tile: {
    // border: "1px solid black",
    margin: 0,
    padding: 0,
    overflow: "visible",
  },
})
function useInitCells(dataSize, cellsPerRow) {
  const willMount = useRef(true)

  // useEffect is called after component is mounted
  useEffect(() => {
    willMount.current = false
    return () => {
      willMount.current = true
    }
  }, [dataSize, cellsPerRow])

  const prob = 1.5 / cellsPerRow
  const cells = useRef(null)
  if (willMount.current) {
    cells.current = []
    // init
    let currentIndex = 0
    while (currentIndex < dataSize) {
      if (Math.random() < prob) {
        cells.current.push(currentIndex)
        currentIndex += 1
      } else {
        cells.current.push(-1)
      }
    }
  }
  return cells.current
}
function random(min, max, isInteger = true) {
  let res = Math.random() * (max - min + 1)
  if (isInteger) res = Math.floor(res)
  return res + min
}
function useInitBubbles(dataSize, cellHeight, cellsPerRow) {
  const willMount = useRef(true)

  // useEffect is called after component is mounted
  useEffect(() => {
    willMount.current = false
    return () => {
      willMount.current = true
    }
  }, [dataSize, cellsPerRow])

  const bubbles = useRef(null)
  if (willMount.current) {
    const colors = [
      "Violet",
      "Aqua",
      "Orange",
      "skyblue",
      "SlateBlue",
      "Gray",
      "gold",
      "pink",
      "#e91e63",
      "#e91e63",
      "#ff9e80",
      "#1de9b6",
      "#c2185b",
      "#8bc34a",
      "#b39ddb",
      "DodgerBlue",
      "Tomato",
      "Orange",
      "MediumSeaGreen",
    ]
    bubbles.current = []
    // init
    const cellWidth = window.innerWidth / cellsPerRow
    for (let i = 0; i < dataSize; i += 1) {
      const maxRadius = Math.min(cellHeight, cellWidth) / 1.5
      const radius = random(maxRadius / 2, maxRadius, false)
      const bubbleColor = colors[random(0, colors.length - 1)]
      let cols = 1
      let rows = 1
      if (radius * 2 > cellHeight) {
        rows = 2
      }
      if (radius * 2 > cellWidth) {
        cols = 2
      }
      const maxX = cellWidth * cols - radius * 2
      const maxY = cellHeight * rows - radius * 2
      const bubblePosInCell = [random(0, maxX, false), random(0, maxY, false)]
      const boundingOffset = radius

      bubbles.current.push({
        color: bubbleColor,
        pos: bubblePosInCell,
        radius,
        rows,
        cols,
        boundings: {
          minX: 0 - boundingOffset,
          maxX: cols * cellWidth - radius * 2 + boundingOffset,
          maxY: rows * cellHeight - radius * 2 + boundingOffset,
          minY: 0 - boundingOffset,
        },
      })
    }
  }
  return bubbles.current
}

export default function BubbleTank({
  cellHeight = 200,
  cellsPerRow = 5,
  data,
  header = null,
}) {
  const classes = useStyles()
  const tileClasses = useTileStyles()

  const dataSize = data.length
  const bubbles = useInitBubbles(dataSize, cellHeight, cellsPerRow)
  const cells = useInitCells(dataSize, cellsPerRow)
  const viewportHeight = window.innerHeight
  return (
    <GridList
      spacing={0}
      className={classes.gridList}
      cols={cellsPerRow}
      cellHeight={cellHeight}
    >
      {header && (
        <GridListTile
          key="Subheader"
          cols={cellsPerRow}
          style={{ height: "auto", margin: "20px" }}
        >
          <ListSubheader
            component="div"
            style={{
              textAlign: "center",
              color: "black",
              opacity: 1,
            }}
          >
            <h1>{header}</h1>
          </ListSubheader>
        </GridListTile>
      )}
      {cells.map(index => {
        let component = null
        let bubble = null

        if (index >= 0) {
          bubble = bubbles[index]
          component = (
            <Bubble
              radius={bubble.radius}
              style={{
                color: "white",
                backgroundColor: bubble.color,
                position: "absolute",
                top: `${bubble.pos[1]}px`,
                left: `${bubble.pos[0]}px`,
              }}
              boundings={bubble.boundings}
            >
              {data[index]}
            </Bubble>
          )
        }

        return (
          <GridListTile
            classes={tileClasses}
            key={uuid()}
            cols={bubble ? bubble.cols : 1}
            rows={bubble ? bubble.rows : 1}
          >
            <ParallaxSection
              style={{
                overflow: "visible",
                pointerEvents: "none",
                height: "auto",
                width: "auto",
              }}
              triggerHook={0.5}
              maxProgressValue={Math.random() * viewportHeight}
              progressUnit="px"
              fade={Math.random()}
            >
              {component}
            </ParallaxSection>
          </GridListTile>
        )
      })}
      <GridListTile
        key={uuid()}
        style={{ border: "1px solid black" }}
        cols={2}
        rows={2}
      >
        <div>Featured</div>
      </GridListTile>
      <GridListTile
        key={uuid()}
        style={{ border: "1px solid black" }}
        cols={1}
        rows={1}
      >
        <div>Featured s</div>
      </GridListTile>
    </GridList>
  )
}

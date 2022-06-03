/* eslint-disable react/no-array-index-key */
/* eslint-disable no-param-reassign */
/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useMemo, useState } from "react"
import GridList from "@material-ui/core/GridList"
import GridListTile from "@material-ui/core/GridListTile"
import { makeStyles } from "@material-ui/styles"
import ListSubheader from "@material-ui/core/ListSubheader"
import { debounce } from "../../utils/throttle"
import Bubble from "./Bubble"
import ParallaxSection from "../sections/ParallaxSection"

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
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}
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
  let res = Math.random() * (max - min + (isInteger ? 1 : 0))
  if (isInteger) res = Math.floor(res)
  return res + min
}

function useInitBubbles(dataSize, cellHeight, cellsPerRow) {
  const [isMounted, setIsMounted] = useState(false)
  const [shouldInit, setShouldInit] = useState(false)

  // useEffect is called after component is mounted
  useEffect(() => {
    setIsMounted(true)
    return () => {
      setIsMounted(false)
    }
  }, [dataSize, cellsPerRow])

  const bubbles = useRef(null)
  if (!isMounted || shouldInit) {
    if (shouldInit) {
      setShouldInit(false)
    }
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
    cellHeight = Math.min(cellWidth * 1.5, cellHeight)
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
        fade: random(0.3, 1, false),
        maxProgress: random(0, 0.8, false),
      })
    }
  }
  return [bubbles.current, setShouldInit]
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
  const [bubbles, setShouldInitBubbles] = useInitBubbles(
    dataSize,
    cellHeight,
    cellsPerRow
  )
  const cells = useInitCells(dataSize, cellsPerRow)
  // const [update, setUpdate] = useState({})
  useEffect(() => {
    function onresize() {
      // willMountBubble.current = true
      // need to re-mount bubbles to adjust size
      setShouldInitBubbles(true)
      // setUpdate({})
    }
    const debounced = debounce(onresize, 100)
    window.addEventListener("resize", debounced)
    return () => {
      window.removeEventListener("resize", debounced)
    }
  }, [setShouldInitBubbles])

  const viewportHeight = window.innerHeight
  const unorderedData = useMemo(() => {
    const copy = [...data]
    shuffle(copy)
    return copy
  }, [data])
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
      {cells.map((bubbleIndex, i) => {
        let component = null
        let bubbleProps = null
        // get the bubble index for each cell
        if (bubbleIndex >= 0) {
          bubbleProps = bubbles[bubbleIndex]
          const bubbleData = unorderedData[bubbleIndex]
          component = (
            <Bubble
              radius={bubbleProps.radius}
              style={{
                color: "white",
                backgroundColor: bubbleProps.color,
                position: "absolute",
                top: `${bubbleProps.pos[1]}px`,
                left: `${bubbleProps.pos[0]}px`,
              }}
              boundings={bubbleProps.boundings}
              title={bubbleData.title}
              description={bubbleData.description}
              image={bubbleData.image}
              links={bubbleData.links}
              key={bubbleIndex}
            >
              {bubbleData.title}
            </Bubble>
          )
        }

        return (
          <GridListTile
            classes={tileClasses}
            key={i}
            cols={bubbleProps ? bubbleProps.cols : 1}
            rows={bubbleProps ? bubbleProps.rows : 1}
          >
            <ParallaxSection
              style={{
                overflow: "visible",
                pointerEvents: "none",
                height: "auto",
                width: "auto",
              }}
              triggerHook={0.5}
              maxProgressValue={
                bubbleProps ? bubbleProps.maxProgress * viewportHeight : 0
              }
              progressUnit="px"
              fade={bubbleProps ? bubbleProps.fade : 0}
            >
              {component}
            </ParallaxSection>
          </GridListTile>
        )
      })}
    </GridList>
  )
}

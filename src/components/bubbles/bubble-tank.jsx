'use client'

/* eslint-disable react/no-array-index-key */
/* eslint-disable no-param-reassign */
/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useMemo, useState } from "react"
import ImageList from "@mui/material/ImageList"
import ImageListItem from "@mui/material/ImageListItem"
import { makeStyles } from "@mui/styles"
import ListSubheader from "@mui/material/ListSubheader"
import { debounce } from "../../lib/performance/throttle"
import Bubble from "./bubble"
import ParallaxSection from "../sections/parallax-section"
import Section from "../page-scroll/section"
import { Create } from "@mui/icons-material"
import PageContainer, { SectionTypes } from "../page-scroll/container"

const useStyles = makeStyles({
  gridList: {
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    // transform: "translateZ(0)",
    pointerEvents: "none",
    overflow: "visible",
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
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function random(min, max, isInteger = true) {
  let res = Math.random() * (max - min + (isInteger ? 1 : 0))
  if (isInteger) res = Math.floor(res)
  return res + min
}

function initBubbles(dataSize, cellHeight, cellsPerRow) {
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
  // init
  const cellWidth = window.innerWidth / cellsPerRow
  cellHeight = Math.min(cellWidth * 1.5, cellHeight)
  const viewportHeight = window.innerHeight
  const cellsPerCol = Math.max(2, Math.round(viewportHeight / cellHeight))
  cellHeight = viewportHeight / cellsPerCol

  const generateBubble = (pivotX, pivotY) => {
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
    const maxX = pivotX + cellWidth * cols - radius * 2
    const maxY = pivotY + cellHeight * rows - radius * 2
    const bubblePosInCell = [random(pivotX, maxX, false), random(pivotY, maxY, false)]
    const boundingOffset = radius

    let scrollEffectMaxProgress = random(0, 0.8, false);
    // only half of the bubbles have scroll effect
    if (scrollEffectMaxProgress < 0.4) {
      scrollEffectMaxProgress = 0;
    }
    return {
      color: bubbleColor,
      pos: bubblePosInCell,
      radius,
      rows,
      cols,
      boundaries: {
        minX: pivotX - boundingOffset,
        maxX: maxX + boundingOffset,
        maxY: maxY + boundingOffset,
        minY: pivotY - boundingOffset,
      },
      fade: random(0.3, 0.8, false),
      maxProgress: scrollEffectMaxProgress,
    }
  }

  // fill the grid with bubbles
  // expect to have 1.5 bubbles per row
  const prob = 1.5 / cellsPerRow
  const grids = []
  let bubbleIndex = 0
  let bubbles = []
  let row = 0
  let col = 0

  while (bubbleIndex < dataSize) {
    if (Math.random() < prob) {
      bubbles.push(generateBubble(col * cellWidth, row * cellHeight))
      bubbleIndex += 1
    }

    if ((row >= cellsPerCol - 1 && col >= cellsPerRow - 1) || bubbleIndex >= dataSize) {
      if (bubbles.length > 0) {
        grids.push({ bubbles, height: cellHeight * (row + 1) })
      }
    }

    col += 1
    if (col >= cellsPerRow) {
      row += 1
      col = 0
    }

    if (row >= cellsPerCol) {
      bubbles = []
      row = 0
      col = 0
    }
  }
  return { grids, cellWidth, cellHeight }
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
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight })
  const { grids, cellWidth, cellHeight: newCellHeight } = useMemo(() => initBubbles(dataSize, cellHeight, cellsPerRow), [dataSize, cellHeight, cellsPerRow])
  cellHeight = newCellHeight

  useEffect(() => {
    function onresize() {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }
    const debounced = debounce(onresize, 100)
    window.addEventListener("resize", debounced)
    return () => {
      window.removeEventListener("resize", debounced)
    }
  }, [])

  const unorderedData = useMemo(() => {
    const copy = [...data]
    shuffle(copy)
    return copy
  }, [data])

  let dataIndex = 0

  const sections = grids.map((grid, i) => {
    let gridHeight = grid.height
    if (i == grids.length - 1) {
      if (gridHeight < windowSize.height) {
        //add some padding for the last section
        gridHeight = Math.min(windowSize.height, gridHeight + cellHeight)
      }
    }
    return (
      <Section
        key={`section-${i}`}
        height="auto"
      >
        <div style={{ position: "relative", height: `${gridHeight}px` }} >
          {grid.bubbles.map((bubbleProps) => {
            const bubbleData = unorderedData[dataIndex++]
            return (
              <ParallaxSection
                style={{
                  overflow: "visible",
                  pointerEvents: "none",
                  height: "auto",
                  width: "auto",
                }}
                className={tileClasses.root}
                triggerHook={0.5}
                maxProgressValue={
                  bubbleProps ? bubbleProps.maxProgress * windowSize.height : 0
                }
                progressUnit="px"
                fade={bubbleProps ? bubbleProps.fade : 0}
                key={bubbleData.title}
              >
                <Bubble
                  radius={bubbleProps.radius}
                  style={{
                    color: "white",
                    backgroundColor: bubbleProps.color,
                    position: "absolute",
                    left: bubbleProps.pos[0],
                    top: bubbleProps.pos[1],
                  }}
                  bounds={bubbleProps.boundaries}
                  initPos={{ x: bubbleProps.pos[0], y: bubbleProps.pos[1] }}
                  title={bubbleData.title}
                  description={bubbleData.description}
                  image={bubbleData.image}
                  links={bubbleData.links}
                // key={bubbleData.title}
                >
                  {bubbleData.title}
                </Bubble>
              </ParallaxSection>
            )
          })}
        </div>
      </Section>
    )
  })

  return (
    <div className={classes.gridList}>
      {sections}
    </div>
  )
}

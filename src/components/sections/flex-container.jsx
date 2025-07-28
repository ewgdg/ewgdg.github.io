'use client'

/* eslint-disable react/prop-types */
import { makeStyles } from "@mui/styles"
import { calcViewportHeight } from "../../lib/dom/viewport-utils"

import React from "react"

const useStyles = makeStyles({
  flexContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: calcViewportHeight(100),
  },
})

function FlexContainer({ children, style, className }) {
  const classes = useStyles()
  return (
    <div className={`${classes.flexContainer} ${className}`} style={style}>
      {children}
    </div>
  )
}

export default FlexContainer

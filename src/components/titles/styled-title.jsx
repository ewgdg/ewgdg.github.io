'use client'

/* eslint-disable react/jsx-one-expression-per-line */
import React from "react"
import { makeStyles } from "@mui/styles"
import { calcViewportWidth } from "../../lib/dom/viewport"

const useStyles = makeStyles({
  container: {
    textAlign: "center",
  },
  heading: {
    position: "relative",
    display: "inline-block",
    "&:before": {
      display: "inline-block",
      content: '""',
      width: calcViewportWidth(7),
      backgroundColor: "black",
      height: "2px",
      margin: "0 10px",
      position: "absolute",
      top: "50%",
      right: "100%",
    },
    "&:after": {
      display: "inline-block",
      content: '""',
      width: calcViewportWidth(7),
      backgroundColor: "black",
      height: "2px",
      margin: "0 10px",
      position: "absolute",
      top: "50%",
      left: "100%",
    },
  },
})

function StyledTitle({ title, style }) {
  const classes = useStyles()
  
  return (
    <div className={classes.container} style={style}>
      <h2 className={classes.heading}>
        <strong> {title} </strong>
      </h2>
    </div>
  )
}

export default StyledTitle

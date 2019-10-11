/* eslint-disable react/jsx-one-expression-per-line */
import React from "react"
import { makeStyles } from "@material-ui/styles"

const useStyles = makeStyles({
  heading: {
    position: "relative",
    display: "inline-block",
    "&:before": {
      display: "inline-block",
      content: '""',
      width: "7vw",
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
      width: "7vw",
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
    <div style={{ textAlign: "center", ...style }}>
      <h2 className={classes.heading}>
        <strong> {title} </strong>
      </h2>
    </div>
  )
}

export default StyledTitle

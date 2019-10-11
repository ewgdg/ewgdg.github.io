import { makeStyles } from "@material-ui/styles"

import React from "react"

const useStyles = makeStyles({
  flexContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100vh",
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

import React from "react"
import Grid from "@material-ui/core/Grid"

function CardContainer({ children, style }) {
  return (
    <Grid container spacing={3} justify="space-evenly" style={style}>
      {children}
    </Grid>
  )
}

export default CardContainer

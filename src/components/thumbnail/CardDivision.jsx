import React from "react"
import Grid from "@material-ui/core/Grid"

// eslint-disable-next-line react/prop-types
function CardContainer({ children, style }) {
  return (
    // https://stackoverflow.com/questions/19718634/how-to-disable-margin-collapsing
    // display inline-block to prevent margin collapse to parent
    <div
      style={{
        display: "inline-block",
        width: "100%",
        margin: "0",
        height: "100%",
      }}
    >
      <Grid
        container
        spacing={3}
        justifyContent="space-around"
        style={{ height: "100%", ...style }}
      >
        {children}
      </Grid>
    </div>
  )
}

export default CardContainer

import React from "react"
import Paper from "@material-ui/core/Paper"

// eslint-disable-next-line react/prop-types
const Message = ({ children, color }) => {
  return (
    <Paper
      variant="outlined"
      style={{
        width: "auto",
        backgroundColor: color || "white",
        display: "inline-block",
        padding: "1px 0.5rem",
        margin: "1px",
        maxWidth: "80%",
      }}
    >
      {children}
    </Paper>
  )
}

export default Message

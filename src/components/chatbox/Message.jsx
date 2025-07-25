import React from "react"
import Paper from "@mui/material/Paper"

// eslint-disable-next-line react/prop-types
const Message = ({ children, color }) => {
  return (
    <Paper
      variant="outlined"
      style={{
        width: "auto",
        backgroundColor: color || "white",
        display: "inline-flex",
        padding: "1px 0.5rem",
        margin: "1px",
        maxWidth: "80%",

        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {children}
    </Paper>
  )
}

export default Message

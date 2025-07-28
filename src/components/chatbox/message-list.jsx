'use client'

import React, { useRef, useLayoutEffect, useEffect } from "react"
import PropTypes from "prop-types"
import Box from "@mui/material/Box"
import { makeStyles } from "@mui/styles"
import CircularProgress from "@mui/material/CircularProgress"
import Message from "./message"

const useStyles = makeStyles({
  box: {
    height: "15vh",
    width: "100%",
    overflow: "auto scroll",
  },
})

const MessageList = ({ messages }) => {
  const classes = useStyles()
  const outerRef = useRef({})
  useLayoutEffect(() => {
    if (!outerRef.current) return () => {}
    outerRef.current.scrollTop = outerRef.current.scrollHeight

    return () => {}
  }, [messages])
  return (
    <Box ref={outerRef} className={classes.box}>
      {messages.map((message, i) => {
        return (
          <Box
            display="flex"
            flexDirection={message.fromClient ? "row-reverse" : "row"}
            flexWrap="wrap"
            style={{ margin: "0.3rem 0" }}
            // eslint-disable-next-line react/no-array-index-key
            key={i}
          >
            <Message color={message.fromClient ? "#25b7fa" : "#b3bcbc"}>
              {message.loading ? (
                <CircularProgress
                  size="1rem"
                  style={{ margin: "1px", padding: "1px" }}
                />
              ) : (
                message.data
              )}
            </Message>
          </Box>
        )
      })}
    </Box>
  )
}

MessageList.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  messages: PropTypes.array.isRequired,
}
export default React.memo(MessageList)

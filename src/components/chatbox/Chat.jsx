import React, { useRef } from "react"
import ChatIcon from "@material-ui/icons/Chat"
import Popper from "@material-ui/core/Popper"
import { makeStyles } from "@material-ui/core/styles"
import useScrollTrigger from "../pageScroll/useScrollTrigger"

const useStyles = makeStyles({
  icon: {
    position: "absolute",
    bottom: "2rem",
    right: "2rem",
  },
})

function Chat() {
  const classes = useStyles()
  // useRef wont notify the change , but it is ok bc the ref is asked when user call it after ref is settled
  const iconRef = useRef()
  const trigger = useScrollTrigger({
    threshold: 100,
  })
  return (
    <div style={{ display: trigger ? "none" : "block" }}>
      <ChatIcon ref={iconRef} className={classes.icon} />
      <Popper
        placement="bottom"
        disablePortal={false}
        modifiers={{
          flip: {
            enabled: true,
          },
          preventOverflow: {
            enabled: true,
            boundariesElement: "viewport",
          },
          arrow: {
            enabled: true,
            element: iconRef,
          },
        }}
      >
        <div>test</div>
      </Popper>
    </div>
  )
}

export default Chat

import React, { useState, useCallback, useRef } from "react"
import ChatIcon from "@material-ui/icons/Chat"
import Popover from "@material-ui/core/Popover"
import { makeStyles } from "@material-ui/core/styles"
import Zoom from "@material-ui/core/Zoom"
import {
  usePopupState,
  bindTrigger,
  bindPopover,
} from "material-ui-popup-state/hooks"
import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import useScrollTrigger from "../pageScroll/useScrollTrigger"
import MessageList from "./MessageList"

const useStyles = makeStyles({
  icon: {
    position: ({ icon }) => icon.position || "fixed",
    bottom: ({ icon }) => icon.bottom || "50%",
    left: ({ icon }) => icon.left || "55%",
    fontSize: "3.5rem",
    "&:hover": {
      color: "#93f145",
    },
  },
  box: {},
})

// eslint-disable-next-line react/prop-types
function Chat({ iconStyle }) {
  const popupState = usePopupState({
    variant: "popover",
    popupId: "chatPopover",
  })
  const classes = useStyles({ icon: iconStyle || {} })
  // useRef wont notify the change , but it is ok bc the ref is asked when user call it after ref is settled
  // const iconRef = useRef()
  const trigger = useScrollTrigger({
    threshold: 100,
  })

  const [messages, setMessages] = useState([])

  // we can replace this with update setUpdate = useState simply for rerender when we have textRef
  const [text, setText] = useState("")
  const textRef = useRef(text)
  const sendMessage = useCallback(() => {
    if (textRef.current) {
      setMessages(oldmsgs => [
        ...oldmsgs,
        { data: textRef.current, fromClient: true },
      ])
      setText("")
    }
  }, [setMessages, textRef])

  const onTextChange = useCallback(
    e => {
      if (!e.target) return
      setText(e.target.value)
      textRef.current = e.target.value
    },
    [setText]
  )

  return (
    <div>
      <Zoom in={!trigger}>
        <ChatIcon
          className={classes.icon}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...bindTrigger(popupState)}
        />
      </Zoom>
      <Popover
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...bindPopover(popupState)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
      >
        <Box>
          <Box className={classes.box}>
            <MessageList messages={messages} />
          </Box>
          <Box display="flex" flexDirection="column">
            <textarea
              placeholder="Type message.."
              required
              onChange={onTextChange}
              value={text}
            />
            <Box display="flex" flexDirection="row" justifyContent="flex-end">
              <Button
                size="small"
                variant="contained"
                color="primary"
                style={{ margin: "1px" }}
                onClick={sendMessage}
              >
                send
              </Button>
            </Box>
          </Box>
        </Box>
      </Popover>
    </div>
  )
}

export default Chat

'use client'

import React, { useState, useCallback, useRef, useEffect } from "react"
import ChatIcon from "@mui/icons-material/Chat"
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover"
import Zoom from "@mui/material/Zoom"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import useScrollTrigger from "../page-scroll/use-scroll-trigger"
import MessageList from "./message-list"
import * as chatbot from "./chatbot-api"


// eslint-disable-next-line react/prop-types
function Chat({ iconStyle = {} }) {
  const [isOpen, setIsOpen] = useState(false)
  const iconRef = useRef(null)
  const trigger = useScrollTrigger({
    threshold: 100,
  })

  const [messages, setMessages] = useState([])
  const [text, setText] = useState("")
  const textRef = useRef(text)

  const waitForResponse = useCallback(
    async req => {
      const replyObj = {
        loading: true,
      }
      setMessages(prev => {
        const newMessages = [...prev, replyObj]

        // Get last 3 messages, filtering out error messages using type field
        const validMessages = prev.filter(msg =>
          msg.data &&
          msg.type !== "error" &&
          !msg.loading
        ).slice(-3)

        // Build messages array with roles for API
        const messagesForAPI = [
          ...validMessages.map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: typeof msg.data === 'string' ? msg.data : msg.data.response || msg.data
          })),
          {
            role: 'user',
            content: req
          }
        ]

        // Make the API call with message context
        chatbot.requestReply(messagesForAPI).then(reply => {
          replyObj.loading = false
          replyObj.data = reply.response
          replyObj.type = reply.type
          setMessages(current => [...current])
        })

        return newMessages
      })
    },
    [setMessages]
  )
  const [controllable, setControllable] = useState(true)
  const [anchorPosition, setAnchorPosition] = useState(null)

  // Calculate and set anchor position when popover opens - center in viewport
  useEffect(() => {
    if (isOpen) {
      setAnchorPosition({
        top: window.innerHeight / 2,
        left: window.innerWidth / 2,
      })
    } else {
      setAnchorPosition(null)
    }
  }, [isOpen])
  const controllableRef = useRef(controllable)
  const unblock = () => {
    setControllable(true)
    controllableRef.current = true
  }
  const block = () => {
    setControllable(false)
    controllableRef.current = false
  }

  const sendMessage = useCallback(async () => {
    if (textRef.current && controllableRef.current) {
      const question = textRef.current
      textRef.current = ""
      setMessages(oldmsgs => [...oldmsgs, { data: question, type: "user" }])
      setText("")
      block()
      await waitForResponse(question)
      unblock()
    }
  }, [setMessages, textRef, controllableRef, waitForResponse])

  const onTextChange = useCallback(
    e => {
      if (!e.target) return
      setText(e.target.value)
      textRef.current = e.target.value
    },
    [setText]
  )

  const handleIconClick = useCallback(async () => {
    setIsOpen(true)

    if (!controllableRef.current) return
    // loading
    const messageObj = {
      loading: true,
    }
    let lastMessage = null;
    setMessages(prev => {
      if (prev.length > 0) {
        lastMessage = prev[prev.length - 1];
      }
      return [...prev, messageObj]
    })
    block()
    const reply = await chatbot.sayHi()
    messageObj.data = reply
    messageObj.loading = false
    unblock()

    if (!reply) {
      setMessages(prev => {
        // if first message, greet
        if (prev.length == 1) {
          messageObj.data = "Hi!"
          return [...prev]
        }
        else {
          return [...prev.slice(0, -1)]
        }
      })
    }
    // If the last message is the same as the reply, do not add it again
    else if (lastMessage && lastMessage.type !== "user" && reply === lastMessage.data) {
      setMessages(prev => [...prev.slice(0, -1)])
    }
    else {
      setMessages(prev => [...prev])
    }
  }, [controllableRef])

  const handleClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  return (
    <div>
      <Zoom in={!trigger}>
        <IconButton
          ref={iconRef}
          sx={{
            position: iconStyle.position || "fixed",
            bottom: iconStyle.bottom || "50%",
            left: iconStyle.left || "55%",
            color: iconStyle.color || "common.white",
            "&:hover": {
              color: "#93f145",
            },
          }}
          onClick={handleIconClick}
        >
          <ChatIcon sx={{ fontSize: "3.5rem" }} />
        </IconButton>
      </Zoom>
      <Popover
        open={isOpen}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={anchorPosition}
        transformOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
        role="dialog"
      >
        <Box sx={{ width: { xs: '75svw', sm: '400px' } }}>
          <Box>
            <MessageList messages={messages} />
          </Box>
          <Box display="flex" flexDirection="column">
            <textarea
              placeholder="Type message.."
              required
              onChange={onTextChange}
              value={text}
              style={{
                margin: "2px",
                width: "100%",
                boxSizing: "border-box",
                resize: "vertical",
                fontSize: "16px",
                minHeight: "40px"
              }}
            />
            <Box display="flex" flexDirection="row" justifyContent="flex-end">
              <Button
                size="small"
                variant="contained"
                color="primary"
                style={{ margin: "1px" }}
                onClick={sendMessage}
                disabled={!controllable}
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

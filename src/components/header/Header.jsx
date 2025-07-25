'use client'

/* eslint-disable react/destructuring-assignment */

import PropTypes from "prop-types"
import React from "react"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"

import Fab from "@mui/material/Fab"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"

import { useRouter } from "@/lib/useRouter"
import Chat from "../chatbox/Chat"

// import LayoutContext from "../../contexts/LayoutContext"
import BackToTop from "./BackToTop"
import { clearHistoryState } from "../../contexts/useRestoreComponentState"
import useLayoutContext from "../../contexts/useLayoutContext"


const Header = ({ position, color, style, chatbox }) => {
  const context = useLayoutContext()
  const router = useRouter()

  return (
    <div>
      <AppBar
        position={position}
        id="navbar-top"
        sx={{
          backgroundColor: "transparent",
          color: color,
          userSelect: "none",
          ...style,
        }}
      >
        <Toolbar style={{ justifyContent: "space-around" }} variant="dense">
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => {
              clearHistoryState(["/"], context)
              router.push("/")
            }}
          >
            {/* <MenuIcon /> */}
            <Typography variant="h6" className="title">
              Xian
            </Typography>
          </IconButton>

          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => {
              clearHistoryState(["/about"], context)
              router.push("/about")
            }}
          >
            <Box display="flex" flexDirection="row">
              <Typography variant="h6" className="title">
                About
              </Typography>
            </Box>
          </IconButton>

          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => {
              clearHistoryState(["/blog"], context)
              router.push("/blog")
            }}
          >
            <Typography variant="h6" className="title">
              Blog
            </Typography>
          </IconButton>
        </Toolbar>

        <BackToTop anchorId="navbar-top">
          <Fab color="secondary" size="small" aria-label="scroll back to top">
            <KeyboardArrowUpIcon />
          </Fab>
        </BackToTop>
        {chatbox && <Chat />}
      </AppBar>
    </div>
  )
}

Header.propTypes = {
  position: PropTypes.string,
  color: PropTypes.string,
  style: PropTypes.shape({}),
  chatbox: PropTypes.bool,
}
Header.defaultProps = {
  position: "static",
  color: "black",
  style: {},
  chatbox: false,
}
export default Header

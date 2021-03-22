/* eslint-disable react/destructuring-assignment */

import PropTypes from "prop-types"
import React from "react"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import IconButton from "@material-ui/core/IconButton"
import Typography from "@material-ui/core/Typography"
import Box from "@material-ui/core/Box"

import Fab from "@material-ui/core/Fab"
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp"

import { navigate } from "gatsby"
import Chat from "../chatbox/Chat"

// import LayoutContext from "../../contexts/LayoutContext"
import BackToTop from "./BackToTop"
import { clearHistoryState } from "../../contexts/useRestoreComponentState"
import useLayoutContext from "../../contexts/useLayoutContext"
import _JSXStyle from "styled-jsx/style"

const Header = ({ position, color, style, chatbox }) => {
  const context = useLayoutContext()
  return (
    <div>
      <AppBar
        position={position}
        id="navbar-top"
        className="navbar"
        style={style}
      >
        <Toolbar style={{ justifyContent: "space-around" }} variant="dense">
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => {
              clearHistoryState(["/"], context)
              navigate("/")
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
              navigate("/about")
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
              navigate("/blog")
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
      <style jsx global>
        {`
          .navbar {
            background-color: transparent;
            color: ${color};
            user-select: none;
          }
        `}
      </style>
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

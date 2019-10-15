/* eslint-disable react/destructuring-assignment */

import PropTypes from "prop-types"
import React, { useContext, useEffect, useState } from "react"
import AppBar from "@material-ui/core/AppBar"
import Button from "@material-ui/core/Button"
import Toolbar from "@material-ui/core/Toolbar"
import IconButton from "@material-ui/core/IconButton"

import Typography from "@material-ui/core/Typography"
import Box from "@material-ui/core/Box"

import Fab from "@material-ui/core/Fab"
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp"
import Zoom from "@material-ui/core/Zoom"

import { navigate } from "gatsby"

import LayoutContext from "../../contexts/LayoutContext"
import { scrollIntoView, ScrollDetector } from "../../utilities/scroll"
import { clearHistoryState } from "../../contexts/useRestoreComponentState"
import useLayoutContext from "../../contexts/useLayoutContext"

function useScrollTrigger({ threshold, target }) {
  const [trigger, setTrigger] = useState(false)

  useEffect(() => {
    const scene = new ScrollDetector({
      scrollLayer: target,
      triggerHook: 0,
      offset: threshold,
    })

    scene.setEventListener(progress => {
      if (progress > 0) {
        setTrigger(true)
      } else {
        setTrigger(false)
      }
    })

    return () => {
      scene.destroy()
      setTrigger(false)
    }
  }, [threshold, target])
  return trigger
}
function BackToTop(props) {
  const { children, anchorId } = props
  // const classes = useStyles();
  const context = useContext(LayoutContext)
  const trigger = useScrollTrigger({
    threshold: 100,
    target: context.scrollLayer,
  })

  const handleClick = event => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      `#${anchorId}`
    )
    if (anchor) {
      scrollIntoView(anchor, context.scrollLayer, 888)
      // anchor.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <Zoom in={trigger}>
      <div onClick={handleClick} role="presentation" className="scroll-button">
        {children}
        <style jsx>
          {`
            .scroll-button {
              position: fixed;
              bottom: 2rem;
              right: 2rem;
            }
          `}
        </style>
      </div>
    </Zoom>
  )
}
BackToTop.propTypes = {
  children: PropTypes.element.isRequired,
  anchorId: PropTypes.string.isRequired,
}

const Header = ({ position, color, style }) => {
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

          <Button
            onClick={() => {
              navigate("/about")
            }}
            color="inherit"
          >
            <Box display="flex" flexDirection="row">
              <Typography variant="h6" className="title">
                About
              </Typography>
            </Box>
          </Button>

          <Button
            onClick={() => {
              clearHistoryState(["/blog"], context)
              navigate("/blog")
            }}
            color="inherit"
          >
            Blog
          </Button>
        </Toolbar>

        <BackToTop anchorId="navbar-top">
          <Fab color="secondary" size="small" aria-label="scroll back to top">
            <KeyboardArrowUpIcon />
          </Fab>
        </BackToTop>
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
}
Header.defaultProps = {
  position: "static",
  color: "black",
}
export default Header

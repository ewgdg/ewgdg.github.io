'use client'

import React from "react"
import PropTypes from "prop-types"
import Zoom from "@mui/material/Zoom"
import { makeStyles } from "@mui/styles"
import { scrollIntoView } from "../../lib/dom/scroll"
import useLayoutContext from "../../lib/contexts/use-layout-context"
import useScrollTrigger from "../page-scroll/use-scroll-trigger"

const useStyles = makeStyles({
  scrollButton: {
    position: "fixed",
    bottom: "2rem",
    right: "2rem",
  },
})

function BackToTop(props) {
  const { children, anchorId } = props
  const classes = useStyles()
  const { scrollLayer } = useLayoutContext()
  // trigger on whole page scroll instead of on a single elem
  const trigger = useScrollTrigger({
    threshold: 100,
    scrollLayer,
  })

  const handleClick = event => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      `#${anchorId}`
    )
    if (anchor) {
      scrollIntoView(anchor, scrollLayer, 888)
      // anchor.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <Zoom in={trigger}>
      <div onClick={handleClick} role="presentation" className={classes.scrollButton}>
        {children}
      </div>
    </Zoom>
  )
}
BackToTop.propTypes = {
  children: PropTypes.element.isRequired,
  anchorId: PropTypes.string.isRequired,
}

export default BackToTop

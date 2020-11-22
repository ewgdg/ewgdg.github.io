import React from "react"
import PropTypes from "prop-types"
import Zoom from "@material-ui/core/Zoom"
import { scrollIntoView } from "../../utils/scroll"
import useLayoutContext from "../../contexts/useLayoutContext"
import useScrollTrigger from "../pageScroll/useScrollTrigger"

function BackToTop(props) {
  const { children, anchorId } = props
  // const classes = useStyles();
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

export default BackToTop

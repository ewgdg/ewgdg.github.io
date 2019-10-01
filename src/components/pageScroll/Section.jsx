import React, { useCallback } from "react"
import PropTypes from "prop-types"
import VisibilitySensor from "react-visibility-sensor"
import { makeStyles } from "@material-ui/styles"

const useStyles = makeStyles({
  root: {
    height: "100vh",
    width: "100%",
    // border: "red solid 2px",
    // pointerEvents: "none",
  },
})

function Section({
  children,
  forwardedRef,
  addActiveSection,
  removeActiveSection,
}) {
  const classes = useStyles()
  const callback = useCallback(
    isVisible => {
      if (isVisible) {
        addActiveSection(forwardedRef)
      } else {
        removeActiveSection(forwardedRef)
      }
    },
    [forwardedRef, addActiveSection, removeActiveSection]
  )

  return (
    <VisibilitySensor
      onChange={callback}
      partialVisibility
      offset={{ top: 5, bottom: 5, left: 1, right: 1 }}
      intervalDelay={100}
    >
      <section
        ref={forwardedRef}
        className={`${classes.root} section`}
        style={{ boxSizing: "border-box", userSelect: "none" }}
      >
        {children}
      </section>
    </VisibilitySensor>
  )
}

Section.propTypes = {
  children: PropTypes.node,
  forwardedRef: PropTypes.shape({
    current: PropTypes.any,
  }),
  addActiveSection: PropTypes.func,
  removeActiveSection: PropTypes.func,
}
Section.defaultProps = {
  children: undefined,
  forwardedRef: undefined,
  addActiveSection: undefined,
  removeActiveSection: undefined,
}

export default Section

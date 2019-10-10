/* eslint-disable react/prop-types */
import React from "react"
import PropTypes from "prop-types"
import { makeStyles } from "@material-ui/styles"

const useStyles = makeStyles({
  root: {
    height: "100vh",
    width: "100%",
    // border: "red solid 2px",
    // pointerEvents: "none",
  },
})

function Section({ children, forwardedRef, style }) {
  const classes = useStyles()

  return (
    <section
      ref={forwardedRef}
      className={`${classes.root} section`}
      style={{ boxSizing: "border-box", userSelect: "none", ...style }}
    >
      {children}
    </section>
  )
}

Section.propTypes = {
  children: PropTypes.node,
  forwardedRef: PropTypes.shape({
    current: PropTypes.any,
  }),
}
Section.defaultProps = {
  children: undefined,
  forwardedRef: undefined,
}

export default Section

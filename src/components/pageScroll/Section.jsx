/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React from "react"
import PropTypes from "prop-types"
import { makeStyles } from "@material-ui/styles"

const useStyles = makeStyles(height => ({
  root: {
    height,
    width: "100%",
    userSelect: "none",
    WebkitUserSelect: "none",
    // position: "relative",
    // border: "red solid 2px",
    // pointerEvents: "none",
  },
}))

// Section component whose parent should be type of Container
const Section = React.forwardRef(({ children, style, className, id, height = "100vh" }, ref) => {
  const classes = useStyles(height)

  return (
    <section
      ref={ref}
      className={`${classes.root} section ${className || ""}`}
      style={{ boxSizing: "border-box", userSelect: "none", WebkitUserSelect: "none", ...style }}
      {...(id ? { id } : {})}
    >
      {children}
    </section>
  )
})

Section.propTypes = {
  children: PropTypes.node,
  ref: PropTypes.func,
}
Section.defaultProps = {
  children: undefined,
  ref: undefined,
}

export default Section

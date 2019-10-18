/* eslint-disable react/jsx-props-no-spreading */
import React from "react"
import PropTypes from "prop-types"
import Jumbotron from "./Jumbotron"
import Header from "./Header"

function HeaderContainer({ jumbotronProps, headerProps }) {
  return (
    <div
      style={{
        position: "relative",
        minHeight: "3.5rem",
        marginBottom: "0rem",
      }}
    >
      <Header {...headerProps} />
      {jumbotronProps.image && (
        <Jumbotron {...jumbotronProps} imageAttachedAsBackground={false} />
      )}
    </div>
  )
}
HeaderContainer.propTypes = {
  jumbotronProps: PropTypes.shape({ image: PropTypes.any }),
  headerProps: PropTypes.shape({
    color: PropTypes.string,
    display: PropTypes.string,
  }),
}

HeaderContainer.defaultProps = {
  headerProps: {
    position: "absolute",
    color: "white",
  },
  jumbotronProps: { image: null },
}

export default HeaderContainer

/* eslint-disable react/jsx-props-no-spreading */
import React from "react"
import PropTypes from "prop-types"
import Jumbotron from "./Jumbotron"
import Header from "./Header"

function HeaderContainer({ imageFluid, headerProps }) {
  return (
    <div
      style={{
        position: "relative",
        minHeight: "3.5rem",
        marginBottom: "0rem",
      }}
    >
      <Header {...headerProps} />
      {imageFluid && <Jumbotron image={imageFluid} />}
    </div>
  )
}
HeaderContainer.propTypes = {
  imageFluid: PropTypes.shape({}),
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
  imageFluid: null,
}

export default HeaderContainer

/* eslint-disable react/prop-types */
import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"

const Jumbotron = ({
  image,
  headline,
  bottomline,
  children,
  darkFilter,
  imageAttachAsBackground,
}) => {
  let imgFluid = image

  if (!imgFluid) {
    const query = graphql`
      query {
        fileName: file(relativePath: { eq: "gatsby-astronaut.png" }) {
          childImageSharp {
            fluid(maxWidth: 1000) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    `
    imgFluid = useStaticQuery(query).fileName.childImageSharp.fluid
  }

  let figureStyle = {}
  if (imageAttachAsBackground) {
    figureStyle = {
      backgroundAttachment: "fixed",
      backgroundImage: `url(${imgFluid.src})`,
      backgroundSize: "cover",
      backgroundPosition: "center center",
    }
  }
  return (
    <figure style={figureStyle}>
      {!imageAttachAsBackground && (
        <Img
          fluid={imgFluid}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            margin: 0,
          }}
        />
      )}

      <div className="headlineContainer">
        <div style={{ margin: 0, padding: 0 }}>
          <h1 className="headline">
            Keyboard is
            {headline}
          </h1>
          <p style={{ margin: 0 }}>键盘侠</p>
          {children}
          <h1 className="headline">
            My weapon
            {bottomline}
          </h1>
        </div>
      </div>

      <style jsx>
        {`
          figure {
            overflow: hidden;
            width: 100%;
            height: 100vh;
            pointer-events: none;
            user-select: none;
            position: relative;
            margin: 0;
          }
          figure:after {
            content: "";
            background-color: black;
            position: absolute;
            width: 100%;
            height: 100%;
            opacity: ${darkFilter};
            top: 0;
            left: 0;
            margin: 0;
          }
          .headlineContainer {
            position: absolute;
            color: white;
            top: 0;
            left: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            width: 45%;
            z-index: 1;
            padding-top: 6.5%;
          }
          .headline {
            font-family: roboto, monotone;
            font-size: 7vw;
            font-weight: 600;
            line-height: 1em;
            margin: 0;
          }
        `}
      </style>
    </figure>
  )
}

Jumbotron.propTypes = {
  image: PropTypes.shape({ base64: PropTypes.string }),
  headline: PropTypes.string,
  darkFilter: PropTypes.number,
  imageAttachAsBackground: PropTypes.bool,
}
Jumbotron.defaultProps = {
  image: null,
  headline: "",
  darkFilter: 0.3,
  imageAttachAsBackground: true,
}

export default Jumbotron

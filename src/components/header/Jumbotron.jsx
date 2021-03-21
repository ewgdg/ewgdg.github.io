/* eslint-disable react/prop-types */
import React from "react"
import PropTypes from "prop-types"
import BackgroundImage from "gatsby-background-image"
import _JSXStyle from "styled-jsx/style";
const Jumbotron = ({
  image,
  headline,
  subtitle,
  darkFilter,
  imageAttachedAsBackground,
}) => {
  const imgFluid = image

  let figureStyle = {}
  if (imageAttachedAsBackground) {
    figureStyle = {
      backgroundAttachment: "fixed",
      backgroundImage: `url(${
        imgFluid.childImageSharp ? imgFluid.childImageSharp.fluid.src : imgFluid
      })`,
      backgroundSize: "cover",
      backgroundPosition: "center center",
    }
  }

  const lines = headline.split("\n")
  const [firstLine, ...restLines] = lines
  return (
    <figure style={figureStyle}>
      {!imageAttachedAsBackground && (
        // <ParallaxSection maxProgressValue={100}>
        //   <Img
        //     fluid={imgFluid.childImageSharp.fluid}
        //     style={{
        //       width: "100%",
        //       height: "100vh",
        //       objectFit: "cover",
        //       margin: 0,
        //     }}
        //   />
        // </ParallaxSection>
        <BackgroundImage
          fluid={imgFluid.childImageSharp.fluid}
          style={{
            width: "100%",
            height: "100vh",
            backgroundAttachment: "fixed",
            margin: 0,
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        />
      )}

      <div className="headlineContainer">
        <div style={{ margin: 0, padding: 0 }}>
          <h1 className="headline">{firstLine}</h1>
          <p style={{ margin: 0 }}>{subtitle}</p>
          {restLines.map(line => (
            <h1 className="headline" key={line}>
              {line}
            </h1>
          ))}
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
  image: PropTypes.oneOfType([
    PropTypes.shape({ src: PropTypes.string }),
    PropTypes.string,
  ]),
  headline: PropTypes.string,
  darkFilter: PropTypes.number,
  imageAttachedAsBackground: PropTypes.bool,
}
Jumbotron.defaultProps = {
  image: null,
  headline: "",
  darkFilter: 0.3,
  imageAttachedAsBackground: false,
}

export default Jumbotron

'use client'

import React from "react"
import { makeStyles } from "@mui/styles"
import ParallaxSection from "../sections/parallax-section"
import { getJumbotronResponsiveImage } from "../../lib/images/jumbotron-images"
import { calcViewportHeight, calcViewportWidth } from "../../lib/dom/viewport"

const useStyles = makeStyles({
  figure: {
    overflow: "hidden",
    width: "100%",
    height: calcViewportHeight(100),
    pointerEvents: "none",
    userSelect: "none",
    position: "relative",
    margin: 0,
  },
  figureOverlay: {
    content: '""',
    backgroundColor: "black",
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    margin: 0,
    zIndex: 1,
  },
  backgroundDiv: {
    width: "100%",
    height: calcViewportHeight(100),
    // this is commented out due to limited browser support on mobile devices, use ParallaxSection instead
    // backgroundAttachment: "fixed",
    margin: 0,
    position: "relative",
    backgroundSize: "cover",
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",
  },
  backgroundPicture: {
    display: "block",
    width: "100%",
    height: "100%",
  },
  backgroundImage: {
    display: "block",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center center",
  },
  headlineContainer: {
    position: "absolute",
    color: "white",
    top: 0,
    left: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "45%",
    zIndex: 2,
    paddingTop: "6.5%",
  },
  headline: {
    fontFamily: "roboto, monotone",
    fontSize: calcViewportWidth(7),
    fontWeight: 600,
    lineHeight: "1em",
    margin: 0,
  },
})

interface JumbotronProps {
  image?: string
  headline?: string
  subtitle?: string
  darkFilter?: number
}

const Jumbotron: React.FC<JumbotronProps> = ({ image, headline = "", subtitle = "", darkFilter = 0.3 }) => {
  const classes = useStyles()
  const backgroundImage = image || ''
  const responsiveImage = getJumbotronResponsiveImage(backgroundImage)

  const lines = headline.split("\n")
  const [firstLine, ...restLines] = lines

  return (
    <figure className={classes.figure}>
      <div
        className={classes.figureOverlay}
        style={{ opacity: darkFilter }}
      />
      <ParallaxSection maxTranslateY={100}>
        <div
          className={classes.backgroundDiv}
          style={responsiveImage?.placeholderDataUrl
            ? { backgroundImage: `url(${responsiveImage.placeholderDataUrl})` }
            : undefined}
        >
          <picture className={classes.backgroundPicture}>
            {responsiveImage && (
              <>
                <source srcSet={responsiveImage.webpSrcSet} sizes={responsiveImage.sizes} type="image/webp" />
              </>
            )}
            <img
              className={classes.backgroundImage}
              src={responsiveImage?.fallbackSrc || backgroundImage}
              alt={responsiveImage?.alt || ""}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              draggable={false}
            />
          </picture>
        </div>
      </ParallaxSection>

      <div className={classes.headlineContainer}>
        <div style={{ margin: 0, padding: 0 }}>
          <h1 className={classes.headline}>{firstLine}</h1>
          <p style={{ margin: 0 }}>{subtitle}</p>
          {restLines.map(line => (
            <h1 className={classes.headline} key={line}>
              {line}
            </h1>
          ))}
        </div>
      </div>
    </figure>
  )
}


export default Jumbotron

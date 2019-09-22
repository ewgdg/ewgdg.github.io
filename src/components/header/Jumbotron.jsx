import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"

const Jumbotron = ({ image }) => {
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

  return (
    <figure>
      <Img
        fluid={imgFluid}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <style jsx>
        {`
          figure {
            overflow: hidden;
            width: 100vw;
            height: 100vh;
          }
          figure:before {
            content: "";
            background-color: red;
          }
        `}
      </style>
    </figure>
  )
}

Jumbotron.propTypes = {
  image: PropTypes.shape({ base64: PropTypes.string }),
}
Jumbotron.defaultProps = {
  image: null,
}

export default Jumbotron

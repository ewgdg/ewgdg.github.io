import React from "react"
import { Link, graphql } from "gatsby"

import PropTypes from "prop-types"
// import Layout from "../components/Layout"
import SEO from "../components/Seo"

const SecondPage = ({ data }) => (
  <>
    <SEO title="Page two" />
    <h1>Hi from the second page</h1>
    <p>Welcome to page 2</p>
    <Link to="/">Go back to the homepage</Link>
  </>
)

SecondPage.propTypes = {
  data: PropTypes.shape({
    fileName: PropTypes.any,
  }).isRequired,
}

export const query = graphql`
  query {
    fileName: file(relativePath: { eq: "summer-bg-45-crop.jpg" }) {
      childImageSharp {
        fluid(maxWidth: 1980) {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
`

export default SecondPage

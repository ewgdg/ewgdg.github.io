/* eslint-disable react/require-default-props */
import React from "react"
import PropTypes from "prop-types"
import { BlogPageTemplate } from "../../templates/BlogPage"

const ProductPagePreview = ({ entry }) => {
  const jumbotronProps = entry.getIn(["data", "jumbotron"])

  return <BlogPageTemplate jumbotronProps={jumbotronProps} isPreview />
}

ProductPagePreview.propTypes = {
  entry: PropTypes.shape({
    getIn: PropTypes.func,
  }),
}

export default ProductPagePreview

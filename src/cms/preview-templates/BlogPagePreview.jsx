/* eslint-disable react/require-default-props */
import React from "react"
import PropTypes from "prop-types"
import { BlogPagePreview as Preview } from "../../templates/BlogPageTemplate"

const BlogPagePreview = ({ entry }) => {
  const jumbotronProps = entry.getIn(["data", "jumbotron"])
  return <Preview jumbotronProps={jumbotronProps} />
}

BlogPagePreview.propTypes = {
  entry: PropTypes.shape({
    getIn: PropTypes.func,
  }),
}

export default BlogPagePreview

/* eslint-disable react/require-default-props */
import React, { useEffect } from "react"
import PropTypes from "prop-types"
import BlogPostTemplate from "../../templates/BlogPostTemplate"

const BlogPostPreview = ({ entry, widgetFor }) => { 
  return (
    <BlogPostTemplate
      content={widgetFor("body")}
      description={entry.getIn(["data", "description"])}
      tags={entry.getIn(["data", "tags"])}
      title={entry.getIn(["data", "title"])}
    />
  )
}

BlogPostPreview.propTypes = {
  entry: PropTypes.shape({
    getIn: PropTypes.func,
  }),
  widgetFor: PropTypes.func,
}

export default BlogPostPreview

/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/no-danger */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
import React from "react"
import PropTypes from "prop-types"
// import { kebabCase } from "lodash"
import Helmet from "react-helmet"
import { graphql } from "gatsby"

import "github-markdown-css"

import Prism from "prismjs"

import Footer from "../components/footer/Footer"
import HeaderContainer from "../components/header/HeaderContainer"

import useRestoreScrollTop from "../contexts/useRestoreScrollTop"
import { BlogPostTemplate, useStyles } from "./BlogPostTemplate"

Prism.manual = true

const BlogPost = ({ data, uri }) => {
  const { markdownRemark: post } = data
  useRestoreScrollTop([uri])
  const classes = useStyles()
  return (
    <div className={classes.pageContainer}>
      <HeaderContainer
        headerProps={{
          color: "black",
          position: "static",
          style: { boxShadow: "none" },
        }}
      />
      <BlogPostTemplate
        content={post.html}
        description={post.frontmatter.description}
        publicationDate={post.frontmatter.date}
        helmet={
          <Helmet titleTemplate="%s | Blog">
            <title>{`${post.frontmatter.title}`}</title>
            <meta
              name="description"
              content={`${post.frontmatter.description}`}
            />
          </Helmet>
        }
        tags={post.frontmatter.tags}
        title={post.frontmatter.title}
        includeBackButton={!post.frontmatter.isPortfolio}
        featuredImage={post.frontmatter.featuredImage}
      />
      <Footer className="footer" />
    </div>
  )
}

BlogPost.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.object,
  }),
}

export default BlogPost

export const pageQuery = graphql`
  query BlogPostByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      frontmatter {
        isPortfolio
        date(formatString: "MMMM DD, YYYY")
        title
        description
        tags
        featuredImage {
          childImageSharp {
            fluid(maxWidth: 2048, quality: 50) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
`

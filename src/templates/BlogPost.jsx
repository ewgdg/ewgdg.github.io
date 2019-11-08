/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/no-danger */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
import React, { useMemo, useLayoutEffect } from "react"
import PropTypes from "prop-types"
// import { kebabCase } from "lodash"
import Helmet from "react-helmet"
import { Link } from "@reach/router"
import { graphql } from "gatsby"
import Paper from "@material-ui/core/Paper"
import Container from "@material-ui/core/Container"

import "github-markdown-css"

import Prism from "prismjs"

import { makeStyles } from "@material-ui/core/styles"
import Img from "gatsby-image"

import Footer from "../components/footer/Footer"
import HeaderContainer from "../components/header/HeaderContainer"

import useRestoreScrollTop from "../contexts/useRestoreScrollTop"

Prism.manual = true
const useStyles = makeStyles({
  taglist: {
    listStyle: "none",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "left",
    alignItems: "center",
    margin: 0,
  },
  tag: {
    padding: "0 2rem 1rem 0",
  },
  pageContainer: {
    position: "relative",
    minHeight: "100vh",
    "&::after": {
      content: "''",
      // reserve a space for footer
      height: "350px",
      display: "block",
    },
    "& footer": {
      position: "absolute",
      bottom: 0,
    },
  },
})
function BackToList() {
  return (
    <div style={{ textAlign: "right" }}>
      <Link
        style={{
          display: "inline-block",
          marginRight: "5px",
        }}
        to="/blog"
      >
        Back To List
      </Link>
    </div>
  )
}
export const BlogPostTemplate = ({
  content,
  description,
  tags,
  title,
  publicationDate,
  helmet,
  featuredImage = null,
  includeBackButton = true,
}) => {
  const ContentElem = typeof content === "object" ? content : null
  const classes = useStyles()

  const imageComponent = useMemo(() => {
    let result = null
    if (featuredImage) {
      const imageStyle = {
        width: "100%",
        maxHeight: "350px",
        objectFit: "cover",
      }
      if (featuredImage.childImageSharp) {
        result = (
          <Img fluid={featuredImage.childImageSharp.fluid} style={imageStyle} />
        )
      } else {
        result = <img src={featuredImage} alt="featured" style={imageStyle} />
      }
    }
    return result
  }, [featuredImage])

  useLayoutEffect(() => {
    // highlight code block syntax
    Prism.highlightAll()
  }, [content])

  return (
    <section className="section">
      {helmet || ""}
      <Container>
        {includeBackButton && <BackToList />}
        <Paper>
          <div style={{ margin: "0 auto", padding: "45px" }}>
            <div style={{ textAlign: "center" }}>
              <h1 className="title">{title}</h1>
              {description && <p>{description}</p>}
              {publicationDate && (
                <span>
                  <small>Publication date: {publicationDate} </small>
                </span>
              )}
            </div>
            {imageComponent && (
              <>
                {imageComponent}
                <br />
              </>
            )}
            <hr />

            {(ContentElem && (
              <article className="markdown-body line-numbers">
                {ContentElem}
              </article>
            )) ||
              (content && (
                <article
                  className="markdown-body line-numbers"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              ))}
          </div>
        </Paper>
        {includeBackButton && <BackToList />}
        {tags && includeBackButton && tags.length ? (
          <div style={{ marginTop: `4rem` }}>
            <h4>Tags</h4>
            <ul className={classes.taglist}>
              {tags.map(tag => (
                <li key={`${tag}tag`} className={classes.tag}>
                  <Link to={`/blog?tags=${tag}#search`}>{tag}</Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Container>
    </section>
  )
}

BlogPostTemplate.propTypes = {
  content: PropTypes.node,
  description: PropTypes.string,
  title: PropTypes.string,
  helmet: PropTypes.object,
  featuredImage: PropTypes.any,
}

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

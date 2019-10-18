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
import { Link } from "@reach/router"
import { graphql } from "gatsby"
import Paper from "@material-ui/core/Paper"
import Container from "@material-ui/core/Container"

import "github-markdown-css"

import { makeStyles } from "@material-ui/core/styles"
import Footer from "../components/footer/Footer"
import HeaderContainer from "../components/header/HeaderContainer"

import useResetScrollTop from "../contexts/useResetScrollTop"

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
  helmet,
  includeBackButton = true,
}) => {
  const ContentElem = typeof content === "object" ? content : null
  const classes = useStyles()
  return (
    <section className="section">
      {helmet || ""}
      <Container>
        {includeBackButton && <BackToList />}
        <Paper>
          <div style={{ margin: "0 auto", padding: "45px" }}>
            <h1 className="title is-size-2 has-text-weight-bold is-bold-light">
              {title}
            </h1>
            {description && <p>{description}</p>}
            <hr />
            {(ContentElem && (
              <article className="markdown-body">{ContentElem}</article>
            )) ||
              (content && (
                <article
                  className="markdown-body"
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
                  <Link to={`/tags/${tag}/`}>{tag}</Link>
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
}

const BlogPost = ({ data }) => {
  const { markdownRemark: post } = data
  useResetScrollTop()
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
      }
    }
  }
`

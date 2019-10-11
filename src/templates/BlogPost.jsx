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
import Layout from "../components/layouts/PersistedLayout"

import "github-markdown-css"

import Footer from "../components/footer/Footer"
import HeaderContainer from "../components/header/HeaderContainer"
import { useLayoutEffect } from "react"
import useRecordScrollTop from "../contexts/useRestoreScrollTop"
import useResetScrollTop from "../contexts/useResetScrollTop"

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
}) => {
  return (
    <section className="section">
      {helmet || ""}
      {/* <div className="container content">
        <div className="columns">
          <div className="column is-10 is-offset-1"> */}
      <Container>
        <BackToList />
        <Paper>
          <div style={{ margin: "0 auto", padding: "45px" }}>
            <h1 className="title is-size-2 has-text-weight-bold is-bold-light">
              {title}
            </h1>
            <p>{description}</p>
            <hr />
            <article
              className="markdown-body"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </Paper>
        <BackToList />
      </Container>
      {tags && tags.length ? (
        <div style={{ marginTop: `4rem` }}>
          <h4>Tags</h4>
          <ul className="taglist">
            {tags.map(tag => (
              <li key={`${tag}tag`}>
                <Link to={`/tags/${tag}/`}>{tag}</Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {/* </div>
        </div>
      </div> */}
    </section>
  )
}

BlogPostTemplate.propTypes = {
  content: PropTypes.node.isRequired,
  contentComponent: PropTypes.func,
  description: PropTypes.string,
  title: PropTypes.string,
  helmet: PropTypes.object,
}

const BlogPost = ({ data }) => {
  const { markdownRemark: post } = data
  useResetScrollTop()
  return (
    <>
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
      />
      <Footer />
    </>
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
        date(formatString: "MMMM DD, YYYY")
        title
        description
        tags
      }
    }
  }
`

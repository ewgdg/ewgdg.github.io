/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/prop-types */
import React, { useMemo, useLayoutEffect, useRef } from "react"
import { Link } from "@reach/router"
import Paper from "@material-ui/core/Paper"
import Container from "@material-ui/core/Container"
import Prism from "prismjs"
import Img from "gatsby-image"
import { makeStyles } from "@material-ui/core/styles"

export const useStyles = makeStyles({
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

export function BackToList() {
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

export function BlogPostTemplate({
  content,
  description,
  tags,
  title,
  publicationDate,
  helmet,
  featuredImage = null,
  includeBackButton = true,
}) {
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

  const articleRef = useRef(null)
  useLayoutEffect(() => {
    // highlight code block syntax
    if (articleRef.current) {
      Prism.highlightAllUnder(articleRef.current)
    }
  }, [content, articleRef])

  return (
    <section className="section">
      {helmet || ""}
      <Container>
        {includeBackButton && <BackToList />}
        <Paper style={{ zIndex: 4, position: "relative" }}>
          <div
            style={{
              margin: "0 10%",
              padding: "45px",
              paddingBottom: "150px",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <h1 className="title">{title}</h1>
              {description && <p>{description}</p>}
              {publicationDate && (
                <span>
                  <small>Publication date:{publicationDate}</small>
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
              <article className="markdown-body line-numbers" ref={articleRef}>
                {ContentElem}
              </article>
            )) ||
              (content && (
                <article
                  className="markdown-body line-numbers"
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{ __html: content }}
                  ref={articleRef}
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

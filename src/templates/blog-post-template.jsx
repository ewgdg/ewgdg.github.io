/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/prop-types */
'use client'
import React, { useMemo } from "react"
import Link from "../components/navigation/link"
import Paper from "@mui/material/Paper"
import Container from "@mui/material/Container"
import Image from "next/image"
import { makeStyles } from "@mui/styles"

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
        href="/blog"
        style={{
          display: "inline-block",
          marginRight: "5px",
        }}
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
  lastModified,
  helmet,
  featuredImage = null,
  includeBackButton = true,
}) {
  const ContentElem = typeof content === "object" ? content : null
  const classes = useStyles()

  const shouldShowLastModified = useMemo(() => {
    if (!lastModified || !publicationDate) return false
    return new Date(lastModified).getTime() !== new Date(publicationDate).getTime()
  }, [lastModified, publicationDate])

  const imageComponent = useMemo(() => {
    let result = null
    if (featuredImage) {
      const imageStyle = {
        width: "100%",
        height: "auto",
        maxHeight: "350px",
        objectFit: "cover",
      }
      const imageSrc = typeof featuredImage === 'string' ? featuredImage : featuredImage.src || featuredImage.childImageSharp?.fluid?.src || ''
      if (imageSrc) {
        result = (
          <Image
            src={imageSrc}
            alt="featured"
            width={0}
            height={0}
            style={imageStyle}
            priority
          />
        )
      }
    }
    return result
  }, [featuredImage])


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
                  <small>Publication date: {new Date(publicationDate).toLocaleString()}</small>
                </span>
              )}
              {shouldShowLastModified && (
                <span>
                  <br />
                  <small>Last modified: {new Date(lastModified).toLocaleString()}</small>
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
                  // eslint-disable-next-line react/no-danger
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
                  <Link href={`/blog?tags=${tag}#search`}>{tag}</Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Container>
    </section>
  )
}

export default BlogPostTemplate

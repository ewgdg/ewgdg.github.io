import { useMemo } from "react"
import { navigate } from "gatsby"
import { clearHistoryState } from "../../contexts/useRestoreComponentState"
import useLayoutContext from "../../contexts/useLayoutContext"

export default function(rawData) {
  if (!(rawData && rawData.edges)) {
    return []
  }
  const context = useLayoutContext()
  return useMemo(() => {
    const res = []
    rawData.edges.forEach(postData => {
      const { post } = postData
      const { title } = post.frontmatter
      const image = post.frontmatter.featuredImage
        ? post.frontmatter.featuredImage.childImageSharp.fluid.src
        : null
      const description = post.frontmatter.description || post.excerpt
      const { tags } = post.frontmatter
      const publicationDate = post.frontmatter.date
      const onClick = (() => {
        if (post.frontmatter.externalLink) {
          return () => {
            if (window.open)
              window.open(post.frontmatter.externalLink, "_blank")
            else window.location.href = post.frontmatter.externalLink
          }
        }
        return () => {
          // trim the last slash
          let { slug } = post.fields
          if (post.fields.slug.charAt(slug) === "/") {
            slug = slug.slice(0, -1)
          }
          clearHistoryState([slug], context)
          navigate(slug)
        }
      })()
      res.push({
        title,
        image,
        description,
        onClick,
        tags,
        publicationDate,
      })
    })
    return res
  }, [rawData.edges])
}

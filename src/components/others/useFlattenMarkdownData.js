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
      const onClick = (() => {
        if (post.frontmatter.externalLink) {
          return () => {
            if (window.open)
              window.open(post.frontmatter.externalLink, "_blank")
            else window.location.href = post.frontmatter.externalLink
          }
        }
        return () => {
          clearHistoryState([post.fields.slug], context)
          navigate(post.fields.slug)
        }
      })()
      res.push({
        title,
        image,
        description,
        onClick,
        tags,
      })
    })
    return res
  }, [rawData.edges])
}

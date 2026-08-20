import { useMemo } from "react"

export default function useBlogPostCards(posts) {
  return useMemo(() => {
    if (!Array.isArray(posts)) {
      return []
    }
    const res = []
    posts.forEach(post => {
      const { title } = post.frontmatter
      // Handle both string paths and object format
      const image = post.frontmatter.featuredImage
        ? (typeof post.frontmatter.featuredImage === 'string'
          ? post.frontmatter.featuredImage
          : post.frontmatter.featuredImage.src)
        : null
      const description = post.frontmatter.description || post.excerpt || (post.content?.substring(0, 200) ?? '') + '...'
      const { tags } = post.frontmatter
      const publicationDate = post.frontmatter.date
      const externalLink = post.frontmatter.externalLink
      res.push({
        title,
        image,
        description,
        href: externalLink || post.uri,
        scroll: externalLink ? undefined : false,
        target: externalLink ? "_blank" : undefined,
        rel: externalLink ? "noopener noreferrer" : undefined,
        tags,
        publicationDate,
      })
    })
    return res
  }, [posts])
}

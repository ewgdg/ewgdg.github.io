import { useMemo } from "react"
import { useRouter } from "@/lib/navigation/router"
import { clearHistoryState } from "../../lib/contexts/use-restore-component-state"
import useLayoutContext from "../../lib/contexts/use-layout-context"

export default function useBlogPostCards(posts) {
  const context = useLayoutContext()
  const router = useRouter()

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
      const onClick = (() => {
        if (post.frontmatter.externalLink) {
          return () => {
            if (window.open)
              window.open(post.frontmatter.externalLink, "_blank")
            else window.location.href = post.frontmatter.externalLink
          }
        }
        return () => {
          clearHistoryState([post.uri], context)
          router.push(post.uri)
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
  }, [posts, router, context])
}

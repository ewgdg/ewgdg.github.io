import { getAllBlogPosts, getMarkdownData } from '@/lib/content/content'
import BlogRouteShell from './blog-route-shell'

async function getBlogJumbotronProps() {
  const blogData = await getMarkdownData('blog.md', { includeContent: false })

  return (blogData?.frontmatter as any)?.jumbotron || {
    headline: 'Blog',
    subtitle: 'Thoughts and ideas',
    image: '/img/blog-jumbotron.webp',
  }
}

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [posts, jumbotronProps] = await Promise.all([
    getAllBlogPosts(),
    getBlogJumbotronProps(),
  ])

  return (
    <BlogRouteShell posts={posts} jumbotronProps={jumbotronProps}>
      {children}
    </BlogRouteShell>
  )
}

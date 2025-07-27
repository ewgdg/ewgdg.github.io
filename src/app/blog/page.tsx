import { getAllBlogPosts, getMarkdownData } from '@/lib/content/content'
import BlogPage from '@/templates/blog-page'

async function getBlogPageData() {
  const blogData = await getMarkdownData('blog.md')
  const blogPosts = await getAllBlogPosts()

  // Simplified data structure without GraphQL nesting
  const data = {
    frontmatter: {
      jumbotronProps: (blogData?.frontmatter as any)?.jumbotron || {
        headline: "Blog",
        subtitle: "Thoughts and ideas",
        image: "/img/blog-jumbotron.jpg"
      }
    },
    posts: blogPosts
  }

  return data
}

export default async function BlogPageWrapper() {
  const data = await getBlogPageData()

  return (
    <BlogPage
      data={data}
      uri="/blog"
    />
  )
}

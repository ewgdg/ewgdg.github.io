import { getAllBlogPosts, getMarkdownData } from '@/lib/localstorage'
import BlogPage from '@/templates/BlogPage'

async function getBlogPageData() {
  const blogData = await getMarkdownData('blog.md')
  const blogPosts = await getAllBlogPosts()

  // Simplified data structure without GraphQL nesting
  const data = {
    frontmatter: {
      jumbotronProps: blogData?.frontmatter?.jumbotron || {
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
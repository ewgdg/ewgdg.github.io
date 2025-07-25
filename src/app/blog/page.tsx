import { getAllBlogPosts, getMarkdownData } from '@/lib/localstorage'
import BlogPage from '@/templates/BlogPage'

function getBlogPageData() {
  const blogData = getMarkdownData('blog.md')
  const blogPosts = getAllBlogPosts()

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

export default function BlogPageWrapper() {
  const data = getBlogPageData()

  return (
    <BlogPage
      data={data}
      uri="/blog"
    />
  )
}
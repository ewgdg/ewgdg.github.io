import { getMarkdownData, getAllBlogPosts, getAllPortfolioItems } from '@/lib/localstorage'
import IndexPage from '@/templates/IndexPage'

function getHomePageData() {
  const indexData = getMarkdownData('index.md')
  const allBlogPosts = getAllBlogPosts()
  const allPortfolioItems = getAllPortfolioItems()

  // Get featured blog posts
  const featuredBlogPosts = allBlogPosts
    .filter(post => post.frontmatter.featuredPost === true && !post.frontmatter.isPortfolio)
    .slice(0, 2)

  // Get featured portfolio items
  const featuredPortfolioItems = allPortfolioItems
    .filter(item => item.frontmatter.featuredPost === true)
    .slice(0, 2)

  return {
    jumbotronProps: indexData?.frontmatter?.jumbotron || {
      headline: "Xian",
      subtitle: "显",
      image: "/img/home-jumbotron.jpg"
    },
    blogPosts: featuredBlogPosts,
    portfolioItems: featuredPortfolioItems
  }
}

export default function HomePage() {
  const data = getHomePageData()
  const { jumbotronProps, blogPosts, portfolioItems } = data

  return (
    <IndexPage
      jumbotronProps={jumbotronProps}
      blogPosts={blogPosts}
      portfolioItems={portfolioItems}
      uri="/"
    />
  )
}
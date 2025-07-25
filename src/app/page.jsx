import { getMarkdownData, getAllBlogPosts, getAllPortfolioItems } from '@/lib/localstorage'
import IndexPage from '@/templates/IndexPage'

async function getHomePageData() {
  const indexData = await getMarkdownData('index.md')
  const allBlogPosts = await getAllBlogPosts()
  const allPortfolioItems = await getAllPortfolioItems()

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

export default async function HomePage() {
  const data = await getHomePageData()
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
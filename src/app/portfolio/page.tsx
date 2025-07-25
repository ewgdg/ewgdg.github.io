import { getAllPortfolioItems, getMarkdownData } from '@/lib/localstorage'
import BlogPage from '@/templates/BlogPage'

async function getPortfolioPageData() {
  const portfolioData = await getMarkdownData('portfolio.md')
  const portfolioItems = await getAllPortfolioItems()

  // Simplified data structure without GraphQL nesting
  const data = {
    frontmatter: {
      jumbotronProps: portfolioData?.frontmatter?.jumbotron || {
        headline: "Portfolio",
        subtitle: "Projects and work",
        image: "/img/portfolio-jumbotron.jpg"
      }
    },
    posts: portfolioItems
  }

  return data
}

export default async function PortfolioPageWrapper() {
  const data = await getPortfolioPageData()

  return (
    <BlogPage
      data={data}
      uri="/portfolio"
    />
  )
}
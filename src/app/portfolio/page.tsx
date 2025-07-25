import { getAllPortfolioItems, getMarkdownData } from '@/lib/localstorage'
import BlogPage from '@/templates/BlogPage'

function getPortfolioPageData() {
  const portfolioData = getMarkdownData('portfolio.md')
  const portfolioItems = getAllPortfolioItems()

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

export default function PortfolioPageWrapper() {
  const data = getPortfolioPageData()

  return (
    <BlogPage
      data={data}
      uri="/portfolio"
    />
  )
}
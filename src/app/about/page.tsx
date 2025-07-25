import { getMarkdownData } from '@/lib/localstorage'
import AboutPage from '@/templates/AboutPage'

function getAboutPageData() {
  const aboutData = getMarkdownData('about.md')

  return {
    markdownRemark: {
      frontmatter: {
        jumbotronProps: aboutData?.frontmatter?.jumbotron || {
          headline: "About",
          subtitle: "Get to know me",
          image: "/img/about-jumbotron.jpg"
        },
        facts: aboutData?.frontmatter?.facts || []
      }
    }
  }
}

export default function AboutPageWrapper() {
  const data = getAboutPageData()

  return <AboutPage data={data} />
}
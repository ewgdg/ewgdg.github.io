import { getMarkdownData } from '@/lib/content/content'
import AboutPage from '@/templates/about-page'

async function getAboutPageData() {
  const aboutData = await getMarkdownData('about.md')

  return {
    markdownRemark: {
      frontmatter: {
        jumbotronProps: (aboutData?.frontmatter as any)?.jumbotron || {
          headline: "About",
          subtitle: "Get to know me",
          image: "/img/about-jumbotron.jpg"
        },
        facts: (aboutData?.frontmatter as any)?.facts || []
      }
    }
  }
}

export default async function AboutPageWrapper() {
  const data = await getAboutPageData()

  return <AboutPage data={data} />
}

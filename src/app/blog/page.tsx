import { Suspense } from 'react'
import { getAllBlogPosts, getMarkdownData } from '@/lib/content/content'
import SEO from '@/components/header/seo'
import { BlogCardsLoadingSection, BlogPageFrame, BlogPostsSection } from '@/templates/blog-page-template'

const BLOG_URI = '/blog'
const BLOG_TABLE_NAME = 'blogTable'

async function getBlogJumbotronProps() {
  const blogData = await getMarkdownData('blog.md', { includeContent: false })

  return (blogData?.frontmatter as any)?.jumbotron || {
    headline: 'Blog',
    subtitle: 'Thoughts and ideas',
    image: '/img/blog-jumbotron.webp',
  }
}

async function BlogPostsSectionLoader() {
  const posts = await getAllBlogPosts()

  return (
    <BlogPostsSection
      posts={posts}
      tableName={BLOG_TABLE_NAME}
      uri={BLOG_URI}
    />
  )
}

export default async function BlogPageWrapper() {
  const jumbotronProps = await getBlogJumbotronProps()

  return (
    <>
      <SEO title="Blog" />
      <BlogPageFrame jumbotronProps={jumbotronProps}>
        <Suspense fallback={<BlogCardsLoadingSection />}>
          <BlogPostsSectionLoader />
        </Suspense>
      </BlogPageFrame>
    </>
  )
}

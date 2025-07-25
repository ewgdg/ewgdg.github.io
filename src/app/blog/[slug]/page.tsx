import { notFound } from 'next/navigation'
import { getAllBlogPosts, getMarkdownData } from '@/lib/localstorage'
import BlogPost from '@/templates/BlogPost'

export function generateStaticParams() {
  const posts = getAllBlogPosts()

  return posts.map(post => ({
    slug: post.slug
  }))
}

type Props = {
  params: Promise<{ slug: string }>
}

async function getBlogPost(slug: string) {
  const post = getMarkdownData(`blog/${slug}.md`)

  if (!post) {
    return null
  }

  return post
}

export default async function BlogPostWrapper({ params }: Props) {
  const resolvedParams = await params
  const post = await getBlogPost(resolvedParams.slug)

  if (!post) {
    notFound()
  }

  // return <BlogPostTemplate
  //   title={post.frontmatter.title}
  //   description={post.frontmatter.description}
  //   tags={post.frontmatter.tags}
  //   publicationDate={post.frontmatter.date}
  //   featuredImage={post.frontmatter.featuredImage}
  //   content={post.html}
  //   helmet=""
  // />
  return <BlogPost
    data={post}
    uri={`/blog/${resolvedParams.slug}`}
  />
}
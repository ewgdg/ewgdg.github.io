import { notFound } from 'next/navigation'
import { getAllPortfolioItems, getMarkdownData } from '@/lib/localstorage'
import BlogPost from '@/templates/BlogPost'

export async function generateStaticParams() {
  const items = await getAllPortfolioItems()

  return items.map(item => ({
    slug: item.slug
  }))
}

type Props = {
  params: Promise<{ slug: string }>
}

async function getPortfolioItem(slug: string) {
  const item = await getMarkdownData(`portfolio/${slug}.md`)

  if (!item) {
    return null
  }

  return item
}

export default async function PortfolioItemWrapper({ params }: Props) {
  const resolvedParams = await params
  const item = await getPortfolioItem(resolvedParams.slug)

  if (!item) {
    notFound()
  }

  return <BlogPost
    data={item}
    uri={`/portfolio/${resolvedParams.slug}`}
  />
}
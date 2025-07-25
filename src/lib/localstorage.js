import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDirectory = path.join(process.cwd(), 'content')

export function getMarkdownData(filename, options = {}) {
  const { includeContent = true } = options

  try {
    const fullPath = path.join(contentDirectory, filename)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content, excerpt } = matter(fileContents, { excerpt: true })

    const result = {
      frontmatter: data,
      excerpt,
    }

    if (includeContent) {
      result.content = content
    }

    return result
  } catch (error) {
    console.error(`Error reading markdown file ${filename}:`, error)
    return null
  }
}

function* generateContentItems(contentType) {
  const typeDirectory = path.join(contentDirectory, contentType)
  const filenames = fs.readdirSync(typeDirectory)

  for (const filename of filenames) {
    if (!filename.endsWith('.md')) continue

    const markdownData = getMarkdownData(`${contentType}/${filename}`, {
      includeContent: false,
    })

    if (!markdownData || markdownData.frontmatter?.isTemplate) continue

    const { frontmatter, excerpt } = markdownData
    const slug = filename.replace(/\.md$/, '')

    yield {
      uri: `/${contentType}/${slug}`,
      slug,
      frontmatter,
      excerpt,
      filename
    }
  }
}

function getAllContentItems(contentType, sortByDate = true) {
  try {
    const items = Array.from(generateContentItems(contentType))

    if (sortByDate) {
      return items.sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date))
    }

    return items
  } catch (error) {
    console.error(`Error getting ${contentType} items:`, error)
    return []
  }
}

export function getAllBlogPosts() {
  return getAllContentItems('blog')
}

export function getAllPortfolioItems() {
  return getAllContentItems('portfolio')
}
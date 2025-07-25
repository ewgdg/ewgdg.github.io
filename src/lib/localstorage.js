import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'

const contentDirectory = path.join(process.cwd(), 'content')

export function getMarkdownData(filename) {
  try {
    const fullPath = path.join(contentDirectory, filename)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      frontmatter: data,
      content,
      html: marked(content)
    }
  } catch (error) {
    console.error(`Error reading markdown file ${filename}:`, error)
    return null
  }
}

export function getAllBlogPosts() {
  try {
    const blogDirectory = path.join(contentDirectory, 'blog')
    const filenames = fs.readdirSync(blogDirectory)

    const posts = filenames
      .filter(name => name.endsWith('.md'))
      .map(filename => {
        const { frontmatter, content } = getMarkdownData(`blog/${filename}`)
        const slug = filename.replace(/\.md$/, '')

        return {
          uri: `/blog/${slug}`,
          slug,
          frontmatter,
          content,
          filename
        }
      })
      .filter(item => !item.frontmatter.isTemplate)
      .sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date))

    return posts
  } catch (error) {
    console.error('Error getting blog posts:', error)
    return []
  }
}

export function getAllPortfolioItems() {
  try {
    const portfolioDirectory = path.join(contentDirectory, 'portfolio')
    const filenames = fs.readdirSync(portfolioDirectory)

    const items = filenames
      .filter(name => name.endsWith('.md'))
      .map(filename => {
        const { frontmatter, content } = getMarkdownData(`portfolio/${filename}`)
        const slug = filename.replace(/\.md$/, '')

        return {
          uri: `/portfolio/${slug}`,
          slug,
          frontmatter,
          content,
          filename
        }
      })
      .filter(item => !item.frontmatter.isTemplate)

    return items
  } catch (error) {
    console.error('Error getting portfolio items:', error)
    return []
  }
}
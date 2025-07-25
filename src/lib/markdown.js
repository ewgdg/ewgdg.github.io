import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypePrismPlus from 'rehype-prism-plus'
import rehypeStringify from 'rehype-stringify'

const processor = remark()
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypePrismPlus, {
    showLineNumbers: true,
    ignoreMissing: true
  })
  .use(rehypeStringify)

export async function processMarkdown(markdown) {
  const result = await processor.process(markdown)
  return result.toString()
}

export default processMarkdown
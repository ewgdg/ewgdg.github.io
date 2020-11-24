/* eslint-disable no-restricted-syntax */
// const marked = require("marked")
const { readFile, readdir, writeFile } = require("fs").promises
const { rmdirSync, unlinkSync, mkdirSync } = require("fs")
// const { htmlToText } = require("html-to-text")
const { markdownToTxt } = require("markdown-to-txt")
const path = require("path")
const he = require("he")
// const os = require("os")

// marked.setOptions({
//   renderer: new marked.Renderer(),
//   pedantic: false,
//   gfm: true,
//   breaks: false,
//   sanitize: false,
//   smartLists: true,
//   smartypants: false,
//   xhtml: false,
// })

async function* walk(dir) {
  const subdirs = await readdir(dir, { withFileTypes: true })
  // eslint-disable-next-line no-restricted-syntax
  for (const subdir of subdirs) {
    const subDirPath = path.join(dir, subdir.name)
    if (subdir.isDirectory()) {
      yield* walk(subDirPath)
    } else {
      yield subDirPath
    }
  }
}

async function rm(dir) {
  for await (const file of walk(dir)) {
    unlinkSync(file)
  }
  rmdirSync(dir, { recursive: true })
}

const srcDir = path.resolve(__dirname, "..", "pages")
// eslint-disable-next-line camelcase
const targetDir = path.join(__dirname, "doc_dir")

function stripHtml(html) {
  // Create a new div element
  const stripedHtml = html.replace(/<[^>]+>/g, "")
  const decodedStripedHtml = he.decode(stripedHtml)
  return decodedStripedHtml
}

;(async () => {
  try {
    await rm(targetDir)
  } catch (e) {
    // pass
  }
  // eslint-disable-next-line no-restricted-syntax
  const res = []
  for await (const file of walk(srcDir)) {
    if (path.extname(file) === ".md")
      res.push({ name: file, data: await readFile(file) })
  }
  Promise.allSettled(res).then(list => {
    for (const item of list) {
      if (item.status === "fulfilled") {
        const file = item.value.name
        const { data } = item.value
        // console.log(item)
        // const html = marked(data.toString())
        // const text1 = htmlToText(data.toString(), {
        //   wordwrap: 80,
        // })
        const text = he.decode(
          he.decode(markdownToTxt(stripHtml(data.toString())))
        )
        const fileDestDir = path.join(
          targetDir,
          path.relative(srcDir, path.dirname(file))
        )
        mkdirSync(fileDestDir, { recursive: true })

        writeFile(
          path.join(
            fileDestDir,
            `${path.basename(file, path.extname(file))}.txt`
          ),
          text
        )
      }
    }
  })
})()

// const html = marked("# Marked in Node.js\n\nRendered by **marked**.")

import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const projectRoot = process.cwd()
const imageRoot = path.join(projectRoot, 'public', 'img')
const rewriteRoots = [
  path.join(projectRoot, 'content'),
  path.join(projectRoot, 'src'),
  path.join(projectRoot, 'public'),
]
const imageExtensions = new Set(['.jpg', '.jpeg', '.png'])
const textExtensions = new Set([
  '.cjs',
  '.css',
  '.html',
  '.js',
  '.json',
  '.jsx',
  '.md',
  '.mjs',
  '.ts',
  '.tsx',
  '.txt',
  '.yml',
  '.yaml',
])
const ignoredDirectoryNames = new Set([
  '.git',
  '.next',
  'node_modules',
  'out',
  'generated',
])
const ignoredImageFilenames = new Set([
  // Keep PNG for favicon/PWA compatibility; WebP icon support is less universal.
  'icon.png',
])

function toPosixPath(filePath) {
  return filePath.split(path.sep).join('/')
}

async function pathExists(filePath) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

async function walkFiles(root, predicate) {
  if (!(await pathExists(root))) return []

  const result = []
  const entries = await fs.readdir(root, { withFileTypes: true })

  for (const entry of entries) {
    if (entry.name.startsWith('.') && ignoredDirectoryNames.has(entry.name)) continue

    const fullPath = path.join(root, entry.name)
    if (entry.isDirectory()) {
      if (ignoredDirectoryNames.has(entry.name)) continue
      result.push(...await walkFiles(fullPath, predicate))
    } else if (!predicate || predicate(fullPath)) {
      result.push(fullPath)
    }
  }

  return result
}

function isConvertibleImage(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  return imageExtensions.has(ext) && !ignoredImageFilenames.has(path.basename(filePath))
}

function isTextFile(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  return textExtensions.has(ext)
}

function getReplacementPairs(imagePath) {
  const relativeToPublic = toPosixPath(path.relative(path.join(projectRoot, 'public'), imagePath))
  const publicUrl = `/${relativeToPublic}`
  const webpPublicUrl = publicUrl.replace(/\.[^.]+$/, '.webp')
  const publicRelativePath = relativeToPublic
  const webpPublicRelativePath = publicRelativePath.replace(/\.[^.]+$/, '.webp')

  return [
    [publicUrl, webpPublicUrl],
    [publicRelativePath, webpPublicRelativePath],
  ]
}

async function convertImage(imagePath) {
  const outputPath = imagePath.replace(/\.[^.]+$/, '.webp')
  await sharp(imagePath)
    .rotate()
    .webp({ quality: 82, effort: 6 })
    .toFile(outputPath)
  return outputPath
}

async function rewriteReferences(replacements) {
  const textFilesNested = await Promise.all(
    rewriteRoots.map(root => walkFiles(root, isTextFile))
  )
  const textFiles = [...new Set(textFilesNested.flat())]
  const changedFiles = []

  for (const filePath of textFiles) {
    let content = await fs.readFile(filePath, 'utf8')
    let nextContent = content

    for (const [oldText, newText] of replacements) {
      nextContent = nextContent.split(oldText).join(newText)
    }

    if (nextContent !== content) {
      await fs.writeFile(filePath, nextContent)
      changedFiles.push(filePath)
    }
  }

  return changedFiles
}

async function findRemainingReferences(oldReferences) {
  const textFilesNested = await Promise.all(
    rewriteRoots.map(root => walkFiles(root, isTextFile))
  )
  const textFiles = [...new Set(textFilesNested.flat())]
  const remaining = []

  for (const filePath of textFiles) {
    const content = await fs.readFile(filePath, 'utf8')
    for (const reference of oldReferences) {
      if (content.includes(reference)) {
        remaining.push({ filePath, reference })
      }
    }
  }

  return remaining
}

async function convertImagesToWebp() {
  const imageFiles = await walkFiles(imageRoot, isConvertibleImage)
  const replacements = []
  const converted = []

  for (const imagePath of imageFiles) {
    const outputPath = await convertImage(imagePath)
    converted.push({ imagePath, outputPath })
    replacements.push(...getReplacementPairs(imagePath))
  }

  const changedFiles = await rewriteReferences(replacements)
  const oldReferences = replacements.map(([oldText]) => oldText)
  const remainingReferences = await findRemainingReferences(oldReferences)

  if (remainingReferences.length > 0) {
    console.error('Some old image references remain; originals were kept:')
    remainingReferences.forEach(({ filePath, reference }) => {
      console.error(`- ${path.relative(projectRoot, filePath)}: ${reference}`)
    })
    process.exitCode = 1
    return
  }

  for (const { imagePath } of converted) {
    await fs.unlink(imagePath)
  }

  console.log(`Converted ${converted.length} images to WebP.`)
  console.log(`Updated ${changedFiles.length} text files.`)
  converted.forEach(({ imagePath, outputPath }) => {
    console.log(`${path.relative(projectRoot, imagePath)} -> ${path.relative(projectRoot, outputPath)}`)
  })
}

convertImagesToWebp().catch(error => {
  console.error(error)
  process.exitCode = 1
})

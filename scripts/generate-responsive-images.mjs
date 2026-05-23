import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const projectRoot = process.cwd()
const publicDir = path.join(projectRoot, 'public')
const outputDir = path.join(publicDir, 'img', 'generated')
const variantsConfigPath = path.join(projectRoot, 'src', 'lib', 'images', 'jumbotron-image-variants.json')
const manifestPath = path.join(projectRoot, 'src', 'lib', 'images', 'jumbotron-generated-images.json')
const jumbotronImageConfig = JSON.parse(await fs.readFile(variantsConfigPath, 'utf8'))

const FORMAT_OPTIONS = {
  webp: { quality: 82, effort: 5 },
}
const PLACEHOLDER_OPTIONS = {
  width: 32,
  blurSigma: 4,
  quality: 35,
  effort: 4,
}

function publicPathToFilePath(publicPath) {
  return path.join(publicDir, publicPath.replace(/^\//, ''))
}

function outputPathFor(publicImagePath, width, format) {
  const filename = path.basename(publicImagePath)
  const basename = filename.replace(/\.[^.]+$/, '')
  return path.join(outputDir, `${basename}-${width}.${format}`)
}

async function fileSize(filePath) {
  const stat = await fs.stat(filePath)
  return stat.size
}

async function generateVariant(inputPath, outputPath, width, format) {
  let pipeline = sharp(inputPath)
    .rotate()
    .resize({ width, withoutEnlargement: true })

  if (format === 'webp') {
    pipeline = pipeline.webp(FORMAT_OPTIONS.webp)
  } else {
    throw new Error(`Unsupported image format: ${format}`)
  }

  await pipeline.toFile(outputPath)
}

async function generatePlaceholderDataUrl(inputPath) {
  const buffer = await sharp(inputPath)
    .rotate()
    .resize({ width: PLACEHOLDER_OPTIONS.width, withoutEnlargement: true })
    .blur(PLACEHOLDER_OPTIONS.blurSigma)
    .webp({ quality: PLACEHOLDER_OPTIONS.quality, effort: PLACEHOLDER_OPTIONS.effort })
    .toBuffer()

  return `data:image/webp;base64,${buffer.toString('base64')}`
}

async function listGeneratedFiles() {
  try {
    const entries = await fs.readdir(outputDir)
    return entries.map(entry => path.join(outputDir, entry))
  } catch (error) {
    if (error.code === 'ENOENT') return []
    throw error
  }
}

async function removeUnusedGeneratedFiles(expectedOutputPaths) {
  const expected = new Set(expectedOutputPaths)
  const existingFiles = await listGeneratedFiles()
  const unusedFiles = existingFiles.filter(filePath => !expected.has(filePath))

  for (const filePath of unusedFiles) {
    await fs.unlink(filePath)
    console.log(`removed stale ${path.relative(projectRoot, filePath)}`)
  }
}

async function getTargetImages() {
  const images = {}

  for (const [publicImagePath, imageConfig] of Object.entries(jumbotronImageConfig.images)) {
    const inputPath = publicPathToFilePath(publicImagePath)
    const metadata = await sharp(inputPath).metadata()
    const originalWidth = metadata.width ?? 0
    const widths = imageConfig.widths || jumbotronImageConfig.widths
    const targetWidths = widths.filter(width => width <= originalWidth)

    if (targetWidths.length === 0) {
      throw new Error(`${publicImagePath} is too small for configured responsive widths`)
    }

    images[publicImagePath] = {
      alt: imageConfig.alt || '',
      inputPath,
      widths: targetWidths,
      variants: targetWidths.flatMap(width => Object.keys(FORMAT_OPTIONS).map(format => ({
        inputPath,
        width,
        format,
        outputPath: outputPathFor(publicImagePath, width, format),
      }))),
    }
  }

  return images
}

async function writeManifest(targetImages) {
  const manifestEntries = await Promise.all(
    Object.entries(targetImages).map(async ([publicImagePath, image]) => [
      publicImagePath,
      {
        alt: image.alt,
        widths: image.widths,
        placeholderDataUrl: await generatePlaceholderDataUrl(image.inputPath),
      },
    ])
  )
  const manifest = Object.fromEntries(manifestEntries)

  await fs.writeFile(`${manifestPath}.tmp`, `${JSON.stringify(manifest, null, 2)}\n`)
  await fs.rename(`${manifestPath}.tmp`, manifestPath)
}

async function generateResponsiveImages() {
  await fs.mkdir(outputDir, { recursive: true })

  const targetImages = await getTargetImages()
  const variants = Object.values(targetImages).flatMap(image => image.variants)
  await removeUnusedGeneratedFiles(variants.map(variant => variant.outputPath))

  for (const variant of variants) {
    await generateVariant(variant.inputPath, variant.outputPath, variant.width, variant.format)
    const size = await fileSize(variant.outputPath)
    console.log(`${path.relative(projectRoot, variant.outputPath)} ${(size / 1024).toFixed(1)} KB`)
  }

  await writeManifest(targetImages)
  console.log(`${path.relative(projectRoot, manifestPath)} updated`)
}

generateResponsiveImages().catch(error => {
  console.error(error)
  process.exitCode = 1
})

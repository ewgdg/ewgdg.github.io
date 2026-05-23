import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const projectRoot = process.cwd()
const publicDir = path.join(projectRoot, 'public')
const outputDir = path.join(publicDir, 'img', 'generated')
const variantsConfigPath = path.join(projectRoot, 'src', 'lib', 'images', 'jumbotron-image-variants.json')
const manifestPath = path.join(projectRoot, 'src', 'lib', 'images', 'jumbotron-generated-images.json')
const jumbotronImageConfig = JSON.parse(await fs.readFile(variantsConfigPath, 'utf8'))
const generatedJumbotronImages = JSON.parse(await fs.readFile(manifestPath, 'utf8'))
const REQUIRED_FORMATS = ['webp']

function publicPathToFilePath(publicPath) {
  return path.join(publicDir, publicPath.replace(/^\//, ''))
}

function outputPathFor(publicImagePath, width, format) {
  const filename = path.basename(publicImagePath)
  const basename = filename.replace(/\.[^.]+$/, '')
  return path.join(outputDir, `${basename}-${width}.${format}`)
}

async function exists(filePath) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

function sameArray(left, right) {
  return left.length === right.length && left.every((item, index) => item === right[index])
}

async function checkResponsiveImages() {
  const missingFiles = []
  const manifestErrors = []

  for (const [publicImagePath, imageConfig] of Object.entries(jumbotronImageConfig.images)) {
    const inputPath = publicPathToFilePath(publicImagePath)
    if (!(await exists(inputPath))) {
      missingFiles.push(path.relative(projectRoot, inputPath))
      continue
    }

    const metadata = await sharp(inputPath).metadata()
    const originalWidth = metadata.width ?? 0
    const widths = imageConfig.widths || jumbotronImageConfig.widths
    const targetWidths = widths.filter(width => width <= originalWidth)
    const manifestImage = generatedJumbotronImages[publicImagePath]

    if (targetWidths.length === 0) {
      throw new Error(`${publicImagePath} is too small for configured responsive widths`)
    }

    if (!manifestImage) {
      manifestErrors.push(`${publicImagePath} missing from generated manifest`)
    } else if (!sameArray(manifestImage.widths, targetWidths)) {
      manifestErrors.push(
        `${publicImagePath} manifest widths ${JSON.stringify(manifestImage.widths)} do not match expected ${JSON.stringify(targetWidths)}`
      )
    }

    for (const width of targetWidths) {
      for (const format of REQUIRED_FORMATS) {
        const outputPath = outputPathFor(publicImagePath, width, format)
        if (!(await exists(outputPath))) {
          missingFiles.push(path.relative(projectRoot, outputPath))
        }
      }
    }
  }

  for (const publicImagePath of Object.keys(generatedJumbotronImages)) {
    if (!jumbotronImageConfig.images[publicImagePath]) {
      manifestErrors.push(`${publicImagePath} is stale in generated manifest`)
    }
  }

  if (manifestErrors.length > 0) {
    console.error('Responsive image manifest is stale:')
    manifestErrors.forEach(error => console.error(`- ${error}`))
    console.error('\nRun `npm run images:generate` and commit the generated files.')
    process.exitCode = 1
    return
  }

  if (missingFiles.length > 0) {
    console.error('Missing generated responsive image files:')
    missingFiles.forEach(file => console.error(`- ${file}`))
    console.error('\nRun `npm run images:generate` and commit the generated files.')
    process.exitCode = 1
    return
  }

  console.log('Responsive image files are present.')
}

checkResponsiveImages().catch(error => {
  console.error(error)
  process.exitCode = 1
})

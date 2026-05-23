import generatedJumbotronImages from "./jumbotron-generated-images.json"

function buildGeneratedImagePath(imagePath, width, format) {
  const filename = imagePath.split("/").pop()
  const basename = filename.replace(/\.[^.]+$/, "")
  return `/img/generated/${basename}-${width}.${format}`
}

function buildSrcSet(imagePath, widths, format) {
  return widths
    .map(width => `${buildGeneratedImagePath(imagePath, width, format)} ${width}w`)
    .join(", ")
}

export function getJumbotronResponsiveImage(imagePath) {
  const imageConfig = generatedJumbotronImages[imagePath]
  if (!imageConfig) return null

  return {
    alt: imageConfig.alt || "",
    sizes: "100vw",
    webpSrcSet: buildSrcSet(imagePath, imageConfig.widths, "webp"),
    fallbackSrc: imagePath,
    placeholderDataUrl: imageConfig.placeholderDataUrl,
  }
}

export { generatedJumbotronImages }

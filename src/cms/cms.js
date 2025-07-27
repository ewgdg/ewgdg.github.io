/* eslint-disable no-useless-escape */
import CMS from "decap-cms-app"
// import uploadcare from "netlify-cms-media-library-uploadcare"
// import cloudinary from "netlify-cms-media-library-cloudinary"

import BlogPostPreview from "./preview-templates/blog-post-preview"
// import BlogPagePreview from "./preview-templates/BlogPagePreview"
// import IndexPagePreview from "./preview-templates/IndexPagePreview"

// import AboutPagePreview from "./preview-templates/AboutPagePreview"

CMS.init()

// CMS.registerMediaLibrary(uploadcare)
// CMS.registerMediaLibrary(cloudinary)

// CMS.registerPreviewTemplate("indexPage", IndexPagePreview)
// CMS.registerPreviewTemplate("aboutPage", AboutPagePreview)
// CMS.registerPreviewTemplate("blogListPage", BlogPagePreview)
CMS.registerPreviewTemplate("blogPost", BlogPostPreview)
CMS.registerPreviewTemplate("portfolioPost", BlogPostPreview)

CMS.registerEditorComponent({
  // Internal id of the component
  id: "HtmlImage",
  // Visible label
  label: "HtmlImage",
  // Fields the user need to fill out when adding an instance of the component
  fields: [
    { name: "src", label: "src", widget: "image" },
    { name: "containerStyle", label: "Container Style", widget: "string" },
  ],
  // Pattern to identify a block as being an instance of this component
  pattern: /^<div[^<>]*?class='figureImage'[^<>]*?>.*?<\/div>$/,
  // Function to extract data elements from the regexp match
  fromBlock(match) {
    return {
      src: match[0].match(/(?<=<img[^<>]*?src=['"]).*?(?=['"][^<>]*?>)/),
      containerStyle: match[0].match(
        /(?<=<div[^<>]*?style=['"]).*?(?=['"][^<>]*?>)/
      ),
    }
  },
  // Function to create a text block from an instance of this component
  toBlock(obj) {
    return `<div class='figureImage' style="${obj.containerStyle}" > <img src="${obj.src}"/> </div>`
  },
  // Preview output for this component. Can either be a string or a React component
  // (component gives better render performance)
  toPreview(obj) {
    return `<div class='figureImage' style="${obj.containerStyle}"> <img src="${obj.src}" style="width:100%;object-fit:cover;margin-bottom:0;" /> </div>`
  },
})

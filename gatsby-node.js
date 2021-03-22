/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it
const path = require("path")
const { createFilePath } = require("gatsby-source-filesystem")
// const { fmImagesToRelative } = require("gatsby-remark-relative-images")
// add webpack config
exports.onCreateWebpackConfig = ({
  stage,
  rules,
  loaders,
  plugins,
  getConfig,
  actions,
}) => {
  const config = getConfig()
  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, "src"), "node_modules"],
      alias: {
        TweenLite: path.resolve(
          "node_modules",
          "gsap/src/uncompressed/TweenLite.js"
        ),
        TweenMax: path.resolve(
          "node_modules",
          "gsap/src/uncompressed/TweenMax.js"
        ),
        TimelineLite: path.resolve(
          "node_modules",
          "gsap/src/uncompressed/TimelineLite.js"
        ),
        TimelineMax: path.resolve(
          "node_modules",
          "gsap/src/uncompressed/TimelineMax.js"
        ),
        ScrollMagic: path.resolve("node_modules", "scrollmagic"),
        "animation.gsap": path.resolve(
          "node_modules",
          "scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap.js"
        ),
        "debug.addIndicators": path.resolve(
          "node_modules",

          "scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators.js"
        ),
        "react-dom": "@hot-loader/react-dom",
      },
    },
  })
}
exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions

  const result = await graphql(`
    {
      allMarkdownRemark(limit: 1000) {
        edges {
          node {
            id
            fields {
              slug
            }
            frontmatter {
              templateKey
            }
          }
        }
      }
    }
  `)

  if (result.errors) {
    result.errors.forEach(e => console.error(e.toString()))
    return Promise.reject(result.errors)
  }

  const posts = result.data.allMarkdownRemark.edges

  posts.forEach(edge => {
    const { id } = edge.node
    const { node } = edge
    if (
      node.frontmatter.templateKey &&
      path.resolve(
        `src/templates/${String(node.frontmatter.templateKey)}.jsx`
      ) &&
      !node.frontmatter.isTemplate
    ) {
      createPage({
        path: node.fields.slug,
        tags: node.frontmatter.tags,
        component: path.resolve(
          `src/templates/${String(node.frontmatter.templateKey)}.jsx`
        ),
        // additional data can be passed via context
        context: {
          id,
          slug: node.fields.slug,
        },
      })
    }
  })
  return null
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  // fmImagesToRelative(node) // convert image paths for gatsby images
  if (node.internal.type === `MarkdownRemark`) {
    // console.log(node)
  }
  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode, basePath: `pages` })

    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

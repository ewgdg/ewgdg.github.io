module.exports = {
  siteMetadata: {
    title: "Xian's Page",
    description: "Personal page",
    author: "Xian Zhang",
  },
  plugins: [
    {
      // keep as first gatsby-source-filesystem plugin for gatsby image support
      resolve: "gatsby-source-filesystem",
      options: {
        path: `${__dirname}/static/img`,
        name: "uploads",
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: `${__dirname}/src/pages`,
        name: "pages",
      },
    },
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          // {
          //   // NOTE: This was built for use with NetlifyCMS
          //   // and should be considered a temporary solution until relative paths are supported.
          //   resolve: "gatsby-remark-relative-images",
          //   options: {
          //     name: "uploads",
          //   },
          // },
          {
            resolve: `gatsby-plugin-netlify-cms-paths`,
            options: {
              // Path to your Netlify CMS config file
              cmsConfig: `/static/admin/config.yml`
            }
          },
          {
            resolve: "gatsby-remark-copy-linked-files",
            // options: {
            //   destinationDir: "static",
            // },
          },
          {
            resolve: "gatsby-remark-images",
            options: {
              // It's important to specify the maxWidth (in pixels) of
              // the content container as this plugin uses this as the
              // base for generating different widths of each image.
              maxWidth: 2048,
              // eslint-disable-next-line no-unused-vars
              wrapperStyle: fluidResult => {
                return "width:100%;margin-left:auto;margin-right:auto;margin-bottom:0;margin-top:0;pointer-events: none;"
              },
              linkImagesToOriginal: false,
              quality: 80,
            },
          },
        ],
      },
    },
    //todo: prism plugin?
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: "Xian's Page",
        short_name: "Xian",
        start_url: "/",
        background_color: "white",
        theme_color: "#cc1f41",
        display: "minimal-ui",
        icon: "src/images/icon.png", // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,

    "gatsby-plugin-styled-jsx",
    "gatsby-plugin-material-ui",

    {
      resolve: "gatsby-plugin-netlify-cms",
      options: {
        modulePath: `${__dirname}/src/cms/cms.js`,
      },
    },
    "gatsby-plugin-netlify",
  ],
}
// define graphql createType
// using Gatsby Type Builder API
exports.createSchemaCustomization = ({ actions, schema }) => {
  const { createTypes } = actions
  const typeDefs = [
    schema.buildObjectType({
      name: 'MarkdownRemark',
      fields: {
        frontmatter: 'Frontmatter!'
      },
      interfaces: ['Node'],
      extensions: {
        infer: true,
      },
    }),
    schema.buildObjectType({
      name: 'Frontmatter',
      fields: {
        title: {
          type: 'String!',
          resolve(parent) {
            return parent.title || '(Untitled)'
          }
        },
        date: {
          type: 'Date!',
          extensions: {
            dateformat: {},
          },
        },
        featuredImage: 'File!',
        // tags: '[String!]!',
      }
    }),
    
  ]
  createTypes(typeDefs)
}
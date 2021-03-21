module.exports = {
  siteMetadata: {
    title: "Xian's Page",
    description: "Personal page",
    author: "Xian Zhang",
  },
  plugins: [

    // {
    //   resolve: "gatsby-source-filesystem",
    //   options: {
    //     path: `${__dirname}/static`,
    //     name: "static",
    //   },
    // },
    //it’ll be best if you include ’gatsby-transformer-sharp’ ’gatsby-plugin-sharp’ and ’gatsby-transformer-remark’ before any other plugin in gatsby-config.js. Not doing this might lead to the following error.
    //Field "image" must not have a selection since type "String" has no subfields
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    `gatsby-remark-images`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [

          // {
          //   // NOTE: This was built for use with NetlifyCMS
          //   // and should be considered a temporary solution until relative paths are supported.
          //   resolve: "gatsby-remark-relative-images",
          //   options: {
          //     // [Optional] The root of "media_folder" in your config.yml
          //     // Defaults to "static"
          //     staticFolderName: 'static',
          //     // [Optional] Include the following fields, use dot notation for nested fields
          //     // All fields are included by default
          //     // include: ['featured'],
          //     // [Optional] Exclude the following fields, use dot notation for nested fields
          //     // No fields are excluded by default
          //     // exclude: ['featured.skip'],
          //     // name: "uploads",
          //   },
          // },//doesnt work anymore becasue the path uses \ instead of /, use gatsby-plugin-netlify-cms-paths instead

          {
            resolve: `gatsby-plugin-netlify-cms-paths`,
            options: {
              cmsConfig: `/static/admin/config.yml`,
            },
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
          "gatsby-remark-copy-linked-files",
          // {
          //   resolve: "gatsby-remark-copy-linked-files",
          //   options: {
          //     destinationDir: "static", //wrong , static folder will be copied to public folder  //You can create a folder named static at the root of your project. Every file you put into that folder will be copied into the public folder. E.g. if you add a file named sun.jpg to the static folder, it’ll be copied to public/sun.jpg
          //   },
          // },
        ],
      },
    },
    // { //todo: add plugin?
    //   resolve: `gatsby-remark-prismjs`,
    //   options: {
    //     classPrefix: 'language-',
    //     noInlineHighlight: false,
    //   },
    // },
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
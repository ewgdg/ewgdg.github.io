/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it
const path = require("path")
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
        ScrollMagic: path.resolve(
          "node_modules",
          "scrollmagic-with-ssr/index.js"
        ),
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
      // alias: {
      //   TweenLite: require.resolve("node_modules", {
      //     paths: ["gsap/src/uncompressed/TweenLite.js"],
      //   }),
      //   TweenMax: require.resolve("node_modules", {
      //     paths: ["gsap/src/uncompressed/TweenMax.js"],
      //   }),
      //   TimelineLite: require.resolve("node_modules", {
      //     paths: ["gsap/src/uncompressed/TimelineLite.js"],
      //   }),
      //   TimelineMax: require.resolve("node_modules", {
      //     paths: ["gsap/src/uncompressed/TimelineMax.js"],
      //   }),
      //   ScrollMagic: require.resolve("node_modules", {
      //     paths: ["scrollmagic/scrollmagic/uncompressed/ScrollMagic.js"],
      //   }),
      //   "animation.gsap": require.resolve("node_modules", {
      //     paths: [
      //       "scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap.js",
      //     ],
      //   }),
      //   "debug.addIndicators": require.resolve("node_modules", {
      //     paths: [
      //       "scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators.js",
      //     ],
      //   }),
      // },
    },
  })
}

/* eslint-disable global-require */
let PIXI
if (typeof window !== "undefined") {
  PIXI = require("pixi.js")
}

module.exports = PIXI

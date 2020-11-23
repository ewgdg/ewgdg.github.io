/* eslint-disable global-require */
let PIXI
// pixi calls window, which is not defined in server env, and we dont need to load pixi in server env
if (typeof window !== "undefined") {
  PIXI = require("pixi.js")
}

module.exports = PIXI

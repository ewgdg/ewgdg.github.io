/* eslint-disable global-require */
/* eslint-disable import/no-unresolved */
let ScrollMagic
let controller

if (typeof window !== "undefined") {
  ScrollMagic = require("scrollmagic")
  require("animation.gsap")
  if (process.env.NODE_ENV === "development") {
    require("debug.addIndicators")
  }
}

function getController(scrollLayer) {
  if (controller) return controller
  controller = new ScrollMagic.Controller({
    container: scrollLayer,
    refreshInterval: 0,
  })
  return controller
}

module.exports = {
  getController,
  ScrollMagic,
}

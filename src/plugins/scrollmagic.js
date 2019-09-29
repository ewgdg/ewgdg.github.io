/* eslint-disable no-underscore-dangle */
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
let _scrollLayer
function getController(scrollLayer) {
  if (_scrollLayer !== scrollLayer) {
    if (controller && controller.destroy) controller.destroy(true)

    controller = null
    controller = new ScrollMagic.Controller({
      container: scrollLayer,
      refreshInterval: 0,
    })
    _scrollLayer = scrollLayer
  }

  return controller
}

module.exports = {
  getController,
  ScrollMagic,
}

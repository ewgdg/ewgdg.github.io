const url = window.location.href
global.window = Object.create(window)
Object.defineProperty(window, "location", {
  value: {
    href: url,
  },
  writable: true,
})

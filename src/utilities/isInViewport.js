/*!
 * Determine if an element is in the viewport
 * (c) 2017 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param  {Node}    elem The element
 * @return {Boolean}      Returns true if element is in the viewport
 */
function isInViewport(elem) {
  if (!elem) return false
  const distance = elem.getBoundingClientRect()
  return (
    distance.top >= 0 &&
    distance.left >= 0 &&
    distance.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    distance.right <=
      (window.innerWidth || document.documentElement.clientWidth)
  )
}

function isAboveViewportBottom(elem) {
  if (!elem) return false
  const distance = elem.getBoundingClientRect()
  const offset = 1
  return (
    distance.bottom + offset <
    (window.innerHeight || document.documentElement.clientHeight)
  )
}
function isBelowViewportTop(elem) {
  if (!elem) return false
  const distance = elem.getBoundingClientRect()
  const offset = 1
  return distance.top - offset > 0
}

function isAnyInViewport(elem, offset = 0) {
  if (!elem) return false
  const distance = elem.getBoundingClientRect()
  return (
    distance.top + offset <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    distance.left <=
      (window.innerWidth || document.documentElement.clientWidth) &&
    distance.bottom - offset >= 0 &&
    distance.right >= 0
  )
}
export {
  isInViewport,
  isAnyInViewport,
  isAboveViewportBottom,
  isBelowViewportTop,
}

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

function isBottomInViewport(elem, topMargin = 0, bottomMargin = 0) {
  if (!elem) return false
  const distance = elem.getBoundingClientRect()
  return (
    distance.bottom - topMargin > 0 &&
    distance.bottom + bottomMargin <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    distance.left <=
      (window.innerWidth || document.documentElement.clientWidth) &&
    distance.right >= 0
  )
}

function isTopInViewport(elem, topMargin = 0, bottomMargin = 0) {
  if (!elem) return false
  const distance = elem.getBoundingClientRect()
  return (
    distance.top - topMargin >= 0 &&
    distance.top + bottomMargin <
      (window.innerHeight || document.documentElement.clientHeight) &&
    distance.left <=
      (window.innerWidth || document.documentElement.clientWidth) &&
    distance.right >= 0
  )
}

function isAboveViewportBottom(elem, offset = 1) {
  if (!elem) return false
  const distance = elem.getBoundingClientRect()

  return (
    distance.bottom + offset <
    (window.innerHeight || document.documentElement.clientHeight)
  )
}
function isBelowViewportTop(elem, offset = 1) {
  if (!elem) return false
  const distance = elem.getBoundingClientRect()

  return distance.top - offset > 0
}

function isAnyInViewport(elem, margin = 0) {
  if (!elem) return false
  const distance = elem.getBoundingClientRect()
  return (
    // not the case of top fall below the bottom bounding
    distance.top + margin <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    distance.left <=
      (window.innerWidth || document.documentElement.clientWidth) &&
    distance.bottom - margin >= 0 &&
    distance.right >= 0
  )
}
export {
  isInViewport,
  isAnyInViewport,
  isAboveViewportBottom,
  isBelowViewportTop,
  isBottomInViewport,
  isTopInViewport,
}

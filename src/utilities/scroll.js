/* eslint-disable no-param-reassign */
import BezierEasing from "bezier-easing"

// {"ease":".25,.1,.25,1","linear":"0,0,1,1","ease-in":".42,0,1,1","ease-out":"0,0,.58,1","ease-in-out":".42,0,.58,1"}
const easeInOut2 = BezierEasing(0.65, 0.1, 0.35, 0.99)
const easeInOut = BezierEasing(0.42, 0, 0.58, 1)
const ease = BezierEasing(0.25, 0.1, 0.25, 1)
const easeOut = BezierEasing(0, 0, 0.58, 1)
const linear = BezierEasing(0, 0, 1, 1)
const easeOutCubic = BezierEasing(0.215, 0.61, 0.355, 1)
const easeOutExpo = BezierEasing(0.19, 1, 0.22, 1)
const easeOutBow = BezierEasing(0, 0.66, 0, 0.99)
const easing = {
  easeInOut2,
  easeInOut,
  ease,
  easeOut,
  linear,
  easeOutCubic,
  easeOutExpo,
  easeOutBow,
}

const getWindowScrollTop = () => {
  return (
    window.pageYOffset ||
    window.scrollY ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0
  )
}
function getScrollTop(elem) {
  const doc = document.documentElement
  let top
  if (elem === doc || elem === window) {
    top = getWindowScrollTop() - (doc.clientTop || 0)
  } else {
    top = elem.scrollTop - (elem.clientTop || 0)
  }
  return top
}

const animationQueue = []

function scrollByAnimated(
  elem,
  change,
  duration = 1000,
  easingFunc = easing.easeInOut2
) {
  // if (duration <= 0) {
  //   elem.scrollTop += change
  // }
  let startingTime
  let scrolledAmt = 0
  const targetAmt = Math.abs(change)
  const scale = change < 0 ? -1 : 1
  let requestId
  const animation = {
    cancel: () => {
      cancelAnimationFrame(requestId)
    },
  }
  animationQueue.push(animation)
  return new Promise(resolve => {
    function scrollByRaf(currentTime) {
      requestId = requestAnimationFrame(scrollByRaf)

      const pastDuration = currentTime - startingTime
      const nextScrolledAmt = Math.ceil(
        easingFunc(Math.min(1, pastDuration / duration)) * targetAmt
      )

      // equilvalent to elem.scrollBy(0, (nextScrolledAmt - scrolledAmt) * scale)
      elem.scrollTop += (nextScrolledAmt - scrolledAmt) * scale
      scrolledAmt = nextScrolledAmt

      if (pastDuration >= duration) {
        // eslint-disable-next-line no-param-reassign
        elem.scrollTop += (targetAmt - scrolledAmt) * scale
        scrolledAmt = targetAmt
      }
      if (scrolledAmt >= targetAmt) {
        resolve()
        cancelAnimationFrame(requestId)
        animationQueue.shift()
      }
    }

    requestId = requestAnimationFrame(timeStamp => {
      startingTime = timeStamp
      scrollByRaf(timeStamp)
    })
  })
}

function clearAnimationQueue() {
  animationQueue.forEach(animation => {
    animation.cancel()
  })
  animationQueue.splice(0)
}

function scrollIntoView(elem, scrollLayer, duration = 700) {
  if (!scrollLayer) return Promise.reject()
  // const scrollTop = getScrollTop(scrollLayer)
  // const elemPosition = elem.offsetTop
  // const change = elemPosition - scrollTop
  const change = Math.round(elem.getBoundingClientRect().top)

  return scrollByAnimated(scrollLayer, change, duration)
}

export {
  scrollIntoView,
  getScrollTop,
  scrollByAnimated,
  clearAnimationQueue,
  animationQueue,
  easing,
}

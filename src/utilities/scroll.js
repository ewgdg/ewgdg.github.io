/* eslint-disable no-param-reassign */
import BezierEasing from "bezier-easing"
import throttle from "./throttle"
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

      const elapsedDuration = currentTime - startingTime
      const nextScrolledAmt = Math.ceil(
        easingFunc(Math.min(1, elapsedDuration / duration)) * targetAmt
      )

      // equilvalent to elem.scrollBy(0, (nextScrolledAmt - scrolledAmt) * scale)
      elem.scrollTop += (nextScrolledAmt - scrolledAmt) * scale
      scrolledAmt = nextScrolledAmt

      if (elapsedDuration >= duration) {
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
  const scrollTop = getScrollTop(scrollLayer)
  const elemPosition = elem.offsetTop
  const change = elemPosition - scrollTop
  // const change = Math.round(elem.getBoundingClientRect().top)

  return scrollByAnimated(scrollLayer, change, duration)
}

class ScrollDetector {
  constructor(scrollLayer, elem, duration) {
    this.scrollLayer = scrollLayer
    this.elem = elem
    this.duration = duration
  }

  setEventListener(callback) {
    this.eventListener = throttle(this.eventListenerFactory(callback), 30, true)
    this.scrollLayer.addEventListener("scroll", this.eventListener)
  }

  eventListenerFactory(callback) {
    let lastReadScrollTop = getScrollTop(this.scrollLayer)
    let lastTimeStamp = performance.now()
    let lastProgress = 0
    return () => {
      const st = getScrollTop(this.scrollLayer)
      const pos = this.elem.offsetTop

      let progress = null
      if (this.duration > 0) {
        const currentTime = performance.now()
        const diff = currentTime - lastTimeStamp
        lastTimeStamp = currentTime
        if (diff > 33.4) {
          // if there is a lag, ignore the scroll event
          return
        }
        progress = st - pos
        progress = Math.max(0, Math.min(this.duration, progress))
        progress /= this.duration
      } else if (st >= pos && lastReadScrollTop < pos) {
        // enter
        progress = 1
      } else if (
        st <= pos + this.duration &&
        lastReadScrollTop >= pos + this.duration
      ) {
        // enter backward
        progress = 0
      }
      lastReadScrollTop = st

      if (progress !== lastProgress) {
        callback(progress)
      }
      lastProgress = progress
    }
  }

  destroy() {
    this.scrollLayer.removeEventListener("scroll", this.eventListener)
    this.eventListener = null
    this.scrollLayer = null
    this.elem = null
  }
}

export {
  scrollIntoView,
  getScrollTop,
  scrollByAnimated,
  clearAnimationQueue,
  animationQueue,
  easing,
  ScrollDetector,
}

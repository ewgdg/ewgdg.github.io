/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import BezierEasing from "bezier-easing"
import { TweenLite, Power2 } from "gsap"
import ScrollToPlugin from "gsap/ScrollToPlugin"
// import { getController } from "../plugins/scrollmagic"
import throttle from "./throttle"

// prevent tree shaking
// eslint-disable-next-line no-unused-vars
const plugins = [ScrollToPlugin]

const easeInOut2 = BezierEasing(0.65, 0.1, 0.35, 0.99)
// const easeInOut = BezierEasing(0.42, 0, 0.58, 1)
// const ease = BezierEasing(0.25, 0.1, 0.25, 1)
// const easeOut = BezierEasing(0, 0, 0.58, 1)
// const linear = BezierEasing(0, 0, 1, 1)
// const easeOutCubic = BezierEasing(0.215, 0.61, 0.355, 1)
// const easeOutExpo = BezierEasing(0.19, 1, 0.22, 1)
// const easeOutBow = BezierEasing(0, 0.66, 0, 0.99)
const easing = {
  easeInOut2,
  // easeInOut,
  // ease,
  // easeOut,
  // linear,
  // easeOutCubic,
  // easeOutExpo,
  // easeOutBow,
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

/* detect scroll for elem might dynamically change pos 
duration	
The duration of the scene.


offset	
Offset Value for the Trigger Position. If no triggerElement is defined this will be the scroll distance from the start of the page, after which the scene will start.

triggerElement
DOM object that defines the start of the scene. If undefined the scene will start right at the start of the page (unless an offset is set).

triggerHook	
Can be a number between 0 and 1 defining the position of the trigger Hook in relation to the viewport.
a trigger hook triggers callback when reach trigger elem
*/
class ScrollDetector {
  constructor({
    scrollLayer,
    triggerElement,
    triggerHook = 0,
    duration = 0,
    throttleLimit = 30,
    offset = 0,
  }) {
    this.scrollLayer = scrollLayer
    this.triggerHook = triggerHook
    this.triggerElement = triggerElement
    this.duration = duration
    this.throttleLimit = throttleLimit
    this.offset = offset
    ScrollDetector.scrollDetectors.push(this)
  }

  setEventListener(callback) {
    if (this.eventListener) {
      this.scrollLayer.removeEventListener("scroll", this.eventListener)
    }
    this.eventListener =
      this.throttleLimit > 0
        ? throttle(
            this.eventListenerFactory(callback),
            this.throttleLimit,
            true
          )
        : this.eventListenerFactory(callback)
    this.scrollLayer.addEventListener("scroll", this.eventListener)
    // immediately update
    this.update()
  }

  update() {
    if (this.eventListener) this.eventListener()
  }

  updateDuration(newDuration) {
    this.duration = newDuration
    this.update()
  }

  eventListenerFactory(callback) {
    let lastProgress = 0

    return () => {
      if (!this.scrollLayer) return
      const pos = // relative pos of cur elem to viewport top
        (this.triggerElement
          ? this.triggerElement.getBoundingClientRect().top -
            this.scrollLayer.getBoundingClientRect().top // the scroll layer is the root container with scroll bar , most of time it is the viewport
          : -this.scrollLayer.scrollTop) + this.offset

      let progress = null
      // pos of trigger relative to viewport top
      const triggerPos = this.triggerHook * window.innerHeight

      if (this.duration > 0) {
        progress = -(pos - triggerPos)
        progress = Math.max(0, Math.min(this.duration, progress))
        progress /= this.duration
      } else if (pos - triggerPos < 0) {
        progress = 1
      } else if (pos - triggerPos >= 0) {
        progress = 0
      }

      if (progress !== lastProgress) {
        callback(progress)
      }
      lastProgress = progress
    }
  }

  destroy() {
    ScrollDetector.scrollDetectors = ScrollDetector.scrollDetectors.filter(
      e => !Object.is(e, this)
    )
    this.scrollLayer.removeEventListener("scroll", this.eventListener)
    this.eventListener = null
    this.scrollLayer = null
    this.triggerElement = null
  }
}
ScrollDetector.scrollDetectors = []
ScrollDetector.updateAll = () => {
  ScrollDetector.scrollDetectors.forEach(e => e.update())
}

const animationQueue = []

function sendScrollEvent(scrollLayer) {
  /* 
   manually trigger the scrollEvent before change scrollTop
   for scrollmagic to catch it.
   use controller.update() instead.
  */
  const scrollEvent = new Event("scroll", {
    bubbles: true,
    cancelable: false,
    composed: false,
  })
  scrollLayer.dispatchEvent(scrollEvent)
}
/* an raf implementation of scrolling function */
function legacyScrollByAnimated(elem, change, duration = 1000) {
  let startingTime
  let scrolledAmt = 0
  const targetAmt = Math.abs(change)
  const scale = change < 0 ? -1 : 1
  let requestId
  const easingFunc = easeInOut2
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
      const nextScrolledAmt =
        easingFunc(Math.min(1, elapsedDuration / duration)) * targetAmt

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
function scrollByAnimated(elem, change, duration = 1000) {
  let tween
  // const controller = getController(elem)
  const promise = new Promise(resolve => {
    // sendScrollEvent(elem)
    tween = TweenLite.to(elem, duration / 1000, {
      scrollTo: { y: `+=${change}` },
      onComplete: resolve,
      ease: Power2.easeInOut,
    }).eventCallback("onUpdate", () => {
      /* 
        manually trigger the scrollmagic update after changing scrollTop
        otherwise there might be a delay and 
        the delay will cause unstable behavior 
      */
      // controller.update(true)
      ScrollDetector.updateAll()
    })
  }).then(() => {
    animationQueue.shift().cancel()
  })

  const animation = {
    cancel: () => {
      tween.pause()
      tween.kill()
      tween = null
    },
  }
  animationQueue.push(animation)
  return promise
}

function clearAnimationQueue() {
  // console.log(animationQueue)
  animationQueue.forEach(animation => {
    animation.cancel()
  })
  animationQueue.splice(0)
}

function scrollIntoView(elem, scrollLayer, duration = 700) {
  if (!scrollLayer) return Promise.reject()
  /*
   * alternative way using legacy scrollByAnimated
   * const scrollTop = getScrollTop(scrollLayer)
   * const elemPosition = elem.offsetTop
   * const change = elemPosition - scrollTop
   * const change = (elem.getBoundingClientRect().top)
   * return legacyScrollByAnimated(scrollLayer, change, duration)
   */
  // const controller = getController(scrollLayer)
  return new Promise(resolve => {
    // sendScrollEvent(scrollLayer)
    TweenLite.to(scrollLayer, duration / 1000, {
      scrollTo: elem,
      onComplete: resolve,
      ease: Power2.easeInOut,
    }).eventCallback("onUpdate", () => {
      /* 
        manually trigger the scrollmagic update after changing scrollTop
        otherwise there might be a delay and 
        the delay will cause unstable behavior 
      */
      // controller.update(true)
      ScrollDetector.updateAll()
    })
  })
}

export {
  scrollIntoView,
  getScrollTop,
  scrollByAnimated,
  clearAnimationQueue,
  animationQueue,
  easing,
  ScrollDetector,
  legacyScrollByAnimated,
}

import React, {
  useMemo,
  useRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useContext,
} from "react"
import PropTypes from "prop-types"
import { makeStyles } from "@material-ui/styles"
import {
  isAnyInViewport,
  isAboveViewportBottom,
  isBelowViewportTop,
} from "../../utilities/isInViewport"
import {
  scrollIntoView,
  scrollByAnimated,
  clearAnimationQueue,
  animationQueue,
  easing,
} from "../../utilities/scroll"
import LayoutContext from "../../contexts/LayoutContext"

const useStyles = makeStyles({
  root: {
    // background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    border: 0,
    borderRadius: 3,
    // boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    // color: "white",
    // "touch-action": "pan-x pinch-zoom",
  },
})
const useHandlers = (ref, activeSections, context) => {
  // create dom event handler, same as useCallback( function factory(param)(args) )
  return useMemo(() => {
    let isScrolling = false
    let isZooming = false

    const touchPointYList = []
    const touchPointTimeStamp = []
    const touchEventList = []
    let isPointerDown = false
    let touchEventStart
    let touchStartX
    let touchStartY
    let touchEndX
    let touchEndY
    let fallbackOnLastCall = false
    const lastFallbackCall = 0
    function preventDefault(e) {
      if (e.cancelable || !e.isCustomEvent) {
        // e.preventDefault()
        // stop propagate to scroll layer so that custom handler can take control of scrolling
        // do not use preventDefault so that broswer can support other default behaviour like click
        e.stopPropagation()
      }
    }
    function scrollPage(
      direction,
      event,
      delta,
      scrollLayer = context.scrollLayer,
      easingFunc
    ) {
      if (isScrolling) {
        preventDefault(event)
        return
      }

      let useFallback = false
      let activeSecRef = null

      // ignore the scroll event if the container is not in viewport
      if (!ref.current || !isAnyInViewport(ref.current)) {
        useFallback = true
      } else if (activeSections.current.length <= 0) {
        useFallback = true
      } else {
        // eslint-disable-next-line prefer-destructuring
        activeSecRef = activeSections.current[0]
        if (!activeSecRef || !activeSecRef.current) {
          useFallback = true
        }
      }

      let target = null
      let scale = 0

      if (direction === "up") {
        // scrolling up
        scale = -1
        if (!useFallback) {
          if (isAboveViewportBottom(activeSecRef.current)) {
            target = activeSecRef
          } else {
            target = activeSecRef.prev
          }
        }
      } else if (direction === "down") {
        // scrolling down
        scale = 1
        if (!useFallback) {
          if (isBelowViewportTop(activeSecRef.current)) {
            target = activeSecRef
          } else {
            target = activeSecRef.next
          }
        }
      } else {
        return
      }

      if (!useFallback && target) {
        if (!isScrolling) clearAnimationQueue()
        // if (fallbackOnLastCall && Date.now() - lastFallbackCall < 200) {
        //   return
        // }
        if (delta && Math.abs(delta) < 2) {
          return
        }
        fallbackOnLastCall = false
        target = target.current

        isScrolling = true
        // event.preventDefault()
        // // event.stopPropagation()
        preventDefault(event)
        event.preventDefault()
        const promise = scrollIntoView(target, scrollLayer, 777, undefined)
        promise.then(() => {
          isScrolling = false
        })
        // scrollLayer.scrollTo(0, target.offsetTop)
        // scrollLayer.scrollTo(0, 0)
        // console.log(target.offsetTop)
      } else {
        // console.log(event)
        // // if (delta === 0) {
        // // touch event
        // const touchstartEvent = touchEventStart
        // const startTime = touchPointTimeStamp[0]
        // const customStartEvent = new TouchEvent("touchstart", touchstartEvent)
        // // customEvent.type = "touchstart"
        // customStartEvent.isCustomEvent = true
        // setTimeout(scrollLayer.dispatchEvent(customStartEvent), 0)
        // for (let i = 0; i < touchEventList.length; i += 1) {
        //   const customMoveEvent = new TouchEvent("touchmove", touchEventList[i])
        //   customMoveEvent.isCustomEvent = true
        //   const delay = touchPointTimeStamp[i] - startTime
        //   setTimeout(scrollLayer.dispatchEvent(customMoveEvent), delay)
        // }
        // const customEndEvent = new TouchEvent("touchend", event)
        // customEndEvent.isCustomEvent = true
        // setTimeout(
        //   scrollLayer.dispatchEvent(customEndEvent),
        //   Date.now() - startTime
        // )
        // // }
        // fallbackOnLastCall = true
        // lastFallbackCall = Date.now()
        // let value = delta
        // if (!delta) {
        //   value = 100 * scale
        // }
        // // event.preventDefault()
        // preventDefault(event)
        // // event.stopPropagation()
        // if (Math.abs(value) >= 100)
        //   scrollByAnimated(
        //     scrollLayer,
        //     value,
        //     Math.sqrt(Math.abs(value) / 100) * 333
        //   )
      }
    }

    // return a function as memo
    const wheelHandler = e => {
      if (isZooming) {
        return
      }
      const delta = e.deltaY

      if (delta < 0) {
        // scrolling up
        scrollPage("up", e, delta)
      } else if (delta > 0) {
        // scrolling down
        scrollPage("down", e, delta)
      }
    }

    function pointerDownHandler(e) {
      // console.log(e)
      isPointerDown = true

      touchPointYList.splice(0)
      touchPointTimeStamp.splice(0)
      touchEventList.splice(0)
      if (isScrolling) {
        preventDefault(e)
        return
      }
      // const touchList = e.changedTouches
      // if (touchList.length > 1) {
      //   touchPointYList.splice(0)
      //   touchPointTimeStamp.splice(0)
      //   touchEventList.splice(0)
      //   return
      // }
      // e.preventDefault()
      // e.stopPropagation()
      preventDefault(e)
      clearAnimationQueue()
      const touchPoint = e
      touchStartY = touchPoint.clientY
      touchEventStart = e
      touchPointYList.push(touchPoint.clientY)
      touchPointTimeStamp.push(performance.now())
      // touchEventList.push(e)
      // while (touchPointYList.length > 5) {
      //   touchPointYList.unshift()
      //   touchPointTimeStamp.unshift()
      //   touchEventList.unshift()
      // }
    }
    function pointerMoveHandler(e) {
      if (!isPointerDown) {
        return
      }

      if (isScrolling) {
        preventDefault(e)
        e.preventDefault()
        return
      }
      // console.log("move")
      // const touchList = e.changedTouches
      // if (touchList.length > 1) {
      //   console.log("wrong")
      //   touchPointYList.splice(0)
      //   touchPointTimeStamp.splice(0)
      //   touchEventList.splice(0)
      //   return
      // }
      preventDefault(e)
      e.preventDefault()
      const touchPoint = e

      let verticalMove = 0
      if (touchPointYList.length > 0) {
        verticalMove =
          touchPoint.clientY - touchPointYList[touchPointYList.length - 1]
      }
      touchPointYList.push(touchPoint.clientY)
      touchPointTimeStamp.push(performance.now())

      while (touchPointYList.length > 5) {
        touchPointYList.shift()
        touchPointTimeStamp.shift()
        // touchEventList.shift()
      }

      if (Math.abs(verticalMove) > 0) {
        scrollByAnimated(
          context.scrollLayer,
          -verticalMove,
          1,
          easing.easeOutExpo
        )
      }
    }
    function pointerUpHandler(e) {
      // console.log("up")
      // console.log(isPointerDown)
      if (!isPointerDown) return
      isPointerDown = false

      if (isScrolling || touchPointYList.length <= 0) {
        preventDefault(e)
        return
      }
      // const touchList = e.changedTouches
      // if (touchList.length > 1) return
      preventDefault(e)

      if (touchPointYList.length <= 0) {
        return
      }

      // e.stopPropagation()
      const touchPoint = e
      // touchEndX = touchPoint.clientX
      touchEndY = touchPoint.clientY

      const verticalMove = touchEndY - touchPointYList[0]
      let idlingTime = performance.now() // - touchPointTimeStamp[touchPointTimeStamp.length - 1]

      for (let i = touchPointYList.length - 1; i >= 0; i -= 1) {
        if (Math.abs(touchEndY - touchPointYList[i]) >= 2 || i === 0) {
          idlingTime -= touchPointTimeStamp[i]
          break
        }
      }

      let ready = true
      // discard subtle motion
      if (idlingTime > 500 || Math.abs(verticalMove) <= 2) {
        ready = false
      }
      if (ready && verticalMove > 0) {
        // verticalSpeed = Math.max(0, verticalSpeed - 125)
        scrollPage("up", e, 0, undefined, easing.easeOutCubic)
      } else if (ready && verticalMove < 0) {
        // verticalSpeed = Math.max(0, verticalSpeed - 125)
        scrollPage("down", e, 0, undefined, easing.easeOutCubic)
      }
      // touchPointYList.splice(0)
      // touchPointTimeStamp.splice(0)
      // touchEventList.splice(0)
    }

    function pointerCancelHandler(e) {
      if (!isPointerDown) return
      // console.log("cancel")
      touchPointYList.splice(0)
      isPointerDown = false
      // console.log(isPointerDown)
      preventDefault(e)
      e.preventDefault()
    }
    function keyDownHandler(e) {
      if (e.key === "Control") {
        // ctrl key is pressed
        isZooming = true
      } else if (e.key === "ArrowUp") {
        scrollPage("up", e, undefined, easing.easeOutCubic)
      } else if (e.key === "ArrowDown") {
        scrollPage("down", e, undefined, easing.easeOutCubic)
      }
    }
    function keyUpHandler(e) {
      if (e.key === "Control") {
        // ctrl key is released
        isZooming = false
      }
    }
    return [
      wheelHandler,
      keyUpHandler,
      keyDownHandler,
      pointerDownHandler,
      pointerMoveHandler,
      pointerUpHandler,
      pointerCancelHandler,
    ]
  }, [ref, activeSections, context])
}
function Container({ children }) {
  /* 
    avoid adding more children once the containder is instantiated,
    otherwise the list of childrenRefs will be updated and the data of previous state is removed,
    the active sections will be lost.
  */

  const classes = useStyles()

  // get or create references for child nodes
  const childrenRefs = useMemo(() => {
    // createRef return an obj that is not extensible, so I need to copy it
    const list = React.Children.map(children, () => ({
      ...React.createRef(null),
    }))
    const n = list.length
    for (let i = 0; i < n; i += 1) {
      if (i < n - 1) {
        list[i].next = list[i + 1]
      } else {
        list[i].next = null
      }
      if (i > 0) {
        list[i].prev = list[i - 1]
      } else {
        list[i].prev = null
      }
    }
    return list
  }, [React.Children.count(children)])

  const activeSections = useMemo(() => {
    return { current: [] }
  }, [childrenRefs])

  const addActiveSection = useCallback(
    sectionRef => {
      activeSections.current.unshift(sectionRef)
    },
    [activeSections]
  )
  const removeActiveSection = useCallback(
    sectionRef => {
      activeSections.current = activeSections.current.filter(
        elem => !Object.is(sectionRef, elem)
      )
    },
    [activeSections]
  )

  // clone children to add props
  const clonedChildren = useMemo(() => {
    const res = []
    const childrenArray = React.Children.toArray(children)
    for (let i = 0; i < childrenArray.length; i += 1) {
      res.push(
        React.cloneElement(childrenArray[i], {
          forwardedRef: childrenRefs[i],
          addActiveSection,
          removeActiveSection,
        })
      )
    }
    return res
  }, [children])

  // create ref for container
  const ref = useRef(null)

  const context = useContext(LayoutContext)

  const [
    wheelHander,
    keyUpHandler,
    keyDownHandler,
    pointerDownHandler,
    pointerMoveHandler,
    pointerUpHandler,
    pointerCancelHandler,
  ] = useHandlers(ref, activeSections, context)

  // add dom event listener
  useEffect(() => {
    const { scrollLayer } = context
    ref.current.addEventListener("wheel", wheelHander, { passive: false })
    scrollLayer.addEventListener("keydown", keyDownHandler)
    scrollLayer.addEventListener("keyup", keyUpHandler)

    ref.current.addEventListener("pointerdown", pointerDownHandler, {
      passive: false,
    })
    scrollLayer.addEventListener("pointermove", pointerMoveHandler, {
      passive: false,
    })
    scrollLayer.addEventListener("pointerup", pointerUpHandler, {
      passive: false,
    })
    scrollLayer.addEventListener("pointerleave", pointerCancelHandler, {
      passive: false,
    })

    // console.log(document.querySelector("button#tester"))
    // document
    //   .querySelector("button#tester")
    //   .addEventListener("touchstart", e => {
    //     console.log("touch button")
    //     console.log(e)
    //     // e.stopPropagation()
    //   })
    return () => {
      ref.current.removeEventListener("wheel", wheelHander)
      scrollLayer.removeEventListener("keydown", keyDownHandler)
      scrollLayer.removeEventListener("keyup", keyUpHandler)
      ref.current.removeEventListener("pointerdown", pointerDownHandler)
      scrollLayer.removeEventListener("pointermove", pointerMoveHandler)
      scrollLayer.removeEventListener("pointerup", pointerUpHandler)
      scrollLayer.removeEventListener("pointerleave", pointerCancelHandler)
    }
  }, [wheelHander, keyUpHandler, keyDownHandler, ref.current, context])

  return (
    <div className={classes.root} ref={ref} id="pageContainer">
      {/* <button type="button" id="tester">
        tester
      </button> */}
      {clonedChildren}
    </div>
  )
}

Container.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Container

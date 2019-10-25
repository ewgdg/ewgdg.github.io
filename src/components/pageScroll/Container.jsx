import React, { useMemo, useRef, useEffect, useContext } from "react"
import PropTypes from "prop-types"
import { makeStyles } from "@material-ui/styles"
import {
  isAnyInViewport,
  isAboveViewportBottom,
  isBelowViewportTop,
} from "../../utils/isInViewport"
import {
  scrollIntoView,
  scrollByAnimated,
  clearAnimationQueue,
} from "../../utils/scroll"
import LayoutContext from "../../contexts/LayoutContext"

const useStyles = makeStyles({
  root: {
    border: 0,
    borderRadius: 3,
  },
})
const useHandlers = (ref, childrenRefs, context) => {
  // create dom event handler, same as useCallback( function factory(param)(args) )
  return useMemo(() => {
    let isScrolling = false
    let isZooming = false

    const touchPointYList = []
    const touchPointTimeStamp = []
    let isPointerDown = false

    function preventDefault(e) {
      if (e.cancelable || !e.isCustomEvent) {
        // e.preventDefault()
        // stop propagate to scroll layer so that custom handler can take control of scrolling
        // do not use preventDefault so that broswer can support other default behaviour like click
        e.stopPropagation()
      }
    }
    function scrollPage(direction, event, scrollLayer = context.scrollLayer) {
      if (isScrolling) {
        preventDefault(event)
        event.preventDefault()
        return
      }

      let useFallback = false
      let activeSecRef = null

      // ignore the scroll event if the container is not in viewport
      if (!ref.current || !isAnyInViewport(ref.current)) {
        useFallback = true
      } else {
        // find current active section that is in viewport
        const size = childrenRefs.length
        let i0
        let step
        if (direction === "up") {
          i0 = 0
          step = 1
        } else if (direction === "down") {
          i0 = size - 1
          step = -1
        }
        for (let i = i0; i < size && i >= 0; i += step) {
          const childRef = childrenRefs[i]
          const elem = childRef.current
          if (isAnyInViewport(elem, 5)) {
            activeSecRef = childRef
            break
          }
        }
        if (!activeSecRef || !activeSecRef.current) {
          useFallback = true
        }
      }

      let target = null

      if (direction === "up") {
        // scrolling up

        if (!useFallback) {
          if (isAboveViewportBottom(activeSecRef.current)) {
            target = activeSecRef
          } else {
            target = activeSecRef.prev
          }
        }
      } else if (direction === "down") {
        // scrolling down

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

        target = target.current

        isScrolling = true

        preventDefault(event)
        event.preventDefault()
        const promise = scrollIntoView(target, scrollLayer, 777)
        promise.then(() => {
          isScrolling = false
        })
      }
    }

    // return a function as memo
    const wheelHandler = e => {
      if (isZooming) {
        return
      }
      const delta = e.deltaY
      if (Math.abs(delta) <= 2) {
        return
      }
      if (delta < 0) {
        // scrolling up

        scrollPage("up", e)
      } else if (delta > 0) {
        // scrolling down
        scrollPage("down", e)
      }
    }

    function isClickable(elem) {
      const { tagName } = elem
      return (
        tagName === "INPUT" ||
        tagName === "BUTTON" ||
        tagName === "A" ||
        tagName === "TEXTAREA" ||
        tagName === "AREA" ||
        tagName === "SELECT" ||
        elem.hasAttribute("clickable")
      )
    }
    function pointerDownHandler(e) {
      // check event path, if found clickable, ignore this pointer move

      let elem = e.target || e.srcElement
      let test = false
      while (elem) {
        test = isClickable(elem)
        if (test) break
        elem = elem.parentElement
      }

      if (test) {
        return
      }
      isPointerDown = true

      touchPointYList.splice(0)
      touchPointTimeStamp.splice(0)

      if (isScrolling) {
        preventDefault(e)
        return
      }

      preventDefault(e)
      clearAnimationQueue()
      const touchPoint = e

      touchPointYList.push(touchPoint.clientY)
      touchPointTimeStamp.push(performance.now())
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

      preventDefault(e)
      // e.preventDefault()
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
      }

      if (Math.abs(verticalMove) > 0) {
        scrollByAnimated(context.scrollLayer, -verticalMove, 1)
      }
    }
    function pointerUpHandler(e) {
      if (!isPointerDown) return
      isPointerDown = false

      if (isScrolling || touchPointYList.length <= 0) {
        preventDefault(e)
        e.preventDefault()
        return
      }

      preventDefault(e)

      if (touchPointYList.length <= 0) {
        return
      }

      const touchPoint = e

      const touchEndY = touchPoint.clientY

      const verticalMove = touchEndY - touchPointYList[0]
      let idlingTime = performance.now()

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
        scrollPage("up", e)
      } else if (ready && verticalMove < 0) {
        scrollPage("down", e)
      }
    }

    function pointerCancelHandler(e) {
      if (!isPointerDown) return

      touchPointYList.splice(0)
      touchPointTimeStamp.splice(0)
      isPointerDown = false

      preventDefault(e)
      e.preventDefault()
    }
    function keyDownHandler(e) {
      if (e.key === "Control") {
        // ctrl key is pressed
        isZooming = true
      } else if (e.key === "ArrowUp") {
        scrollPage("up", e)
      } else if (e.key === "ArrowDown") {
        scrollPage("down", e)
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
  }, [ref, context, childrenRefs])
}

// a container component whose children should be of type Section
function Container({ children }) {
  const classes = useStyles()

  // get or create references for child nodes
  const childrenRefs = useMemo(() => {
    // createRef return an obj that is not extensible, so I need to copy it
    const list = React.Children.map(children, () => ({
      ...React.createRef(null),
    }))
    const n = list.length
    // build a linked list
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

  // clone children to add props
  const clonedChildren = useMemo(() => {
    const res = []
    const childrenArray = React.Children.toArray(children)
    for (let i = 0; i < childrenArray.length; i += 1) {
      res.push(
        React.cloneElement(childrenArray[i], {
          forwardedRef: childrenRefs[i],
        })
      )
    }
    return res
  }, [children, childrenRefs])

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
  ] = useHandlers(ref, childrenRefs, context)

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
      {clonedChildren}
    </div>
  )
}

Container.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Container

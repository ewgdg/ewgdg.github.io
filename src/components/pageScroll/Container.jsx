import React, { useMemo, useRef, useEffect, useContext, useState } from "react"
import PropTypes from "prop-types"
import { makeStyles } from "@material-ui/styles"
import {
  isAnyInViewport,
  // isAboveViewportBottom,
  // isBelowViewportTop,
  isBottomInViewport,
  isTopInViewport,
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

const SectionTypes = {
  ShortSection: "SHORT",
  LongSection: "LONG",
}

// The scroll event cannot be canceled or interrupted, so use mouse, touch and button events instead.
const getHandlers = (ref, childrenRefs, context, sectionType) => {
  // create dom event handler, same as useCallback( function factory(param)(args) ) //no need useMemo if it is inside useEffect
  return (() => {
    let isScrolling = false
    let isZooming = false

    const touchPointYList = []
    const touchPointTimeStamp = []
    let isPointerDown = false

    function preventDefault(e) {
      if (e.cancelable || !e.isCustomEvent) {
        // e.preventDefault()
        // stop propagate to scroll layer so that custom handler can take control of scrolling
        // do not use preventDefault so that browser can support other default behaviour like click
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
      let isInViewPortTest
      let scrollOffsetY = 0
      const marginForViewPortTest = Math.max(
        Math.min(
          (window.innerHeight || document.documentElement.clientWidth) * 0.01,
          5
        ),
        1
      )
      if (sectionType === SectionTypes.LongSection) {
        if (direction === "up") {
          isInViewPortTest = elem =>
            isTopInViewport(elem, -marginForViewPortTest, marginForViewPortTest)
        } else {
          isInViewPortTest = elem =>
            isBottomInViewport(
              elem,
              marginForViewPortTest,
              -marginForViewPortTest
            )
        }
      } else {
        isInViewPortTest = elem => isAnyInViewport(elem, marginForViewPortTest)
      }

      // ignore the scroll event if the container is not in viewport
      if (!ref.current || !isAnyInViewport(ref.current)) {
        useFallback = true
      } else {
        // find the first active section that is in viewport
        const size = childrenRefs.length
        let i0
        let step
        if (direction === "up") {
          i0 = size - 1
          step = -1
        } else if (direction === "down") {
          i0 = 0
          step = 1
        }
        for (let i = i0; i < size && i >= 0; i += step) {
          const childRef = childrenRefs[i]
          const elem = childRef.current

          if (isInViewPortTest(elem)) {
            activeSecRef = childRef
            break
          }
          // todo: early termination check or binary search
        }
        if (!activeSecRef || !activeSecRef.current) {
          useFallback = true
        }
      }

      let target = null

      if (direction === "up") {
        // scrolling up
        if (!useFallback) {
          if (activeSecRef.prev && activeSecRef.prev.current) {
            target = activeSecRef.prev
            if (sectionType === SectionTypes.LongSection) {
              // scroll to the bottom of prev section
              scrollOffsetY = -(
                target.current.offsetHeight -
                (window.innerHeight || document.documentElement.clientWidth)
              )
            }
          } else {
            target = activeSecRef
          }
        }
      } else if (direction === "down") {
        // scrolling down
        if (!useFallback) {
          if (activeSecRef.next && activeSecRef.next.current) {
            target = activeSecRef.next
          } else {
            target = activeSecRef
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
        const promise = scrollIntoView(target, scrollLayer, 777, scrollOffsetY)
        promise.then(() => {
          isScrolling = false
        })
      }
    }

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
  })()
}

// a container component whose children should be of type Section
function Container({ children, sectionType = SectionTypes.ShortSection }) {
  const classes = useStyles()

  // get or create references for child nodes
  // my first try is to useMemo + createRef but perf is unstable, might be slow
  // 1st alternative way is useState+useEffect(set refs to match count), since useEffect exec func after layout and paint, it will render this comp twice, the second render is triggered by setState within useEffect and
  // 2nd another way is to introduce side effect outside useEffect + useRef([]), but might be a bad practice from stackoverflow. use if statement to check if we should update the side effect.
  // if( change/size mismatch ) { update refs = Array(len).fill().map((_,i)=>{ refs[i]||createRef()  }) }, might not be a bad manner, this is effectively the beforeMount hook.
  // third way is to use weakMap/array within useRef + callbackRef , <Item ref={(elem)=>map.set(item or index ,elem)}> , notice js array is a set of key-value paris and auto expand itself
  // downside is not able to shrink size if nodes are deleted
  // 4th combine 2nd and 3rd method: ////equivalent to 2nd method seems to me
  // useRef([]) + callbackRef + useEffect to shrink

  // verdict:
  // useState+callbackRef for ref which need to attach listener to be the safest way
  // children refs, however, is for user interaction so useRef+useEffect/useBeforeMountEffect should be enough

  const count = React.Children.count(children)
  const childrenRefs = useRef([])

  useEffect(() => {
    if (childrenRefs.current.length !== count) {
      // shrink size
      childrenRefs.current = childrenRefs.current.slice(0, count)
    }
    const list = childrenRefs.current
    // link nodes
    for (let i = 0; i < list.length; i += 1) {
      const currentChildRef = list[i]
      if (i < count - 1) {
        currentChildRef.next = list[i + 1]
      } else {
        currentChildRef.next = null
      }
      if (i > 0) {
        currentChildRef.prev = list[i - 1]
      } else {
        currentChildRef.prev = null
      }
    }
    // return () => {}
  }, [count])

  // const childrenRefs = useMemo(() => {
  //   // createRef return an obj that is not extensible, so I need to copy it
  //   const list = React.Children.map(children, () => ({
  //     ...React.createRef(null),
  //   }))
  //   const n = list.length
  //   // build a linked list
  //   for (let i = 0; i < n; i += 1) {
  //     if (i < n - 1) {
  //       list[i].next = list[i + 1]
  //     } else {
  //       list[i].next = null
  //     }
  //     if (i > 0) {
  //       list[i].prev = list[i - 1]
  //     } else {
  //       list[i].prev = null
  //     }
  //   }
  //   return list
  // }, [React.Children.count(children)])

  // clone children to add props
  const clonedChildren = useMemo(() => {
    // const res = []
    // const childrenArray = React.Children.toArray(children)
    // for (let i = 0; i < childrenArray.length; i += 1) {
    //   res.push(
    //     React.cloneElement(childrenArray[i], {
    //       // another way is to use forwardRef HOC(child) + ref
    //       forwardedRef: elem => {
    //         childrenRefs[i] = elem
    //       },
    //     })
    //   )
    // }
    const res = React.Children.map(children, (child, index) => {
      return React.cloneElement(child, {
        forwardedRef: elem => {
          childrenRefs.current[index] = childrenRefs.current[index] || {
            // createRef return an obj that is not extensible, so I need to copy it
            ...React.createRef(),
          }

          childrenRefs.current[index].current = elem
        },
      })
    })

    return res
  }, [children, childrenRefs.current])

  // create ref for container
  const [ref, setRef] = useState({
    current: null,
  })

  const setRefCallback = useRef(null)
  if (setRefCallback.current === null) {
    // need bounded callback to prevent trigger setRef every render
    setRefCallback.current = elem => {
      if (elem !== ref.current) setRef({ current: elem })
    }
  }

  const context = useContext(LayoutContext)

  // add dom event listener
  useEffect(() => {
    if (!ref.current) return () => {}

    const [
      wheelHandler,
      keyUpHandler,
      keyDownHandler,
      pointerDownHandler,
      pointerMoveHandler,
      pointerUpHandler,
      pointerCancelHandler,
    ] = getHandlers(ref, childrenRefs.current, context, sectionType)
    const { scrollLayer } = context
    ref.current.addEventListener("wheel", wheelHandler, { passive: false })
    // console.log(ref.current.getEventListener("wheel"))
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
      ref.current.removeEventListener("wheel", wheelHandler)
      scrollLayer.removeEventListener("keydown", keyDownHandler)
      scrollLayer.removeEventListener("keyup", keyUpHandler)
      ref.current.removeEventListener("pointerdown", pointerDownHandler)
      scrollLayer.removeEventListener("pointermove", pointerMoveHandler)
      scrollLayer.removeEventListener("pointerup", pointerUpHandler)
      scrollLayer.removeEventListener("pointerleave", pointerCancelHandler)
      return null
    }
  }, [ref.current, context, children, childrenRefs.current])

  return (
    <div
      className={classes.root}
      ref={setRefCallback.current}
      id="pageContainer"
    >
      {clonedChildren}
    </div>
  )
}

Container.propTypes = {
  children: PropTypes.node.isRequired,
  sectionType: PropTypes.string,
}
Container.defaultProps = {
  sectionType: SectionTypes.ShortSection,
}

export default React.memo(Container)
export { SectionTypes }

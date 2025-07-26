import { useCallback, useLayoutEffect, useRef } from "react"
import { useRestoreComponentStateToBeforeRouting } from "./useRestoreComponentState"
import useLayoutContext from "./useLayoutContext"

function useRestoreScrollTop(path, hash) {
  const scrollPath = [...path, "scroll"]
  const context = useLayoutContext()
  const { scrollLayer } = context
  const getCurrentState = useCallback(() => {
    return {
      scroll_percent:
        scrollLayer.scrollTop / scrollLayer.scrollHeight,
    }
  }, [scrollLayer])

  // use before-routing instead of unmounting to avoid reading scroll position of 0 during unmounting
  const historyState = useRestoreComponentStateToBeforeRouting(scrollPath, getCurrentState)
  // restore to history state
  useLayoutEffect(() => {
    let scrollTop = 0
    let target = null
    if (hash) target = document.querySelector(hash)

    if (target) {
      scrollTop = target.offsetTop
    } else if (historyState) {
      scrollTop = historyState.scroll_percent * scrollLayer.scrollHeight
    }
    scrollLayer.scrollTop = scrollTop
  }, [hash, historyState, scrollLayer])
}

export default useRestoreScrollTop

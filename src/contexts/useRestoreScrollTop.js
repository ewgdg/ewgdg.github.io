import { useCallback, useLayoutEffect } from "react"
import { useRestoreComponentStateToBeforeRouting } from "./useRestoreComponentState"
import useLayoutContext from "./useLayoutContext"

export default function(path, hash) {
  path = [...path, "scroll"]
  const context = useLayoutContext()
  const getCurrentState = useCallback(() => {
    return {
      scroll_percent:
        context.scrollLayer.scrollTop / context.scrollLayer.scrollHeight,
    }
  }, [])

  // use before-routing instead of unmounting to avoid reading scroll position of 0 during unmounting
  const historyState = useRestoreComponentStateToBeforeRouting(path, getCurrentState)
  // restore to history state
  useLayoutEffect(() => {
    let scrollTop = 0
    let target = null
    if (hash) target = document.querySelector(hash)

    if (target) {
      scrollTop = target.offsetTop
    } else if (historyState) {
      scrollTop = historyState.scroll_percent * context.scrollLayer.scrollHeight
    }
    context.scrollLayer.scrollTop = scrollTop
  }, [path, hash])
}

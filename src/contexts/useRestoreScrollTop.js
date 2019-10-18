import { useCallback, useLayoutEffect } from "react"
import useRecordComponentState from "./useRestoreComponentState"
import useLayoutContext from "./useLayoutContext"

export default function(path, hash) {
  const context = useLayoutContext()
  const getCurrentState = useCallback(() => {
    return {
      scrollTop:
        context.scrollLayer.scrollTop / context.scrollLayer.scrollHeight,
    }
  }, [...path])

  const historyState = useRecordComponentState(path, getCurrentState)
  // restore to history state
  useLayoutEffect(() => {
    let scrollTop = 0
    let target = null
    if (hash) target = document.querySelector(hash)

    if (target) {
      scrollTop = target.offsetTop
    } else if (historyState) {
      scrollTop = historyState.scrollTop * context.scrollLayer.scrollHeight
    }
    context.scrollLayer.scrollTop = scrollTop
  }, [])
}

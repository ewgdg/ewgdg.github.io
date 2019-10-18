import { useCallback, useLayoutEffect } from "react"
import useRecordComponentState from "./useRestoreComponentState"
import useLayoutContext from "./useLayoutContext"

export default function(path) {
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
    if (historyState) {
      scrollTop = historyState.scrollTop
    }
    context.scrollLayer.scrollTop = scrollTop * context.scrollLayer.scrollHeight
  }, [])
}

import { useEffect, useRef } from "react"

import useLayoutContext from "./useLayoutContext"

// set value based on path arrary for deep nested obj
function setValue(obj, path, value) {
  if (path)
    path.reduce((accumulator, currentValue, index, arr) => {
      return Object.assign(accumulator, {
        [currentValue]:
          index === arr.length - 1 ? value : accumulator[currentValue] || {},
      })[currentValue]
    }, obj)
}
function getValue(obj, path) {
  if (path)
    return path.reduce((accumulator, currentValue) => {
      return typeof accumulator === "object" ? accumulator[currentValue] : null
    }, obj)
  return null
}
function deleteValue(obj, path) {
  const parent = getValue(obj, path.slice(0, -1))
  if (parent) delete parent[path[path.length - 1]]
}

function clearHistoryState(path, context) {
  deleteValue(context.historyState, path)
}
function useHistoryState(path) {
  const context = useLayoutContext()
  return getValue(context.historyState, path)
}

/* 
  custom hook to record page state between route change
*/
function useRestoreComponentState(path, getCurrentState) {
  const context = useLayoutContext()
  const oldPath = useRef([])
  useEffect(() => {
    const { historyState } = context
    // clear old history
    deleteValue(historyState, oldPath.current)
    oldPath.current = path
    // on component unmount
    return () => {
      setValue(historyState, path, getCurrentState())
    }
  }, [getCurrentState, path])
  return useHistoryState(path)
}

export { useHistoryState, clearHistoryState }
export default useRestoreComponentState

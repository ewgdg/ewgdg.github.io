import { useCallback, useEffect, useRef } from "react"

import useLayoutContext from "./use-layout-context"
import { ROUTER_EVENTS, useRouterEvents } from "@/lib/navigation/router"
import { get } from "http";

// set value based on path array for deep nested obj
function setValue(obj, path, value) {
  if (!path || path.length === 0) {
    return
  }
  path.reduce((accumulator, currentValue, index, arr) => {
    if (index === arr.length - 1) {
      accumulator[currentValue] = value;
      return accumulator[currentValue];
    } else {
      accumulator[currentValue] = accumulator[currentValue] || {};
      return accumulator[currentValue];
    }
  }, obj)
}

function getValue(obj, path) {
  if (!path) {
    return null
  }
  return path.reduce((accumulator, currentValue) => {
    return typeof accumulator === "object" ? accumulator[currentValue] : null
  }, obj)
}
function deleteValue(obj, path) {
  if (!path || path.length === 0) {
    return
  }
  const parent = getValue(obj, path.slice(0, -1))
  if (parent) delete parent[path[path.length - 1]]
}

function clearHistoryState(path, context) {
  deleteValue(context.historyState, path)
}
function useHistoryState(path, givenContext) {
  const defaultContext = useLayoutContext()
  const context = givenContext || defaultContext
  const { historyState } = context

  if (!path) {
    return null
  }

  return getValue(historyState, path)
}

/* 
  custom hook to record page state between route change
*/
function useRestoreComponentStateToBeforeUnmounting(path, getCurrentState) {
  const context = useLayoutContext()
  const oldPath = useRef([])

  useEffect(() => {
    if (!path) return

    // on component unmount
    return () => {
      const { historyState } = context
      // clear old history
      deleteValue(historyState, oldPath.current)
      oldPath.current = path
      const currentState = getCurrentState()
      setValue(historyState, path, currentState)
    }
  }, [getCurrentState, path, context])

  const res = useHistoryState(path, context)

  if (!path) {
    return null
  }

  return res
}

function useRestoreComponentStateToBeforeRouting(path, getCurrentState) {
  const context = useLayoutContext()
  const oldPath = useRef([])

  const saveState = useCallback(() => {
    if (!path) return

    const { historyState } = context
    // clear old history
    deleteValue(historyState, oldPath.current)
    oldPath.current = path
    const currentState = getCurrentState()
    setValue(historyState, path, currentState)
  }, [getCurrentState, path, context])

  useRouterEvents(ROUTER_EVENTS.BEFORE_NAVIGATION, saveState)

  const res = useHistoryState(path, context)

  if (!path) {
    return null
  }

  return res
}

// This function should not use hooks since it's not a React component or custom hook
function setComponentState(path, state, context) {
  if (!path || !context) {
    return null
  }
  setValue(context.historyState, path, state)
}

export { useHistoryState, clearHistoryState, setComponentState, useRestoreComponentStateToBeforeUnmounting, useRestoreComponentStateToBeforeRouting }
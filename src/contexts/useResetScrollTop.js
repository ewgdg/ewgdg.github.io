import { useLayoutEffect } from "react"
import useLayoutContext from "./useLayoutContext"

export default function() {
  const context = useLayoutContext()
  useLayoutEffect(() => {
    context.scrollLayer.scrollTop = 0
  }, [])
}

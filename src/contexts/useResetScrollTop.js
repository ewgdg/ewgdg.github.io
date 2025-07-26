import { useLayoutEffect } from "react"
import useLayoutContext from "./useLayoutContext"

function useResetScrollTop() {
  const { scrollLayer } = useLayoutContext()
  useLayoutEffect(() => {
    if (scrollLayer) {
      scrollLayer.scrollTop = 0
    }
  }, [scrollLayer])
}

export default useResetScrollTop

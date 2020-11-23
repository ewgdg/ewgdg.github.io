import { useState, useEffect } from "react"
import { ScrollDetector } from "../../utils/scroll"
import useLayoutContext from "../../contexts/useLayoutContext"

function useScrollTrigger({ threshold, scrollLayer }) {
  const [trigger, setTrigger] = useState(false)
  const defaultContext = useLayoutContext().scrollLayer
  // eslint-disable-next-line no-param-reassign
  scrollLayer = scrollLayer || defaultContext
  useEffect(() => {
    if (!scrollLayer) return () => {}
    const scene = new ScrollDetector({
      scrollLayer,
      triggerHook: 0,
      offset: threshold,
    })

    scene.setEventListener(progress => {
      if (progress > 0) {
        setTrigger(true)
      } else {
        setTrigger(false)
      }
    })

    return () => {
      scene.destroy()
      setTrigger(false)
    }
  }, [threshold, scrollLayer])
  return trigger
}

export default useScrollTrigger

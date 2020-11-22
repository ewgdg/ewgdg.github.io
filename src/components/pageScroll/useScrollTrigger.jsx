import { useState, useEffect } from "react"
import { ScrollDetector } from "../../utils/scroll"
import useLayoutContext from "../../contexts/useLayoutContext"

function useScrollTrigger({ threshold, scrollLayer }) {
  const [trigger, setTrigger] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line no-param-reassign
    if (!scrollLayer) scrollLayer = useLayoutContext().scrollLayer
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

export default function throttle(fn, limit, recordLastCall = false) {
  let lastTimeStamp = Date.now()
  let lastCall = null
  function throttled(...arg) {
    const currentTimeStamp = Date.now()
    const timePast = currentTimeStamp - lastTimeStamp
    if (timePast < limit) {
      if (!recordLastCall) {
        return
      }
      clearTimeout(lastCall)
      lastCall = setTimeout(() => {
        throttled.apply(null, [...arg])
      }, limit - timePast)
    } else {
      fn.apply(null, [...arg])
      lastTimeStamp = Date.now()
      lastCall = null
    }
  }
  return throttled
}

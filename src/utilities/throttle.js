export default function throttle(fn, limit, recordLastCall = false) {
  let lastTimeStamp = performance.now()
  let lastCall = null
  function throttled(...args) {
    const currentTimeStamp = performance.now()
    const elapsedTime = currentTimeStamp - lastTimeStamp
    if (elapsedTime < limit) {
      if (!recordLastCall) {
        return
      }
      // clearTimeout(lastCall)
      if (lastCall === null) {
        lastCall = setTimeout(() => {
          throttled(...args)
        }, limit - elapsedTime)
      }
    } else {
      lastTimeStamp = performance.now()
      fn(...args)
      clearTimeout(lastCall)
      lastCall = null
    }
  }
  return throttled
}

import React from "react"

const contextValueRef = { current: { scrollLayer: null, historyState: {} } }
const context = React.createContext(contextValueRef.current)
export default context
export { contextValueRef }

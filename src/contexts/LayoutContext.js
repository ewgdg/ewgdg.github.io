import React from "react"

const contextValueRef = { current: { scrollLayer: null, historyState: {},bulinZindex:3 } }
const context = React.createContext(contextValueRef.current)
export default context
export { contextValueRef }

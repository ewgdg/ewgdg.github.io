/* eslint-disable react/no-array-index-key */
/* eslint-disable react/prop-types */
/* eslint-disable no-param-reassign */
import React, { useEffect, useRef, useCallback } from "react"

// given a string return a list of chars for animation
function CharSequence({ string, charRefs, style, className }) {
  return (
    <>
      {Array.from(string).map((char, i) => (
        <span
          style={{ fontSize: "1em", ...style }}
          className={className}
          key={`${char}${i}`}
          ref={e => {
            charRefs.current[i] = e
          }}
        >
          {char}
        </span>
      ))}
    </>
  )
}

export default CharSequence

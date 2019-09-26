/* eslint-disable react/no-array-index-key */
/* eslint-disable react/prop-types */
/* eslint-disable no-param-reassign */
import React, { useEffect } from "react"

function CharSequence({ string, charRefs, style, className }) {
  useEffect(() => {
    charRefs.current.length = string.length
    return () => {
      charRefs.current = []
    }
  }, [string])
  return (
    <>
      {Array.from(string).map((char, i) => (
        <span
          style={{ fontSize: "1em", ...style }}
          className={className}
          key={`${char}${i}`}
          ref={elem => {
            charRefs.current[i] = elem
          }}
        >
          {char}
        </span>
      ))}
    </>
  )
}

export default CharSequence

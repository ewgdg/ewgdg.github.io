/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-one-expression-per-line */
import React from "react"
import Link from "../navigation/link"
// to parse the about.md text
// text in format : string {link text} string
function TextLink({ text, links, isInternal = true }) {
  const regEx = /{\w+}/g
  const matched = text.match(regEx)

  if (!matched) {
    return text
  }
  const splited = text.split(regEx)

  const res = []
  for (let i = 0; i < splited.length; i += 2) {
    res.push(splited[i])
    res.push(
      isInternal ? (
        <Link href={links[i / 2]} key={i / 2}>
          {matched[i / 2].replace(/({|})/g, "")}
        </Link>
      ) : (
        <a href={links[i / 2]} key={i / 2}>
          {matched[i / 2].replace(/({|})/g, "")}
        </a>
      )
    )
    res.push(splited[i + 1])
  }

  return <>{res}</>
}

export default TextLink

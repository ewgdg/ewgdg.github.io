/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-one-expression-per-line */
import React from "react"
import { Link } from "gatsby"

function TextLink({ text, links, isInternal = true }) {
  const regEx = /{\w+}/g
  const matched = text.match(regEx)

  if (!matched) {
    return text
  }
  const splited = text.split(regEx)

  const res = []
  const LinkCom = isInternal ? Link : "a"
  for (let i = 0; i < splited.length; i += 2) {
    res.push(splited[i])
    res.push(
      <LinkCom to={links[i / 2]}>
        {matched[i / 2].replace(/({|})/g, "")}
      </LinkCom>
    )
    res.push(splited[i + 1])
  }

  return <>{res}</>
}

export default TextLink

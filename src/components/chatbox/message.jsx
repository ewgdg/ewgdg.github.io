import React from "react"
import Paper from "@mui/material/Paper"
import Link from "@mui/material/Link"

const parseMessageWithLinks = (text) => {
  const urlRegex = /((?:https?:\/\/|\/)[^\s)]+)(?=[\s).!?]|$)/g
  const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
  
  const elements = []
  let lastIndex = 0
  
  // First, find all markdown links
  const markdownMatches = [...text.matchAll(markdownLinkRegex)].map(match => ({
    match: match[0],
    linkText: match[1],
    url: match[2],
    index: match.index,
    type: 'markdown'
  }))
  
  // Create a copy of text with markdown links temporarily replaced to avoid duplicate detection
  let textForUrlMatching = text
  markdownMatches.forEach(match => {
    textForUrlMatching = textForUrlMatching.replace(match.match, ' '.repeat(match.match.length))
  })
  
  // Then find standalone URLs (not within markdown links)
  const urlMatches = [...textForUrlMatching.matchAll(urlRegex)].map(match => ({
    match: text.slice(match.index, match.index + match[1].length),
    url: match[1],
    index: match.index,
    type: 'url'
  }))
  
  const matches = [...markdownMatches, ...urlMatches]
    .sort((a, b) => a.index - b.index)
  
  matches.forEach((match, index) => {
    if (lastIndex < match.index) {
      elements.push(text.slice(lastIndex, match.index))
    }
    
    if (match.type === 'markdown') {
      elements.push(
        <Link
          key={`link-${index}`}
          href={match.url}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            color: 'primary.main',
            textDecoration: 'underline',
            '&:hover': {
              textDecoration: 'underline',
            }
          }}
        >
          {match.linkText}
        </Link>
      )
    } else {
      elements.push(
        <Link
          key={`url-${index}`}
          href={match.url}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            color: 'primary.main',
            textDecoration: 'underline',
            '&:hover': {
              textDecoration: 'underline',
            }
          }}
        >
          {match.url}
        </Link>
      )
    }
    
    lastIndex = match.index + match.match.length
  })
  
  if (lastIndex < text.length) {
    elements.push(text.slice(lastIndex))
  }
  
  return elements.length > 1 ? <span>{elements}</span> : text
}

// eslint-disable-next-line react/prop-types
const Message = ({ children, color }) => {
  const processedChildren = typeof children === 'string' 
    ? parseMessageWithLinks(children) 
    : children
  return (
    <Paper
      variant="outlined"
      style={{
        width: "auto",
        backgroundColor: color || "white",
        display: "inline-flex",
        padding: "1px 0.5rem",
        margin: "1px",
        maxWidth: "80%",
        wordBreak: "break-word",
        overflowWrap: "break-word",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {processedChildren}
    </Paper>
  )
}

export default Message

/* eslint-disable react/jsx-props-no-spreading */
import React from "react"
import Jumbotron from "./Jumbotron"
import Header from "./Header"

interface JumbotronProps {
  image?: string
  headline?: string
  subtitle?: string
  darkFilter?: number
}

interface HeaderProps {
  color?: string
  position?: string
  display?: string
  chatbox?: boolean
}

interface HeaderContainerProps {
  jumbotronProps?: JumbotronProps
  headerProps?: HeaderProps
}

function HeaderContainer({ 
  jumbotronProps = { image: null }, 
  headerProps = { position: "absolute", color: "white" } 
}: HeaderContainerProps) {
  return (
    <div
      style={{
        position: "relative",
        minHeight: "3.5rem",
        marginBottom: "0rem",
      }}
    >
      <Header {...headerProps} />
      {jumbotronProps.image && <Jumbotron {...jumbotronProps} />}
    </div>
  )
}

export default HeaderContainer

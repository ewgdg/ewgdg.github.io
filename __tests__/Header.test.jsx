/* eslint-disable react/jsx-filename-extension */
import React from "react"
// import renderer from "react-test-renderer"
import { render, fireEvent } from "@testing-library/react"
// import { createRender } from "@material-ui/core/test-utils"
import Header from "../src/components/header/Header"

describe("Header", () => {
  test("renders correctly", () => {
    const tree = render(<Header position="absolute" />)
    expect(tree).toMatchSnapshot()
  })

  test("properly navigate upon click about link", () => {
    const { getByText } = render(<Header />)
    fireEvent.click(getByText(/about/i))
    expect(window.location.href).toBe("/about")
  })
})

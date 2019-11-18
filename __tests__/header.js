/* eslint-disable react/jsx-filename-extension */
import React from "react"
import renderer from "react-test-renderer"
import { render, fireEvent } from "@testing-library/react"
import Header from "../src/components/header/Header"

describe("Header", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<Header position="absolute" />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it("renders correctly with testing library", () => {
    const { getByText } = render(<Header />)
    fireEvent.click(getByText(/about/i))
    expect(window.location.href).toBe("/about")
  })
})

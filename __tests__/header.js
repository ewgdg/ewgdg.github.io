/* eslint-disable react/jsx-filename-extension */
import React from "react"
import renderer from "react-test-renderer"

import Header from "../src/components/header/Header"

describe("Header", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<Header position="absolute" />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})

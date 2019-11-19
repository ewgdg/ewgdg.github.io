import React from "react"
import { render } from "@testing-library/react"
import Footer from "../src/components/footer/Footer"

test("Footer renders correctly", () => {
  const { container } = render(<Footer />)
  expect(container.firstChild).toMatchSnapshot()
})

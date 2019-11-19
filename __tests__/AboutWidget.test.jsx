/* eslint-disable react/jsx-filename-extension */
import { render } from "@testing-library/react"
import React from "react"
import AboutWidget from "../src/components/widgets/AboutWidget"
import LayoutContext from "../src/contexts/LayoutContext"

const { useContext } = jest.requireActual("react")

describe("About Widget", () => {
  beforeAll(() => {
    // set context
    const { getByTestId } = render(<div data-testid="scrollLayer" />)
    React.useContext.mockImplementation(context => {
      if (Object.is(LayoutContext, context)) {
        return {
          scrollLayer: getByTestId("scrollLayer"),
        }
      }
      return useContext(context)
    })
  })

  it("render properly", () => {
    const { container } = render(<AboutWidget />)
    expect(container.firstChild).toMatchSnapshot()
  })
})

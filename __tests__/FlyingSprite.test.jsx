/* eslint-disable react/jsx-filename-extension */
import React from "react"
import { render, wait, act } from "@testing-library/react"
import { useStaticQuery } from "gatsby"
import FlyingSprite from "../src/components/sprite/FlyingSprite"

describe("Flying sprite", () => {
  useStaticQuery.mockReturnValue({ file: { publicURL: "/img/bulin.png" } })

  it("renders properly", () => {
    const { container } = render(<FlyingSprite />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it("changes position", async () => {
    const div = document.createElement("div")
    const { container, unmount } = render(<FlyingSprite />, {
      container: document.body.appendChild(div),
    })

    const elem = container.firstChild
    const prevTransform = elem.style.transform
    await act(async () => {
      await wait(() => {
        if (elem.style.display !== "none") {
          return null
        }
        throw new Error()
      })
    })
    unmount()
    expect(elem.style.transform).not.toBe(prevTransform)
  })
})

import React from "react"
import { render, getByTestId } from "@testing-library/react"
import { useStaticQuery } from "gatsby"
import PortfolioWidget from "../src/components/widgets/PortfolioWidget"
import LayoutContext from "../src/contexts/LayoutContext"

const { useContext } = jest.requireActual("react")
describe("PortfolioWidget", () => {
  beforeAll(() => {
    // fake post data
    useStaticQuery.mockReturnValue({
      allMarkdownRemark: {
        edges: [
          {
            post: {
              excerpt: "excerpt",
              id: "id",
              fields: {
                slug: "slug",
              },
              frontmatter: {
                title: "title",
                description: "description",
                templateKey: "templateKey",
                externalLink: "localhost",
                date: "OCT 09, 2009",
                tags: "tags",
                featuredPost: false,
                featuredImage: undefined,
              },
            },
          },
        ],
      },
    })

    // set context
    const div = document.createElement("div")
    document.body.appendChild(div)
    div.setAttribute("data-testid", "scrollLayer")
    // const { getByTestId } = render(<div data-testid="scrollLayer" />)
    React.useContext.mockImplementation(context => {
      if (Object.is(LayoutContext, context)) {
        return {
          scrollLayer: div,
        }
      }
      return useContext(context)
    })
  })
  it("should render properly", () => {
    const { container } = render(<PortfolioWidget />, {
      container: getByTestId(document.body, "scrollLayer"),
    })
    expect(container.firstChild).toMatchSnapshot()
  })
})

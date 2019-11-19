import React from "react"
import { render } from "@testing-library/react"
import { useStaticQuery } from "gatsby"
import BlogWidget from "../src/components/widgets/BlogWidget"

describe("BlogWidget", () => {
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
                externalLink: null,
                date: "SEPT 09, 1999",
                tags: "tags",
                featuredPost: false,
                featuredImage: {
                  childImageSharp: {
                    fluid: {
                      src: "/images/icon.png",
                    },
                  },
                },
              },
            },
          },
        ],
      },
    })
  })
  it("should render properly", () => {
    const { container } = render(<BlogWidget />)
    expect(container.firstChild).toMatchSnapshot()
  })
})

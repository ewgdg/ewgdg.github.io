const React = require('react')
const { act, render } = require('@testing-library/react')
const LayoutContext = require('../src/lib/contexts/layout-context').default
const { contextValueRef } = require('../src/lib/contexts/layout-context')
const { routerEventSource, ROUTER_EVENTS } = require('../src/lib/navigation/router')

jest.mock('next/navigation', () => ({
  useSearchParams: () => ({ get: () => null }),
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/blog',
}))
jest.mock('next/link', () => ({ href, scroll, replace, children, ...props }) =>
  React.createElement(
    'a',
    { ...props, href, 'data-next-scroll': String(scroll) },
    children
  )
)
jest.mock('../src/components/thumbnail/card-table', () => () => null)
jest.mock('../src/components/others/use-blog-post-cards', () => () => [])
jest.mock('../src/components/page-scroll/section', () => ({ children }) => React.createElement('div', null, children))
jest.mock('../src/components/page-scroll/container', () => () => null)
jest.mock('../src/components/header/header-container', () => () => null)
jest.mock('../src/components/footer/footer', () => () => null)
jest.mock('../src/components/sections/parallax-section', () => ({ children }) => React.createElement('div', null, children))
jest.mock('../src/lib/performance/throttle', () => ({ debounce: callback => callback }))
jest.mock('../src/lib/contexts/use-restore-component-state', () => {
  const actual = jest.requireActual('../src/lib/contexts/use-restore-component-state')
  return { ...actual, setComponentState: jest.fn() }
})

const { BlogPostsSection } = require('../src/templates/blog-page-template')
const { BackToList } = require('../src/templates/blog-post-template')

describe('blog scroll restoration', () => {
  beforeEach(() => {
    contextValueRef.current.historyState = {}
  })

  function renderBlogList() {
    return render(
      React.createElement(
        LayoutContext.Provider,
        { value: contextValueRef.current },
        React.createElement(BlogPostsSection, { posts: [], uri: '/blog' })
      )
    )
  }

  test('active blog list saves and restores its custom scroll position across navigation', () => {
    const scrollLayer = { scrollTop: 0, scrollHeight: 2000 }
    contextValueRef.current.scrollLayer = scrollLayer
    const view = renderBlogList()

    act(() => {
      scrollLayer.scrollTop = 600
      routerEventSource.emit(ROUTER_EVENTS.BEFORE_NAVIGATION)
    })

    expect(contextValueRef.current.historyState['/blog'].scroll.scroll_percent).toBe(0.3)

    view.unmount()
    scrollLayer.scrollTop = 0
    renderBlogList()

    expect(scrollLayer.scrollTop).toBe(600)
  })

  test('browser back saves the custom scroll position before the list remounts', () => {
    const scrollLayer = { scrollTop: 0, scrollHeight: 2000 }
    contextValueRef.current.scrollLayer = scrollLayer
    const view = renderBlogList()

    act(() => {
      scrollLayer.scrollTop = 600
      window.dispatchEvent(new PopStateEvent('popstate'))
    })

    expect(contextValueRef.current.historyState['/blog'].scroll.scroll_percent).toBe(0.3)

    view.unmount()
    scrollLayer.scrollTop = 0
    renderBlogList()

    expect(scrollLayer.scrollTop).toBe(600)
  })

  test('starts at the top when no previous blog scroll position exists', () => {
    const scrollLayer = { scrollTop: 600, scrollHeight: 2000 }
    contextValueRef.current.scrollLayer = scrollLayer

    renderBlogList()

    expect(scrollLayer.scrollTop).toBe(0)
  })

  test('Back To List disables Next scroll handling', () => {
    const view = render(React.createElement(BackToList))
    const link = view.getByRole('link', { name: 'Back To List' })

    expect(link.getAttribute('href')).toBe('/blog')
    expect(link.getAttribute('data-next-scroll')).toBe('false')
  })
})

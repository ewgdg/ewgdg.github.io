const React = require('react')
const { act, fireEvent, render } = require('@testing-library/react')

let pathname = '/blog'

jest.mock('next/navigation', () => ({
  usePathname: () => pathname,
  useSearchParams: () => ({ get: () => null }),
  useRouter: () => ({ push: jest.fn() }),
}))

jest.mock('next/link', () => React.forwardRef(({
  href,
  scroll,
  replace,
  onClick,
  children,
  ...props
}, ref) => React.createElement(
  'a',
  {
    ...props,
    ref,
    href,
    'data-next-scroll': String(scroll),
    onClick: event => {
      event.preventDefault()
      onClick?.(event)
    },
  },
  children
)))

jest.mock('../src/lib/dom/viewport', () => ({
  calcViewportHeight: value => `${value}vh`,
  isAnyInViewport: () => true,
  isBottomInViewport: () => true,
  isTopInViewport: () => true,
}))
let mockCompleteScrollAnimation = () => {}

jest.mock('../src/lib/dom/scroll', () => ({
  cancelScrollLayerAnimations: jest.fn(() => {
    mockCompleteScrollAnimation = () => {}
  }),
  clearAnimationQueue: jest.fn(),
  scrollByAnimated: jest.fn(),
  scrollIntoView: jest.fn((target, scrollLayer) => new Promise(resolve => {
    mockCompleteScrollAnimation = () => {
      scrollLayer.scrollTop = 866.25
      resolve()
    }
  })),
  ScrollDetector: { updateAll: jest.fn() },
}))
jest.mock('../src/components/header/header-container', () => ({ jumbotronProps }) =>
  React.createElement('header', { 'data-testid': 'blog-jumbotron' }, jumbotronProps?.headline)
)
jest.mock('../src/components/footer/footer', () => () => React.createElement('footer', null, 'Footer'))
jest.mock('../src/components/sections/parallax-section', () => ({ children }) => React.createElement('div', null, children))
jest.mock('../src/components/sections/fade-in-section', () => ({ children }) => React.createElement('div', null, children))
jest.mock('../src/components/page-scroll/section', () => ({ children, ...props }) => React.createElement('section', props, children))
jest.mock('../src/components/others/paginator', () => () => null)

const {
  cancelScrollLayerAnimations,
  scrollIntoView,
} = require('../src/lib/dom/scroll')
const { ROUTER_EVENTS, routerEventSource } = require('../src/lib/navigation/router')
const LayoutContext = require('../src/lib/contexts/layout-context').default
const MediaCard = require('../src/components/thumbnail/media-card').default
const useBlogPostCards = require('../src/components/others/use-blog-post-cards').default
const { BackToList } = require('../src/templates/blog-post-template')
const BlogRouteShell = require('../src/app/blog/blog-route-shell').default

function BlogCardHarness({ posts }) {
  const cards = useBlogPostCards(posts)
  return React.createElement(
    React.Fragment,
    null,
    cards.map(card => React.createElement(MediaCard, { ...card, key: card.title }))
  )
}

describe('blog route behavior', () => {
  beforeEach(() => {
    pathname = '/blog'
    mockCompleteScrollAnimation = () => {}
    jest.clearAllMocks()
    routerEventSource.clear()
  })

  afterEach(() => {
    routerEventSource.clear()
  })

  test('internal cards coordinate navigation through the custom Link while preserving anchors', () => {
    const posts = [
      {
        uri: '/blog/internal-post',
        frontmatter: {
          title: 'Internal post',
          description: 'Internal description',
          date: '2025-01-01',
        },
      },
      {
        uri: '/blog/external-post',
        frontmatter: {
          title: 'External post',
          description: 'External description',
          date: '2025-01-02',
          externalLink: 'https://example.com/article',
        },
      },
    ]

    const beforeNavigation = jest.fn()
    routerEventSource.subscribe(ROUTER_EVENTS.BEFORE_NAVIGATION, beforeNavigation)
    const cards = render(React.createElement(BlogCardHarness, { posts }))

    const internalLinks = cards.getAllByRole('link', { name: /Internal post/i })
    expect(internalLinks[0].getAttribute('href')).toBe('/blog/internal-post')
    expect(internalLinks[0].getAttribute('data-next-scroll')).toBe('false')

    fireEvent.click(internalLinks[0])
    expect(beforeNavigation).toHaveBeenCalledWith(expect.objectContaining({
      type: 'push',
      href: '/blog/internal-post',
      from: '/blog',
      source: 'Link',
    }))

    const externalLinks = cards.getAllByRole('link', { name: /External post/i })
    expect(externalLinks[0].getAttribute('href')).toBe('https://example.com/article')
    expect(externalLinks[0].getAttribute('target')).toBe('_blank')
    expect(externalLinks[0].getAttribute('rel')).toBe('noopener noreferrer')
    expect(externalLinks[0].hasAttribute('data-next-scroll')).toBe(false)
    expect(beforeNavigation).toHaveBeenCalledTimes(1)

    cards.unmount()

    const back = render(React.createElement(BackToList))
    expect(back.getByRole('link', { name: 'Back To List' }).getAttribute('href')).toBe('/blog')
    expect(back.getByRole('link', { name: 'Back To List' }).getAttribute('data-next-scroll')).toBe('false')
  })

  test('switching between list and reader retains the same hidden blog index and its local state', () => {
    const posts = [{
      uri: '/blog/internal-post',
      frontmatter: {
        title: 'Internal post',
        description: 'Internal description',
        date: '2025-01-01',
      },
    }]
    const props = {
      posts,
      jumbotronProps: { headline: 'Blog' },
    }
    const scrollLayer = document.createElement('div')
    const context = { scrollLayer, historyState: {} }
    const renderShell = children => React.createElement(
      LayoutContext.Provider,
      { value: context },
      React.createElement(BlogRouteShell, props, children)
    )

    pathname = '/blog'
    const view = render(renderShell(null))
    const blogIndex = view.getByTestId('blog-index')
    const jumbotron = view.getByTestId('blog-jumbotron')
    const search = view.getByRole('searchbox', { name: 'Search' })

    fireEvent.change(search, { target: { value: 'retained query' } })
    scrollLayer.scrollTop = 430

    pathname = '/blog/internal-post'
    view.rerender(renderShell(React.createElement('article', null, 'Reader content')))

    expect(view.getByTestId('blog-index')).toBe(blogIndex)
    expect(blogIndex.className).toContain('blogIndex')
    expect(blogIndex.getAttribute('aria-hidden')).toBe('true')
    expect(view.getByTestId('blog-jumbotron')).toBe(jumbotron)
    expect(view.getByRole('searchbox', { name: 'Search', hidden: true }).value).toBe('retained query')
    expect(scrollLayer.scrollTop).toBe(430)

    pathname = '/blog'
    view.rerender(renderShell(null))

    expect(view.getByTestId('blog-index')).toBe(blogIndex)
    expect(blogIndex.hasAttribute('aria-hidden')).toBe(false)
    expect(view.getByRole('searchbox', { name: 'Search' }).value).toBe('retained query')
    expect(scrollLayer.scrollTop).toBe(430)
  })

  test('the reader is an independent accessible scroll region that starts at the top', () => {
    const props = {
      posts: [],
      jumbotronProps: { headline: 'Blog' },
    }
    const scrollLayer = document.createElement('div')
    const context = { scrollLayer, historyState: {} }
    const renderShell = children => React.createElement(
      LayoutContext.Provider,
      { value: context },
      React.createElement(BlogRouteShell, props, children)
    )

    pathname = '/blog'
    const view = render(renderShell(null))
    const blogIndex = view.getByTestId('blog-index')
    scrollLayer.scrollTop = 275

    pathname = '/blog/first-post'
    view.rerender(renderShell(React.createElement('article', null, 'First article')))

    const reader = view.getByRole('region', { name: 'Blog post' })
    expect(reader.scrollTop).toBe(0)
    expect(reader.className).toContain('reader')
    expect(blogIndex.className).toContain('blogIndex')
    expect(scrollLayer.scrollTop).toBe(275)
    expect(blogIndex.contains(reader)).toBe(false)
    expect(reader.parentElement).toBe(blogIndex.parentElement)

    reader.scrollTop = 800
    pathname = '/blog/second-post'
    view.rerender(renderShell(React.createElement('article', null, 'Second article')))

    expect(view.getByRole('region', { name: 'Blog post' }).scrollTop).toBe(0)
    expect(scrollLayer.scrollTop).toBe(275)
  })

  test('reader state semantically hides the blog index and disables its navigation input', async () => {
    const scrollLayer = document.createElement('div')
    Object.defineProperty(scrollLayer, 'clientHeight', { value: 800 })
    const context = { scrollLayer, historyState: {} }
    const props = {
      posts: [],
      jumbotronProps: { headline: 'Blog' },
    }
    const renderShell = children => React.createElement(
      LayoutContext.Provider,
      { value: context },
      React.createElement(BlogRouteShell, props, children)
    )

    pathname = '/blog'
    const view = render(renderShell(null))
    fireEvent.keyDown(document, { key: 'ArrowDown' })
    expect(scrollIntoView).toHaveBeenCalledTimes(1)
    await act(async () => Promise.resolve())

    scrollIntoView.mockClear()
    pathname = '/blog/internal-post'
    view.rerender(renderShell(React.createElement('article', null, 'Reader content')))

    const blogIndex = view.getByTestId('blog-index')
    expect(blogIndex.getAttribute('aria-hidden')).toBe('true')
    expect(blogIndex.hasAttribute('inert')).toBe(true)

    fireEvent.keyDown(document, { key: 'ArrowDown' })
    expect(scrollIntoView).not.toHaveBeenCalled()
  })

  test('disabling the list cancels an in-flight scroll animation before it can move the retained layer', () => {
    const scrollLayer = document.createElement('div')
    Object.defineProperty(scrollLayer, 'clientHeight', { value: 800 })
    const context = { scrollLayer, historyState: {} }
    const props = {
      posts: [],
      jumbotronProps: { headline: 'Blog' },
    }
    const renderShell = children => React.createElement(
      LayoutContext.Provider,
      { value: context },
      React.createElement(BlogRouteShell, props, children)
    )

    const view = render(renderShell(null))
    scrollLayer.scrollTop = 133.5
    fireEvent.keyDown(document, { key: 'ArrowDown' })
    expect(scrollIntoView).toHaveBeenCalledTimes(1)

    pathname = '/blog/internal-post'
    view.rerender(renderShell(React.createElement('article', null, 'Reader content')))
    act(() => mockCompleteScrollAnimation())

    expect(scrollLayer.scrollTop).toBe(133.5)
    expect(cancelScrollLayerAnimations).toHaveBeenCalledWith(scrollLayer)
  })

  test('returning from a post restores focus to the card that opened it', () => {
    const props = {
      posts: [{
        uri: '/blog/internal-post',
        frontmatter: {
          title: 'Internal post',
          description: 'Internal description',
          date: '2025-01-01',
        },
      }],
      jumbotronProps: { headline: 'Blog' },
    }

    pathname = '/blog'
    const view = render(React.createElement(BlogRouteShell, props, null))
    const invokingLink = view.getAllByRole('link', { name: /Internal post/i })[0]
    act(() => invokingLink.focus())
    fireEvent.click(invokingLink)

    pathname = '/blog/internal-post'
    view.rerender(React.createElement(
      BlogRouteShell,
      props,
      React.createElement('article', null, 'Reader content')
    ))
    expect(document.activeElement).toBe(view.getByRole('region', { name: 'Blog post' }))

    pathname = '/blog'
    view.rerender(React.createElement(BlogRouteShell, props, null))

    expect(document.activeElement).toBe(invokingLink)
  })
})

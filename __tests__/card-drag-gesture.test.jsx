const React = require('react')
const { fireEvent, render } = require('@testing-library/react')

jest.mock('next/navigation', () => ({
  usePathname: () => '/blog',
}))

jest.mock('next/link', () => React.forwardRef(({
  href,
  replace,
  onClick,
  children,
  ...props
}, ref) => React.createElement('a', {
  ...props,
  ref,
  href,
  onClick: event => {
    event.preventDefault()
    onClick?.(event)
  },
}, children)))

jest.mock('../src/lib/dom/viewport', () => ({
  isAnyInViewport: () => true,
  isBottomInViewport: () => true,
  isTopInViewport: () => true,
}))

jest.mock('../src/lib/dom/scroll', () => ({
  cancelScrollLayerAnimations: jest.fn(),
  clearAnimationQueue: jest.fn(),
  scrollByAnimated: jest.fn(),
  scrollIntoView: jest.fn(() => Promise.resolve()),
  ScrollDetector: { updateAll: jest.fn() },
}))

const LayoutContext = require('../src/lib/contexts/layout-context').default
const { ROUTER_EVENTS, routerEventSource } = require('../src/lib/navigation/router')
const PageContainer = require('../src/components/page-scroll/container').default
const MediaCard = require('../src/components/thumbnail/media-card').default
const ImageCard = require('../src/components/thumbnail/image-based-card').default

function dispatchPointer(target, type, { clientY, pointerId = 1, pointerType = 'mouse' }) {
  const event = new Event(type, { bubbles: true, cancelable: true })
  Object.defineProperties(event, {
    clientY: { value: clientY },
    pointerId: { value: pointerId },
    pointerType: { value: pointerType },
  })
  fireEvent(target, event)
}

function dispatchClick(target, { detail, pointerId } = {}) {
  const event = new MouseEvent('click', { bubbles: true, cancelable: true, detail })
  if (pointerId !== undefined) {
    Object.defineProperty(event, 'pointerId', { value: pointerId })
  }
  fireEvent(target, event)
}

function renderPageContainer(children) {
  const scrollLayer = document.createElement('div')
  Object.defineProperty(scrollLayer, 'clientHeight', { value: 800 })
  scrollLayer.setPointerCapture = jest.fn()
  scrollLayer.releasePointerCapture = jest.fn()
  document.body.appendChild(scrollLayer)
  const context = { scrollLayer, historyState: {} }
  const pageContainer = props => React.createElement(
    LayoutContext.Provider,
    { value: context },
    React.createElement(
      PageContainer,
      props,
      React.createElement('section', null, children)
    )
  )

  const view = render(pageContainer(), { container: scrollLayer })

  return {
    ...view,
    scrollLayer,
    rerenderPageContainer: props => view.rerender(pageContainer(props)),
  }
}

describe('card pointer gestures', () => {
  beforeEach(() => {
    window.PointerEvent = window.MouseEvent
    Object.defineProperty(navigator, 'maxTouchPoints', {
      configurable: true,
      value: 10,
    })
    routerEventSource.clear()
  })

  afterEach(() => {
    jest.useRealTimers()
    routerEventSource.clear()
  })
  test('every card link keeps its canonical href without enabling native dragging', () => {
    const view = render(React.createElement(
      React.Fragment,
      null,
      React.createElement(MediaCard, {
        href: '/blog/internal-post',
        title: 'Internal media card',
        description: 'Internal description',
      }),
      React.createElement(MediaCard, {
        href: 'https://example.com/external-post',
        target: '_blank',
        rel: 'noopener noreferrer',
        title: 'External media card',
        description: 'External description',
      }),
      React.createElement(ImageCard, {
        href: '/work/internal-project',
        title: 'Internal image card',
        description: 'Internal project',
      }),
      React.createElement(ImageCard, {
        href: 'https://example.com/external-project',
        target: '_blank',
        rel: 'noopener noreferrer',
        title: 'External image card',
        description: 'External project',
      })
    ))

    const expectedLinks = [
      ['/blog/internal-post', 2],
      ['https://example.com/external-post', 2],
      ['/work/internal-project', 1],
      ['https://example.com/external-project', 1],
    ]

    expectedLinks.forEach(([href, count]) => {
      const links = view.container.querySelectorAll(`a[href="${href}"]`)
      expect(links).toHaveLength(count)
      links.forEach(link => expect(link.draggable).toBe(false))
    })
  })

  test('sub-threshold mouse movement on a touch-capable device neither scrolls nor blocks the link', () => {
    const beforeNavigation = jest.fn()
    routerEventSource.subscribe(ROUTER_EVENTS.BEFORE_NAVIGATION, beforeNavigation)
    const view = renderPageContainer(React.createElement(MediaCard, {
      href: '/blog/internal-post',
      title: 'Internal media card',
      description: 'Internal description',
    }))
    const link = view.getAllByRole('link', { name: /Internal media card/i })[0]

    dispatchPointer(link, 'pointerdown', { clientY: 100 })
    dispatchPointer(link, 'pointermove', { clientY: 99 })

    expect(view.scrollLayer.scrollTop).toBe(0)

    dispatchPointer(link, 'pointerup', { clientY: 99 })
    dispatchClick(link, { detail: 1, pointerId: 1 })

    expect(beforeNavigation).toHaveBeenCalledTimes(1)
    expect(beforeNavigation).toHaveBeenCalledWith(expect.objectContaining({
      href: '/blog/internal-post',
      source: 'Link',
    }))
  })

  test('crossing the threshold gives the page continued movement and suppresses link activation', () => {
    const beforeNavigation = jest.fn()
    routerEventSource.subscribe(ROUTER_EVENTS.BEFORE_NAVIGATION, beforeNavigation)
    const view = renderPageContainer(React.createElement(MediaCard, {
      href: '/blog/internal-post',
      title: 'Internal media card',
      description: 'Internal description',
    }))
    const link = view.getAllByRole('link', { name: /Internal media card/i })[0]
    view.scrollLayer.releasePointerCapture.mockImplementation(pointerId => {
      dispatchPointer(view.scrollLayer, 'lostpointercapture', { clientY: 90, pointerId })
    })

    dispatchPointer(link, 'pointerdown', { clientY: 100 })
    dispatchPointer(link, 'pointermove', { clientY: 96 })
    const scrollTopAfterThreshold = view.scrollLayer.scrollTop
    dispatchPointer(link, 'pointermove', { clientY: 90 })

    expect(scrollTopAfterThreshold).toBeGreaterThan(0)
    expect(view.scrollLayer.scrollTop).toBeGreaterThan(scrollTopAfterThreshold)
    expect(view.scrollLayer.setPointerCapture).toHaveBeenCalledWith(1)

    dispatchPointer(link, 'pointerup', { clientY: 90 })
    dispatchClick(link, { detail: 1, pointerId: 1 })

    expect(view.scrollLayer.releasePointerCapture).toHaveBeenCalledWith(1)
    expect(beforeNavigation).not.toHaveBeenCalled()
  })

  test('click suppression only matches the pointer that completed the drag', () => {
    const beforeNavigation = jest.fn()
    routerEventSource.subscribe(ROUTER_EVENTS.BEFORE_NAVIGATION, beforeNavigation)
    const view = renderPageContainer(React.createElement(MediaCard, {
      href: '/blog/internal-post',
      title: 'Internal media card',
      description: 'Internal description',
    }))
    const link = view.getAllByRole('link', { name: /Internal media card/i })[0]

    dispatchPointer(link, 'pointerdown', { clientY: 100, pointerId: 7 })
    dispatchPointer(link, 'pointermove', { clientY: 96, pointerId: 7 })
    dispatchPointer(link, 'pointerup', { clientY: 96, pointerId: 7 })
    dispatchClick(link, { detail: 1, pointerId: 8 })

    expect(beforeNavigation).toHaveBeenCalledTimes(1)
  })

  test('a drag without a compatibility click does not block keyboard activation', () => {
    const beforeNavigation = jest.fn()
    routerEventSource.subscribe(ROUTER_EVENTS.BEFORE_NAVIGATION, beforeNavigation)
    const view = renderPageContainer(React.createElement(MediaCard, {
      href: '/blog/internal-post',
      title: 'Internal media card',
      description: 'Internal description',
    }))
    const link = view.getAllByRole('link', { name: /Internal media card/i })[0]

    dispatchPointer(link, 'pointerdown', { clientY: 100, pointerId: 7 })
    dispatchPointer(link, 'pointermove', { clientY: 96, pointerId: 7 })
    dispatchPointer(link, 'pointerup', { clientY: 96, pointerId: 7 })
    dispatchClick(link, { detail: 0 })

    expect(beforeNavigation).toHaveBeenCalledTimes(1)
  })

  test('a canceled drag with no synthesized click does not poison a later activation', () => {
    jest.useFakeTimers()
    const beforeNavigation = jest.fn()
    routerEventSource.subscribe(ROUTER_EVENTS.BEFORE_NAVIGATION, beforeNavigation)
    const view = renderPageContainer(React.createElement(ImageCard, {
      href: '/work/internal-project',
      title: 'Internal image card',
      description: 'Internal project',
    }))
    const link = view.getByRole('link', { name: /Internal image card/i })

    dispatchPointer(link, 'pointerdown', { clientY: 100, pointerId: 2 })
    dispatchPointer(link, 'pointermove', { clientY: 96, pointerId: 2 })
    dispatchPointer(link, 'pointercancel', { clientY: 96, pointerId: 2 })

    expect(view.scrollLayer.releasePointerCapture).toHaveBeenCalledWith(2)

    jest.runOnlyPendingTimers()
    dispatchClick(link, { detail: 1, pointerId: 2 })

    expect(beforeNavigation).toHaveBeenCalledTimes(1)

    dispatchPointer(link, 'pointerdown', { clientY: 100, pointerId: 3 })
    dispatchPointer(link, 'pointerup', { clientY: 100, pointerId: 3 })
    dispatchClick(link, { detail: 1, pointerId: 3 })

    expect(beforeNavigation).toHaveBeenCalledTimes(2)
  })

  test('click suppression does not poison an unrelated control or a fresh tap', () => {
    const beforeNavigation = jest.fn()
    const unrelatedClick = jest.fn()
    routerEventSource.subscribe(ROUTER_EVENTS.BEFORE_NAVIGATION, beforeNavigation)
    const view = renderPageContainer(React.createElement(
      React.Fragment,
      null,
      React.createElement(MediaCard, {
        href: '/blog/internal-post',
        title: 'Internal media card',
        description: 'Internal description',
      }),
      React.createElement('button', { onClick: unrelatedClick }, 'Unrelated control')
    ))
    const link = view.getAllByRole('link', { name: /Internal media card/i })[0]
    const button = view.getByRole('button', { name: 'Unrelated control' })

    dispatchPointer(link, 'pointerdown', { clientY: 100, pointerId: 1 })
    dispatchPointer(link, 'pointermove', { clientY: 96, pointerId: 1 })
    dispatchPointer(link, 'pointerup', { clientY: 96, pointerId: 1 })
    dispatchClick(button, { detail: 1, pointerId: 9 })

    expect(unrelatedClick).toHaveBeenCalledTimes(1)

    dispatchPointer(link, 'pointerdown', { clientY: 100, pointerId: 2 })
    dispatchPointer(link, 'pointerup', { clientY: 100, pointerId: 2 })
    dispatchClick(link, { detail: 1, pointerId: 2 })

    expect(beforeNavigation).toHaveBeenCalledTimes(1)
  })

  test('a pending pointer that leaves the scroll layer does not block a fresh drag', () => {
    const view = renderPageContainer(React.createElement(
      React.Fragment,
      null,
      React.createElement(MediaCard, {
        href: '/blog/internal-post',
        title: 'Internal media card',
        description: 'Internal description',
      }),
      React.createElement('div', { 'data-testid': 'non-interactive-content' }, 'Page content')
    ))
    const link = view.getAllByRole('link', { name: /Internal media card/i })[0]
    const content = view.getByTestId('non-interactive-content')

    dispatchPointer(link, 'pointerdown', { clientY: 100 })
    dispatchPointer(view.scrollLayer, 'pointerleave', { clientY: 100 })
    dispatchPointer(content, 'pointerdown', { clientY: 100, pointerId: 2 })
    dispatchPointer(content, 'pointermove', { clientY: 95, pointerId: 2 })

    expect(view.scrollLayer.scrollTop).toBe(5)
    expect(view.scrollLayer.setPointerCapture).toHaveBeenCalledWith(2)
  })

  test('unexpected capture loss resets an owned drag without ending drags on pointer leave', () => {
    const view = renderPageContainer(React.createElement(
      React.Fragment,
      null,
      React.createElement(MediaCard, {
        href: '/blog/internal-post',
        title: 'Internal media card',
        description: 'Internal description',
      }),
      React.createElement('div', { 'data-testid': 'non-interactive-content' }, 'Page content')
    ))
    const link = view.getAllByRole('link', { name: /Internal media card/i })[0]
    const content = view.getByTestId('non-interactive-content')

    dispatchPointer(link, 'pointerdown', { clientY: 100 })
    dispatchPointer(link, 'pointermove', { clientY: 96 })
    dispatchPointer(view.scrollLayer, 'pointerleave', { clientY: 96 })
    dispatchPointer(view.scrollLayer, 'pointermove', { clientY: 90 })
    expect(view.scrollLayer.scrollTop).toBe(10)

    dispatchPointer(view.scrollLayer, 'lostpointercapture', { clientY: 90 })
    dispatchPointer(content, 'pointerdown', { clientY: 100, pointerId: 2 })
    dispatchPointer(content, 'pointermove', { clientY: 95, pointerId: 2 })

    expect(view.scrollLayer.scrollTop).toBe(15)
    expect(view.scrollLayer.setPointerCapture).toHaveBeenLastCalledWith(2)
  })

  test('disabling the page container releases an owned pointer gesture', () => {
    const view = renderPageContainer(React.createElement(ImageCard, {
      href: '/work/internal-project',
      title: 'Internal image card',
      description: 'Internal project',
    }))
    const link = view.getByRole('link', { name: /Internal image card/i })

    dispatchPointer(link, 'pointerdown', { clientY: 100 })
    dispatchPointer(link, 'pointermove', { clientY: 96 })

    view.rerenderPageContainer({ enabled: false })

    expect(view.scrollLayer.releasePointerCapture).toHaveBeenCalledWith(1)
  })

  test('unmounting releases an owned pointer gesture', () => {
    const view = renderPageContainer(React.createElement(ImageCard, {
      href: '/work/internal-project',
      title: 'Internal image card',
      description: 'Internal project',
    }))
    const link = view.getByRole('link', { name: /Internal image card/i })

    dispatchPointer(link, 'pointerdown', { clientY: 100 })
    dispatchPointer(link, 'pointermove', { clientY: 96 })
    view.unmount()

    expect(view.scrollLayer.releasePointerCapture).toHaveBeenCalledWith(1)
  })

  test('a pointer started outside a control still drags the page immediately', () => {
    const view = renderPageContainer(React.createElement(
      'div',
      { 'data-testid': 'non-interactive-content' },
      'Page content'
    ))
    const content = view.getByTestId('non-interactive-content')

    dispatchPointer(content, 'pointerdown', { clientY: 100 })
    dispatchPointer(content, 'pointermove', { clientY: 99 })

    expect(view.scrollLayer.scrollTop).toBe(1)
    expect(view.scrollLayer.setPointerCapture).toHaveBeenCalledWith(1)
  })
})

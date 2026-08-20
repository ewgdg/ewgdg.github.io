'use client'

import React, { useLayoutEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { BlogPageFrame, BlogPostsSection } from '@/templates/blog-page-template'
import styles from './blog-route-shell.module.css'

const BLOG_URI = '/blog'

export default function BlogRouteShell({ posts, jumbotronProps, children }) {
  const pathname = usePathname()
  const normalizedPathname = pathname.replace(/\/+$/, '') || '/'
  const isReading = normalizedPathname !== BLOG_URI
  const readerRef = useRef(null)
  const invokingLinkRef = useRef(null)
  const wasReadingRef = useRef(isReading)

  useLayoutEffect(() => {
    if (isReading && readerRef.current) {
      readerRef.current.scrollTop = 0
      readerRef.current.focus({ preventScroll: true })
    } else if (wasReadingRef.current && invokingLinkRef.current?.isConnected) {
      invokingLinkRef.current.focus({ preventScroll: true })
      invokingLinkRef.current = null
    }
    wasReadingRef.current = isReading
  }, [isReading, pathname])

  function rememberInvokingCard(event) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return
    }

    const link = event.target.closest('a[href]')
    if (!link || link.target === '_blank') return

    const destination = new URL(link.href, window.location.href)
    const normalizedDestination = destination.pathname.replace(/\/+$/, '') || '/'
    if (destination.origin === window.location.origin && normalizedDestination.startsWith(`${BLOG_URI}/`)) {
      invokingLinkRef.current = link
    }
  }

  return (
    <>
      <BlogPageFrame
        jumbotronProps={jumbotronProps}
        enabled={!isReading}
        className={styles.blogIndex}
        data-testid="blog-index"
        onClickCapture={rememberInvokingCard}
        aria-hidden={isReading || undefined}
        inert={isReading}
      >
        <BlogPostsSection posts={posts} />
      </BlogPageFrame>
      {isReading ? (
        <div
          ref={readerRef}
          className={styles.reader}
          role="region"
          aria-label="Blog post"
          tabIndex={-1}
        >
          {children}
        </div>
      ) : null}
    </>
  )
}
